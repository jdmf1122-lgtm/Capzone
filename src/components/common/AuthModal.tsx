import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { X, LogIn, UserPlus, ShieldAlert, Sparkles, UserCheck, Lock } from 'lucide-react';
import { ROXAS_BARANGAYS } from '../../data/roxasBarangays';

export const AuthModal: React.FC = () => {
  const { login, register } = useAuth();
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalReason,
    setAuthModalReason,
    pendingAuthAction,
    setPendingAuthAction,
    executePendingAuthAction,
    showToast
  } = useShop();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regFullname, setRegFullname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBarangay, setRegBarangay] = useState<string>(ROXAS_BARANGAYS[0]);
  const [regStreet, setRegStreet] = useState('');
  const [regError, setRegError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
    setPendingAuthAction(null);
    setLoginError('');
    setRegError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message || 'Maling email o password.');
    } else {
      showToast('Matagumpay na naka-sign in!', 'success');
      executePendingAuthAction();
    }
  };

  const handleQuickDemoCustomer = () => {
    setLoginError('');
    const res = login('juan.delacruz@example.com', 'password123');
    if (res.success) {
      showToast('Naka-sign in bilang Juan dela Cruz (Customer)', 'success');
      executePendingAuthAction();
    }
  };

  const handleQuickDemoAdmin = () => {
    setLoginError('');
    const res = login('admin@capzone.ph', 'adminpassword');
    if (res.success) {
      showToast('Naka-sign in bilang Admin', 'success');
      executePendingAuthAction();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPassword.length < 6) {
      setRegError('Ang password ay dapat hindi bababa sa 6 na karakter.');
      return;
    }

    const fullAddress = regStreet ? `${regStreet}, Barangay ${regBarangay}` : `Barangay ${regBarangay}`;

    const res = register({
      fullname: regFullname,
      email: regEmail,
      password: regPassword,
      contactNumber: regPhone || '+63 917 000 0000',
      address: fullAddress,
      city: 'Roxas, Oriental Mindoro',
      postalCode: '5212',
      role: 'user'
    });

    if (!res.success) {
      setRegError(res.message || 'Nabigo ang pagrehistro.');
    } else {
      showToast('Maligayang pagdating! Matagumpay ang paglikha ng iyong account.', 'success');
      executePendingAuthAction();
    }
  };

  const reasonMessage =
    authModalReason === 'order'
      ? 'Kailangan munang mag-sign in o mag-register bago makapag-order.'
      : authModalReason === 'cart'
      ? 'Kailangan munang mag-sign in o mag-register bago makapag-add to cart.'
      : 'Kailangan munang mag-sign in o mag-register bago makapag-checkout.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header Notification Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-blue-600/20 to-amber-500/20 border-b border-white/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                  Sign In / Register Required
                </span>
                <p className="text-xs font-medium text-white leading-tight mt-0.5">
                  {reasonMessage}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Hindi makaka-order o add to cart hangga&apos;t walang account.
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0"
              aria-label="Isara"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-white/10 bg-[#0B0F17]">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'login'
                ? 'text-blue-400 border-blue-500 bg-[#111827]'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Mag-Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'register'
                ? 'text-blue-400 border-blue-500 bg-[#111827]'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Mag-Register</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {activeTab === 'login' ? (
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 font-mono">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="ilagay ang inyong email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In at Magpatuloy</span>
                </button>
              </form>

              {/* Fast 1-Click Demo Logins for Quick Testing */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block">
                  Subukan Gamit ang Demo Accounts:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleQuickDemoCustomer}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 group"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white group-hover:text-blue-400 truncate">
                        Juan dela Cruz
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">Customer Account</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickDemoAdmin}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white group-hover:text-amber-400 truncate">
                        CapZone Admin
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">Store Admin</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 font-mono">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">Buong Pangalan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Hal. Maria Santos"
                    value={regFullname}
                    onChange={(e) => setRegFullname(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="maria@example.ph"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-mono text-gray-400 block mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-400 block mb-1">Mobile / Telepono</label>
                    <input
                      type="tel"
                      placeholder="0917 123 4567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">
                    Barangay sa Roxas, Oriental Mindoro *
                  </label>
                  <select
                    value={regBarangay}
                    onChange={(e) => setRegBarangay(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {ROXAS_BARANGAYS.map((brgy) => (
                      <option key={brgy} value={brgy} className="bg-[#111827] text-white">
                        Barangay {brgy}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">
                    Kalye / Purok / House No.
                  </label>
                  <input
                    type="text"
                    placeholder="Hal. Rizal St. o Purok 3"
                    value={regStreet}
                    onChange={(e) => setRegStreet(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Mag-rehistro at Magpatuloy</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
