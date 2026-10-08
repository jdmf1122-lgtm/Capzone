import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { UserPlus, ArrowRight } from 'lucide-react';
import { ROXAS_BARANGAYS } from '../data/roxasBarangays';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { setCurrentPage, showToast, pendingAuthAction, executePendingAuthAction } = useShop();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [barangay, setBarangay] = useState<string>(ROXAS_BARANGAYS[0]);
  const [streetAddress, setStreetAddress] = useState('');
  const [city] = useState('Roxas, Oriental Mindoro');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    const fullAddress = `${streetAddress}, Barangay ${barangay}`;

    const res = register({
      fullname,
      email,
      password,
      contactNumber,
      address: fullAddress,
      city,
      postalCode: '5212',
      role: 'user'
    });

    if (!res.success) {
      setError(res.message || 'Registration failed.');
    } else {
      showToast('Welcome to CapZone! Account created successfully.', 'success');
      if (pendingAuthAction) {
        executePendingAuthAction();
      } else {
        setCurrentPage('shop');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-2xl font-extrabold font-['Syne'] text-white">
          CapZone<span className="text-blue-500">.</span>
        </span>
        <h1 className="text-2xl font-bold font-['Syne'] text-white">
          Create CapZone Account
        </h1>
        <p className="text-xs text-gray-400">
          Join the premier streetwear headwear club for exclusive drop privileges.
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
            <label className="text-xs font-mono text-gray-400 block mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kenji Cruz"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="kenji@example.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Password (min 6 characters) *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Mobile Contact Number *</label>
            <input
              type="tel"
              required
              placeholder="+63 9XX XXX XXXX"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Roxas Barangay *</label>
              <select
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                {ROXAS_BARANGAYS.map((brgy) => (
                  <option key={brgy} value={brgy}>
                    Barangay {brgy}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Street / House No. *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rizal St. / Purok 2"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Complete Registration</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-400">
          Already a member?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="text-blue-400 hover:underline font-semibold"
          >
            Sign In here →
          </button>
        </div>
      </div>
    </div>
  );
};
