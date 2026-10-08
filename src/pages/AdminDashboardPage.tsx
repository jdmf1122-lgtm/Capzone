import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { CapCategory, OrderStatus, Product } from '../types';
import { PesoIcon } from '../components/common/PesoIcon';
import {
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Tag,
  FolderTree,
  Database,
  Server,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Key,
  Globe,
  Sparkles,
  ShieldAlert,
  Terminal
} from 'lucide-react';
import {
  getSupabaseCredentials,
  setSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  ConnectionTestResult,
  isSupabaseConfigured
} from '../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../data/supabaseSchemaSql';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    addProduct,
    editProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    categories,
    addCategory,
    deleteCategory,
    discounts,
    addDiscountCode,
    deleteDiscountCode,
    showToast,
    isSupabaseConnected,
    isSyncingWithDb,
    refreshFromDatabase,
    syncAllWithSupabase,
    reviews
  } = useShop();

  const { usersList } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'discounts' | 'customers' | 'database'>('overview');

  // Database Management State
  const initialCreds = getSupabaseCredentials();
  const [dbUrl, setDbUrl] = useState(initialCreds.url);
  const [dbAnonKey, setDbAnonKey] = useState(initialCreds.anonKey);
  const [testingDb, setTestingDb] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [seedingDb, setSeedingDb] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlPreview, setShowSqlPreview] = useState(false);

  const handleSaveDbCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseCredentials(dbUrl, dbAnonKey);
    showToast('Nai-save ang Supabase credentials!', 'success');
    setTestingDb(true);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setTestingDb(false);
    if (res.connected) {
      showToast('Konektado na sa Supabase!', 'success');
      await refreshFromDatabase();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleClearDbCredentials = () => {
    clearSupabaseCredentials();
    const creds = getSupabaseCredentials();
    setDbUrl(creds.url);
    setDbAnonKey(creds.anonKey);
    setTestResult(null);
    showToast('Na-reset ang Supabase credentials.', 'info');
  };

  const handleTestConnection = async () => {
    setTestingDb(true);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setTestingDb(false);
    if (res.connected) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSeedDatabase = async () => {
    setSeedingDb(true);
    const res = await syncAllWithSupabase();
    setSeedingDb(false);
    if (res.success) {
      showToast('Nai-sync ang lahat ng data sa Supabase!', 'success');
      const testRes = await testSupabaseConnection();
      setTestResult(testRes);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    showToast('Na-kopya ang SQL Schema sa clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields for Add/Edit Product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CapCategory>('Baseball Caps');
  const [prodPrice, setProdPrice] = useState(499);
  const [prodStock, setProdStock] = useState(25);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodColors, setProdColors] = useState('Matte Black, Charcoal');

  // Discount Form State
  const [newDiscountCode, setNewDiscountCode] = useState('');
  const [newDiscountValue, setNewDiscountValue] = useState(15);
  const [newDiscountMinSpend, setNewDiscountMinSpend] = useState(500);
  const [newDiscountDesc, setNewDiscountDesc] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState<CapCategory>('Baseball Caps');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Analytics Computations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockItems = products.filter((p) => p.stock < 15);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Baseball Caps');
    setProdPrice(499);
    setProdStock(30);
    setProdDesc('Structured crown headwear crafted from heavyweight brushed twill.');
    setProdImg(products[0]?.image || '');
    setProdColors('Matte Black, Pure White');
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdStock(p.stock);
    setProdDesc(p.description);
    setProdImg(p.image);
    setProdColors(p.colors.map((c) => c.name).join(', '));
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const colorObjects = prodColors.split(',').map((c) => {
      const name = c.trim();
      return { name, hex: name.toLowerCase().includes('white') ? '#F9FAFB' : '#111827' };
    });

    if (editingProduct) {
      editProduct(editingProduct.id, {
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        stock: Number(prodStock),
        description: prodDesc,
        image: prodImg,
        colors: colorObjects
      });
    } else {
      addProduct({
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        stock: Number(prodStock),
        description: prodDesc,
        image: prodImg,
        rating: 5.0,
        reviewCount: 1,
        colors: colorObjects,
        specs: {
          material: '100% Premium Cotton / Wool Blend',
          crown: 'Structured 6-Panel Crown',
          closure: 'Adjustable Clasp',
          visor: 'Memory Mold Visor',
          origin: 'Crafted in Roxas, Oriental Mindoro'
        }
      });
    }

    setProductModalOpen(false);
  };

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscountCode.trim()) return;
    addDiscountCode({
      code: newDiscountCode.trim().toUpperCase(),
      discountType: 'percentage',
      value: Number(newDiscountValue),
      minSpend: Number(newDiscountMinSpend),
      description: newDiscountDesc.trim() || `${newDiscountValue}% off entire order`,
      active: true
    });
    setNewDiscountCode('');
    setNewDiscountDesc('');
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc.trim() || 'Curated headwear collection.',
      image: products[0]?.image || '',
      itemCount: 5
    });
    setNewCatDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> CapZone Command Studio
          </div>
          <h1 className="text-3xl font-extrabold font-['Syne'] text-white">
            Admin Management Console
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all ${
              isSupabaseConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-sm'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 shadow-sm'
            }`}
            title="Click to manage Supabase database settings"
          >
            <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSupabaseConnected ? 'Supabase: Active' : 'DB: Local Mode'}
            </span>
          </button>

          <button
            onClick={handleOpenAddProduct}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Cap</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-mono">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Overview & Sales
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Caps Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Orders Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('discounts')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'discounts'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Discounts & Promos ({discounts.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'customers'
              ? 'bg-blue-600 text-white font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Customer Roster ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'database'
              ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
              : 'text-emerald-400 hover:text-white hover:bg-emerald-500/10 border border-emerald-500/20'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Supabase DB</span>
          {isSupabaseConnected && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse ml-0.5" />
          )}
        </button>
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Key Metrics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
            <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs uppercase tracking-wider">Gross Sales (PHP)</span>
                <PesoIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-white tabular-nums font-['Syne']">
                ₱{totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-400 font-sans">All settled & active orders (PHP)</p>
            </div>

            <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs uppercase tracking-wider">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-extrabold text-white tabular-nums font-['Syne']">
                {totalOrdersCount}
              </p>
              <p className="text-[11px] text-gray-400 font-sans">Orders in Roxas Barangays</p>
            </div>

            <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs uppercase tracking-wider">Avg Order Value</span>
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-extrabold text-white tabular-nums font-['Syne']">
                ₱{avgOrderValue.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-400 font-sans">Per checkout basket</p>
            </div>

            <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs uppercase tracking-wider">Inventory Stock</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-extrabold text-white tabular-nums font-['Syne']">
                {totalStockUnits} <span className="text-xs text-gray-400 font-normal">units</span>
              </p>
              <p className="text-[11px] text-amber-400 font-sans">{lowStockItems.length} low stock warnings</p>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockItems.length > 0 && (
            <div className="p-6 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase font-mono">
                <AlertTriangle className="w-4 h-4" /> Immediate Replenishment Warnings (&lt;15 Units)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {lowStockItems.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#111827] rounded-lg border border-amber-500/20 flex items-center justify-between text-xs"
                  >
                    <span className="text-white truncate font-medium">{p.name}</span>
                    <span className="font-mono text-amber-400 font-bold shrink-0">{p.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Preview */}
          <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold font-['Syne'] text-white">Recent Customer Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Payment</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-white/5">
                      <td className="py-3 text-white font-bold">{o.id}</td>
                      <td className="py-3 text-gray-300 font-sans">{o.customerName}</td>
                      <td className="py-3 text-gray-400">{o.createdAt}</td>
                      <td className="py-3">
                        <span className="uppercase text-[10px] px-2 py-0.5 rounded font-bold bg-blue-500/10 text-blue-400">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 uppercase text-gray-400">{o.paymentMethod}</td>
                      <td className="py-3 text-right font-bold text-white tabular-nums">
                        ₱{o.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Catalog Total: {products.length} Products</span>
            <button
              onClick={handleOpenAddProduct}
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Cap
            </button>
          </div>

          <div className="overflow-x-auto bg-[#111827] border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] font-mono">
                  <th className="p-4">Cap</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded bg-black/40 border border-white/10 shrink-0"
                      />
                      <div className="font-sans">
                        <p className="font-semibold text-white truncate max-w-xs">{p.name}</p>
                        <p className="text-[11px] text-gray-400 font-mono">ID: {p.id}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{p.category}</td>
                    <td className="p-4 text-white font-bold tabular-nums">₱{p.price}</td>
                    <td className="p-4">
                      <span
                        className={`tabular-nums font-bold ${
                          p.stock < 15 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-amber-400 tabular-nums">★ {p.rating} ({p.reviewCount})</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="overflow-x-auto bg-[#111827] border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer & Phone</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Update Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5">
                    <td className="p-4">
                      <p className="font-bold text-white">{o.id}</p>
                      <p className="text-[10px] text-gray-400">{o.trackingNumber}</p>
                    </td>
                    <td className="p-4 font-sans">
                      <p className="text-white font-semibold">{o.customerName}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{o.contactNumber}</p>
                    </td>
                    <td className="p-4 text-gray-300">
                      {o.items.reduce((s, i) => s + i.quantity, 0)} pcs ({o.items.length} styles)
                    </td>
                    <td className="p-4 text-white font-bold tabular-nums">
                      ₱{o.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          o.orderStatus === 'delivered'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : o.orderStatus === 'shipped'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-150">
          <div className="lg:col-span-8 overflow-x-auto bg-[#111827] border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Assigned Caps</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="p-4 font-semibold text-white font-sans">{c.name}</td>
                    <td className="p-4 text-gray-400">{c.slug}</td>
                    <td className="p-4 text-blue-400 font-bold tabular-nums">{c.itemCount}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-4 p-6 bg-[#111827] rounded-xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold font-['Syne'] text-white flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-400" /> Add Category
            </h3>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1 font-mono">Category Silhouette</label>
                <select
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value as CapCategory)}
                  className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-white font-mono"
                >
                  <option value="Baseball Caps">Baseball Caps</option>
                  <option value="Snapback Caps">Snapback Caps</option>
                  <option value="Bucket Hats">Bucket Hats</option>
                  <option value="Dad Hats">Dad Hats</option>
                  <option value="Trucker Caps">Trucker Caps</option>
                  <option value="Premium Embroidered Caps">Premium Embroidered Caps</option>
                  <option value="Limited Edition Caps">Limited Edition Caps</option>
                  <option value="Streetwear Collection">Streetwear Collection</option>
                  <option value="Sports Collection">Sports Collection</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 block mb-1 font-mono">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean unstructured cotton crowns..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold uppercase tracking-wider text-xs"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Discounts Tab */}
      {activeTab === 'discounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-150">
          <div className="lg:col-span-8 overflow-x-auto bg-[#111827] border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="p-4">Voucher Code</th>
                  <th className="p-4">Discount Value</th>
                  <th className="p-4">Min Purchase</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {discounts.map((d) => (
                  <tr key={d.code} className="hover:bg-white/5">
                    <td className="p-4 font-bold text-white text-blue-400">{d.code}</td>
                    <td className="p-4 text-emerald-400 font-bold">
                      {d.discountType === 'percentage' ? `${d.value}% OFF` : `₱${d.value} OFF`}
                    </td>
                    <td className="p-4 text-gray-300 tabular-nums">₱{d.minSpend}</td>
                    <td className="p-4 text-gray-400 font-sans">{d.description}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteDiscountCode(d.code)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-4 p-6 bg-[#111827] rounded-xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold font-['Syne'] text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-400" /> Create Promo Voucher
            </h3>
            <form onSubmit={handleAddDiscount} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1 font-mono">Voucher Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROXASDROP"
                  value={newDiscountCode}
                  onChange={(e) => setNewDiscountCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-white uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1 font-mono">Percentage (%)</label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={newDiscountValue}
                    onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1 font-mono">Min Spend (₱)</label>
                  <input
                    type="number"
                    value={newDiscountMinSpend}
                    onChange={(e) => setNewDiscountMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 block mb-1 font-mono">Terms / Description</label>
                <input
                  type="text"
                  placeholder="e.g. 15% off orders over ₱500"
                  value={newDiscountDesc}
                  onChange={(e) => setNewDiscountDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold uppercase tracking-wider text-xs"
              >
                Save Promo Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="overflow-x-auto bg-[#111827] border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Registered Location</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="p-4 font-semibold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-mono text-xs">
                        {u.fullname.charAt(0)}
                      </div>
                      <span>{u.fullname}</span>
                    </td>
                    <td className="p-4 text-gray-400 font-mono">{u.email}</td>
                    <td className="p-4 text-gray-300 font-mono">{u.contactNumber}</td>
                    <td className="p-4 text-gray-300">{u.city || u.address}</td>
                    <td className="p-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-[11px]">{u.memberSince}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Database & Supabase Tab */}
      {activeTab === 'database' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Header Card */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#111827] via-[#131c2e] to-[#111827] border border-white/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${
                      isSupabaseConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {isSupabaseConnected ? 'Connected to Supabase PostgreSQL' : 'Local Storage Fallback Mode'}
                  </span>
                  {isSyncingWithDb && (
                    <span className="text-xs font-mono text-blue-400 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing...
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-white">
                  Supabase Cloud Database Center
                </h2>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Ang CapZone ay naka-integrate sa <strong className="text-emerald-400 font-semibold">Supabase</strong> — isang open-source PostgreSQL database. Lahat ng mga produkto, kategorya, orders, reviews, discount vouchers, at mga customer accounts ay pwedeng i-save at i-sync nang diretso sa iyong Supabase project.
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingDb}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>{testingDb ? 'Testing Connection...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={seedingDb || isSyncingWithDb}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{seedingDb ? 'Uploading Catalog...' : '1-Click Seed Initial Data'}</span>
                </button>
              </div>
            </div>

            {/* Live Database Record Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-mono">
              <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-[10px] uppercase">Products</div>
                <div className="text-lg font-bold text-white mt-1">{products.length}</div>
              </div>
              <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-[10px] uppercase">Orders</div>
                <div className="text-lg font-bold text-white mt-1">{orders.length}</div>
              </div>
              <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-[10px] uppercase">Categories</div>
                <div className="text-lg font-bold text-white mt-1">{categories.length}</div>
              </div>
              <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-[10px] uppercase">Discounts</div>
                <div className="text-lg font-bold text-white mt-1">{discounts.length}</div>
              </div>
              <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-[10px] uppercase">Customers</div>
                <div className="text-lg font-bold text-white mt-1">{usersList.length}</div>
              </div>
              <div className="bg-[#0B0F17]/60 p-3 rounded-lg border border-white/5">
                <div className="text-gray-400 text-[10px] uppercase">Reviews</div>
                <div className="text-lg font-bold text-white mt-1">{reviews.length}</div>
              </div>
            </div>
          </div>

          {/* Test Result Alert Banner */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in ${
                testResult.connected
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.connected ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div className="space-y-1 text-xs font-mono">
                <div className="font-bold uppercase tracking-wider">
                  {testResult.connected ? 'Connection Succeeded' : 'Connection Status'}
                </div>
                <p className="text-gray-200">{testResult.message}</p>
                {testResult.tables && (
                  <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
                    <span className="bg-black/30 px-2 py-0.5 rounded border border-white/10">
                      products: {String(testResult.tables.products)}
                    </span>
                    <span className="bg-black/30 px-2 py-0.5 rounded border border-white/10">
                      orders: {String(testResult.tables.orders)}
                    </span>
                    <span className="bg-black/30 px-2 py-0.5 rounded border border-white/10">
                      categories: {String(testResult.tables.categories)}
                    </span>
                    <span className="bg-black/30 px-2 py-0.5 rounded border border-white/10">
                      discounts: {String(testResult.tables.discounts)}
                    </span>
                    <span className="bg-black/30 px-2 py-0.5 rounded border border-white/10">
                      users: {String(testResult.tables.users)}
                    </span>
                    <span className="bg-black/30 px-2 py-0.5 rounded border border-white/10">
                      reviews: {String(testResult.tables.reviews)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Two Columns: Config Form + Setup Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Supabase Credentials Form */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white font-mono text-sm uppercase tracking-wider">
                    Supabase Credentials
                  </h3>
                </div>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Supabase Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <form onSubmit={handleSaveDbCredentials} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-gray-300 block mb-1.5 font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    Supabase Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={dbUrl}
                    onChange={(e) => setDbUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Hanapin sa: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                  </p>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1.5 font-semibold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-gray-400" />
                    Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={dbAnonKey}
                    onChange={(e) => setDbAnonKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Hanapin sa: Supabase Dashboard &gt; Project Settings &gt; API &gt; anon public
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={testingDb}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Save & Connect
                  </button>
                  <button
                    type="button"
                    onClick={handleClearDbCredentials}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                  >
                    Reset Credentials
                  </button>
                  <button
                    type="button"
                    onClick={() => refreshFromDatabase()}
                    disabled={isSyncingWithDb}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithDb ? 'animate-spin' : ''}`} />
                    <span>Reload from DB</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Setup Instructions & SQL Schema */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-white font-mono text-sm uppercase tracking-wider">
                    Supabase 3-Step Setup
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
              </div>

              <ol className="space-y-3.5 text-xs text-gray-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
                    1
                  </span>
                  <div>
                    <strong className="text-white">Gumawa ng libreng Supabase Project:</strong>
                    <p className="text-gray-400 mt-0.5">
                      Pumunta sa <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">supabase.com</a>, mag-sign in at mag-create ng bagong project (hal. <code className="text-gray-200">capzone-db</code>).
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
                    2
                  </span>
                  <div>
                    <strong className="text-white">Patakbuhin ang SQL Schema:</strong>
                    <p className="text-gray-400 mt-0.5">
                      Pumunta sa Supabase Dashboard &gt; <strong>SQL Editor</strong> &gt; <strong>New Query</strong>. I-paste ang SQL schema mula sa button sa itaas (o buksan ang <code className="text-emerald-400">supabase_schema.sql</code> sa root ng project) at i-click ang <strong>RUN</strong>.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
                    3
                  </span>
                  <div>
                    <strong className="text-white">I-link ang Credentials:</strong>
                    <p className="text-gray-400 mt-0.5">
                      I-paste ang Project URL at Anon Key sa form sa kaliwa, o ilagay sa <code className="text-emerald-400">.env</code> file:
                    </p>
                    <pre className="mt-1.5 p-2 bg-[#0B0F17] rounded border border-white/5 font-mono text-[10px] text-gray-400 overflow-x-auto">
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
                    </pre>
                  </div>
                </li>
              </ol>

              {/* Collapsible SQL Preview */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSqlPreview(!showSqlPreview)}
                  className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>{showSqlPreview ? '▼ Itago ang SQL Schema' : '▶ Tingnan ang SQL Schema Script'}</span>
                </button>

                {showSqlPreview && (
                  <div className="mt-3 p-3 bg-[#0B0F17] border border-white/10 rounded-lg max-h-56 overflow-y-auto font-mono text-[10px] text-gray-300">
                    <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Upload / Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-xl p-6 sm:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold font-['Syne']">
                {editingProduct ? 'Edit Cap Details' : 'Upload New Streetwear Cap'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="text-gray-400 font-mono block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Carbon Fiber Street Snapback"
                  className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 font-mono block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as CapCategory)}
                    className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-white font-mono text-xs"
                  >
                    <option value="Baseball Caps">Baseball Caps</option>
                    <option value="Snapback Caps">Snapback Caps</option>
                    <option value="Bucket Hats">Bucket Hats</option>
                    <option value="Dad Hats">Dad Hats</option>
                    <option value="Trucker Caps">Trucker Caps</option>
                    <option value="Premium Embroidered Caps">Premium Embroidered Caps</option>
                    <option value="Limited Edition Caps">Limited Edition Caps</option>
                    <option value="Streetwear Collection">Streetwear Collection</option>
                    <option value="Sports Collection">Sports Collection</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 font-mono block mb-1">Price (₱ PHP)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-gray-400 font-mono block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-mono block mb-1">
                  Color Options (comma-separated names)
                </label>
                <input
                  type="text"
                  value={prodColors}
                  onChange={(e) => setProdColors(e.target.value)}
                  placeholder="e.g. Stealth Black, Pure White, Royal Blue"
                  className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-gray-400 font-mono block mb-1">Select Photography Preset</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {products.slice(0, 5).map((p) => (
                    <img
                      key={p.id}
                      src={p.image}
                      alt={p.name}
                      onClick={() => setProdImg(p.image)}
                      className={`w-14 h-14 object-cover rounded-lg border cursor-pointer ${
                        prodImg === p.image ? 'border-blue-500 ring-2 ring-blue-500' : 'border-white/10 opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-mono block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
                >
                  {editingProduct ? 'Update Cap' : 'Publish Cap to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
