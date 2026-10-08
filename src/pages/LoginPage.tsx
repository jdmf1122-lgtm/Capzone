import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { LogIn, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { setCurrentPage, showToast, pendingAuthAction, executePendingAuthAction } = useShop();

  const [email, setEmail] = useState('juan.delacruz@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.success) {
      setError(res.message || 'Login failed.');
    } else {
      showToast('Successfully signed in!', 'success');
      if (pendingAuthAction) {
        executePendingAuthAction();
      } else {
        setCurrentPage('shop');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFillDemoCustomer = () => {
    setEmail('juan.delacruz@example.com');
    setPassword('password123');
    setError('');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@capzone.ph');
    setPassword('adminpassword');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-2xl font-extrabold font-['Syne'] text-white">
          CapZone<span className="text-blue-500">.</span>
        </span>
        <h1 className="text-2xl font-bold font-['Syne'] text-white">
          Welcome Back
        </h1>
        <p className="text-xs text-gray-400">
          Sign in to access your order tracking, saved address, and member-only drops.
        </p>
      </div>

      <div className="p-6 sm:p-8 bg-[#111827] rounded-2xl border border-white/10 shadow-2xl space-y-5">
        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono text-gray-400">Password</label>
              <button
                type="button"
                onClick={() => showToast('Hint: For demo, password is "password123"', 'info')}
                className="text-[11px] text-blue-400 hover:underline font-mono"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Account</span>
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block text-center">
            Fast Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillDemoCustomer}
              className="px-3 py-1.5 bg-[#182232] hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-mono text-blue-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" /> Customer
            </button>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="px-3 py-1.5 bg-[#182232] hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-mono text-amber-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-gray-400">
          Don&apos;t have a CapZone account yet?{' '}
          <button
            onClick={() => setCurrentPage('register')}
            className="text-blue-400 hover:underline font-semibold"
          >
            Create Account →
          </button>
        </div>
      </div>
    </div>
  );
};
