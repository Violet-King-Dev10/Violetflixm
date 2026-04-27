import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Logo } from '../components/Logo';
import { LogIn, UserPlus, HelpCircle } from 'lucide-react';

export function UserLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!normalizedEmail || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (isRegister && !normalizedName) {
      setError('Please enter your full name to create an account.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(normalizedEmail, password, normalizedName);
      }
      await login(normalizedEmail, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <Link to="/" className="absolute top-8 left-8 z-20 hover:opacity-80 transition-opacity">
        <Logo />
      </Link>

      <div className="absolute inset-0 z-0">
         <img
            src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-50"
            alt="background"
         />
         <div className="absolute inset-0 bg-black/70" />
      </div>

      <Card className="w-full max-w-md bg-black/80 border border-white/10 text-white z-10 p-4 md:p-8 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            {isRegister ? <><UserPlus className="w-8 h-8 text-red-600" /> Sign Up</> : <><LogIn className="w-8 h-8 text-red-600" /> Sign In</>}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isRegister && (
              <Input
                placeholder="Full Name"
                className="bg-white/10 border-white/20 py-6 focus:bg-white/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              className="bg-white/10 border-white/20 py-6 focus:bg-white/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-white/10 border-white/20 py-6 focus:bg-white/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 py-6 text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isRegister ? <><UserPlus className="w-5 h-5" /> {submitting ? 'Creating account...' : 'Start Membership'}</> : <><LogIn className="w-5 h-5" /> {submitting ? 'Signing in...' : 'Sign In'}</>}
            </Button>
            <div className="flex items-center justify-between w-full text-sm text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 checked:bg-red-600" />
                <span className="group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link to="/about" className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <HelpCircle className="w-4 h-4" /> Need help?
              </Link>
            </div>
            <div className="mt-8 text-gray-500 text-left w-full space-y-4 border-t border-white/10 pt-6">
              <p>
                {isRegister ? 'Already have an account?' : 'New to VioletFlix Movie?'}
                <button
                  type="button"
                  className="text-white hover:underline ml-2 font-bold"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? 'Sign in now.' : 'Sign up now.'}
                </button>
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">
                Please sign in with your account to continue streaming and managing your profile.
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
