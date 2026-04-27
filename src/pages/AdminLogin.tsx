import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Shield, LogIn } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@violetflix.movie';
    const adminPass = process.env.ADMIN_PASSWORD || 'violetflixadmin';

    if (email === adminEmail && password === adminPass) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] px-4">
      <Card className="w-full max-w-md bg-black/60 border-white/10 text-white backdrop-blur-xl">
        <CardHeader className="space-y-1 items-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          <CardDescription className="text-gray-400">
            Secure login for violetflix administrators
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <Input
                type="email"
                placeholder="email@violetflix.movie"
                className="bg-white/5 border-white/10 focus:border-red-600 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 focus:border-red-600 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" /> Authenticate
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
