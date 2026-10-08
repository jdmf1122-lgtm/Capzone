import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import {
  User as UserIcon,
  Save,
  Package,
  Heart,
  Shield,
  LogOut,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { currentUser, updateProfile, logout, switchRole, isAdmin } = useAuth();
  const { orders, wishlist, setCurrentPage, showToast } = useShop();

  const [fullname, setFullname] = useState(currentUser?.fullname || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [contactNumber, setContactNumber] = useState(currentUser?.contactNumber || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-['Syne'] text-white">Please Sign In</h2>
        <p className="text-xs text-gray-400">Sign in to view and manage your profile details.</p>
        <button
          onClick={() => setCurrentPage('login')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullname,
      email,
      contactNumber,
      address,
      city,
      postalCode
    });
    setSavedSuccess(true);
    showToast('Profile information successfully updated.', 'success');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const myOrdersCount = orders.filter(
    (o) => o.userId === currentUser.id || o.customerEmail === currentUser.email
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-2xl font-bold text-blue-400 font-mono">
            {currentUser.fullname.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-white">
              {currentUser.fullname}
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Member since {currentUser.memberSince} · {currentUser.role.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Demo Fast Switch buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-gray-500 uppercase">Role:</span>
          <button
            onClick={() => switchRole('user')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              !isAdmin
                ? 'bg-blue-600 text-white border-blue-500'
                : 'text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            Shopper
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              isAdmin
                ? 'bg-amber-600 text-white border-amber-500'
                : 'text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Admin Point of View Banner */}
      {isAdmin && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 via-[#182232] to-[#111827] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-200">
            <Shield className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-amber-300">Admin Point of View Active</p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Purchasing and adding store items to bag is restricted for this administrator account.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentPage('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shrink-0"
          >
            Open Admin Dashboard
          </button>
        </div>
      )}

      {/* Account Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div
          onClick={() => setCurrentPage('order-history')}
          className="p-5 bg-[#111827] rounded-xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-gray-500 uppercase text-[10px] block">Order History</span>
            <span className="text-2xl font-bold text-white tabular-nums">{myOrdersCount}</span>
            <span className="text-gray-400 text-[11px] block mt-0.5">Completed & Active</span>
          </div>
          <Package className="w-8 h-8 text-blue-400/60" />
        </div>

        <div
          onClick={() => setCurrentPage('shop')}
          className="p-5 bg-[#111827] rounded-xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-gray-500 uppercase text-[10px] block">Saved Wishlist</span>
            <span className="text-2xl font-bold text-white tabular-nums">{wishlist.length}</span>
            <span className="text-gray-400 text-[11px] block mt-0.5">Headwear Pieces</span>
          </div>
          <Heart className="w-8 h-8 text-rose-400/60" />
        </div>

        <div className="p-5 bg-[#111827] rounded-xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-gray-500 uppercase text-[10px] block">Status Tier</span>
            <span className="text-base font-bold text-amber-400">Crown VIP Member</span>
            <span className="text-gray-400 text-[11px] block mt-0.5">Exclusive drop access</span>
          </div>
          <Shield className="w-8 h-8 text-amber-400/60" />
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 bg-[#111827] rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-['Syne'] text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-blue-400" /> Personal & Shipping Profile
          </h2>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Changes saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Mobile Contact Number</label>
            <input
              type="tel"
              required
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">City / Region</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-gray-400 block mb-1">Default Shipping Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="max-w-xs">
          <label className="text-xs font-mono text-gray-400 block mb-1">Postal Code</label>
          <input
            type="text"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Update Profile Details</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out of CapZone
          </button>
        </div>
      </form>
    </div>
  );
};
