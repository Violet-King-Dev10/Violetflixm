import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import Pusher from "pusher";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Pusher setup
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// MongoDB Setup
const MONGODB_URL = process.env.MONGODB_URL;
if (MONGODB_URL) {
  mongoose.connect(MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// User Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  githubId: { type: String },
  watchHistory: [{
    subjectId: String,
    title: String,
    coverUrl: String,
    subjectType: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  preferences: {
    theme: { type: String, default: 'dark' },
    autoplay: { type: Boolean, default: true }
  },
  socialLinks: [{
    platform: String,
    url: String
  }],
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' }
});
const User = mongoose.model("User", UserSchema);

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");

// Auth Middleware
const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- API ROUTES ---

app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);
    res.json({ token, user: { email: user.email, name: user.name, id: user._id } });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/user/me", authMiddleware, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.patch("/api/user/profile", authMiddleware, async (req: any, res) => {
  try {
    const { name, bio, avatarUrl, socialLinks, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { name, bio, avatarUrl, socialLinks, preferences } },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.post("/api/user/history", authMiddleware, async (req: any, res) => {
  try {
    const { subjectId, title, coverUrl, subjectType } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Remove if already exists to move to front
    const filteredHistory = user.watchHistory.filter(h => h.subjectId !== subjectId);
    const newEntry = { subjectId, title, coverUrl, subjectType, timestamp: new Date() };
    
    // Using any to bypass mongoose/ts strict array type mismatch during transition
    user.watchHistory = [newEntry, ...filteredHistory].slice(0, 50) as any;
    
    await user.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to update history" });
  }
});

// Real-time Chat/Discussion
app.post("/api/chat/send", authMiddleware, async (req: any, res) => {
  const { movieId, message, name } = req.body;
  try {
    const chatMsg = {
      id: Date.now().toString(),
      movieId,
      message,
      name: name || req.user.email,
      timestamp: new Date().toISOString(),
    };
    await pusher.trigger(`movie-${movieId}`, "message", chatMsg);
    res.json({ success: true, message: chatMsg });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Notifications
app.post("/api/notifications/send", async (req, res) => {
  const { title, message } = req.body;
  try {
    await pusher.trigger("global-notifications", "notify", {
      title,
      message,
      timestamp: new Date().toISOString(),
    });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Anime Proxy
app.get("/api/proxy/anime/search", async (req, res) => {
  const { query } = req.query;
  try {
    const response = await fetch(`https://apis.prexzyvilla.site/anime/animesearch?query=${encodeURIComponent(query as string)}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch anime data" });
  }
});

app.get("/api/proxy/anime/detail", async (req, res) => {
  const { url } = req.query;
  try {
    const response = await fetch(`https://apis.prexzyvilla.site/anime/animedetail?url=${encodeURIComponent(url as string)}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch anime detail" });
  }
});

app.get("/api/proxy/anime/download", async (req, res) => {
  const { url } = req.query;
  try {
    const response = await fetch(`https://apis.prexzyvilla.site/anime/animedownload?url=${encodeURIComponent(url as string)}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch anime downloads" });
  }
});

// Stream info proxy or direct
app.get("/api/proxy/movie/detail", async (req, res) => {
  const { subjectId } = req.query;
  try {
    const response = await fetch(`https://movieapi.xcasper.space/api/detail?subjectId=${subjectId}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch movie detail" });
  }
});

app.get("/api/proxy/movie/recommend", async (req, res) => {
  const { subjectId, page, perPage } = req.query;
  try {
    const response = await fetch(`https://movieapi.xcasper.space/api/recommend?subjectId=${subjectId}&page=${page || 1}&perPage=${perPage || 10}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

app.get("/api/proxy/movie/trending", async (req, res) => {
  const { page, perPage } = req.query;
  try {
    const response = await fetch(`https://movieapi.xcasper.space/api/trending?page=${page}&perPage=${perPage}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

app.get("/api/proxy/movie/search", async (req, res) => {
  const { keyword, page, perPage, subjectType } = req.query;
  try {
    let url = `https://movieapi.xcasper.space/api/search?keyword=${encodeURIComponent(keyword as string)}&page=${page || 1}&perPage=${perPage || 20}`;
    if (subjectType) url += `&subjectType=${subjectType}`;
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to search movies" });
  }
});

app.get("/api/proxy/movie/homepage", async (req, res) => {
  try {
    const response = await fetch(`https://movieapi.xcasper.space/api/homepage`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch homepage data" });
  }
});

app.get("/api/proxy/movie/hot", async (req, res) => {
  try {
    const response = await fetch(`https://movieapi.xcasper.space/api/hot`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch hot movies" });
  }
});

app.get("/api/proxy/movie/browse", async (req, res) => {
  const { subjectType, page, perPage } = req.query;
  try {
    let url = `https://movieapi.xcasper.space/api/browse?page=${page || 1}&perPage=${perPage || 18}`;
    if (subjectType) url += `&subjectType=${subjectType}`;
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to browse movies" });
  }
});

app.get("/api/proxy/movie/ranking", async (req, res) => {
  const { page, perPage } = req.query;
  try {
    const response = await fetch(`https://movieapi.xcasper.space/api/ranking?page=${page}&perPage=${perPage}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch ranking" });
  }
});

app.get("/api/proxy/user/vip", async (req, res) => {
  try {
    const response = await fetch(`https://api.onspace.ai/api/user/getvipbydomain`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch VIP status" });
  }
});

// Stream info proxy or direct
app.get("/api/proxy/play", async (req, res) => {
  const { subjectId } = req.query;
  try {
    const response = await fetch(`https://movieapi.xcasper.space/api/play?subjectId=${subjectId}`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch stream data" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
