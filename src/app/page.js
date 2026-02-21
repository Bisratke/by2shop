"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = [
    { id: 1, name: 'Premium Headphones', price: 99, category: 'Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { id: 2, name: 'Smart Watch S8', price: 149, category: 'Electronics', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { id: 3, name: 'Gaming Mouse RGB', price: 59, category: 'Electronics', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500' },
    { id: 4, name: 'Mechanical Keyboard', price: 89, category: 'Electronics', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500' },
    { id: 5, name: 'MacBook Air M2', price: 1200, category: 'Electronics', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500' },
    { id: 6, name: 'Bluetooth Speaker', price: 45, category: 'Electronics', img: 'https://images.unsplash.com/photo-1608156639585-34a0a56ee6c9?w=500' },
    { id: 7, name: 'Organic Essential Oil', price: 25, category: 'Food & Oils', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500' },
    { id: 8, name: 'Pure Ethiopian Honey', price: 30, category: 'Food & Oils', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500' },
    { id: 9, name: 'Extra Virgin Olive Oil', price: 18, category: 'Food & Oils', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500' },
    { id: 10, name: 'Roasted Coffee Beans', price: 22, category: 'Food & Oils', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500' },
    { id: 11, name: 'Designer Glasses', price: 120, category: 'Fashion', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500' },
    { id: 12, name: 'Classic White Sneakers', price: 85, category: 'Fashion', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500' },
    { id: 13, name: 'Leather Wallet', price: 40, category: 'Fashion', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500' },
    { id: 14, name: 'Denim Jacket', price: 75, category: 'Fashion', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500' },
    { id: 15, name: 'Black Sport Cap', price: 20, category: 'Fashion', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500' },
  ];

  useEffect(() => { setMounted(true); }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completePurchase = async (e) => {
    e.preventDefault();
    if (!screenshot) return alert("Please upload a payment screenshot!");
    setLoading(true);
    try {
      const total = cart.reduce((a, b) => a + b.price, 0);
      const items = cart.map(i => i.name).join(', ');
      
      const telegramData = new FormData();
      telegramData.append('chat_id', process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID);
      telegramData.append('photo', screenshot);
      telegramData.append('caption', `🚀 NEW ORDER!\n👤 Name: ${formData.name}\n📞 Phone: ${formData.phone}\n🛍️ Items: ${items}\n💵 Total: $${total}`);

      await fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: 'POST', body: telegramData,
      });

      alert("✅ SUCCESS! Your order and receipt were sent to the Admin.");
      setCart([]);
      setIsCheckoutOpen(false);
      setScreenshot(null);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* HEADER */}
      <header className="bg-[#1a2024] text-white p-4 sticky top-0 z-50 shadow-xl border-b border-gray-700">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
          <h1 className="text-2xl font-black italic cursor-pointer shrink-0" onClick={() => {setActiveCategory('All'); setSearchQuery('');}}>
            🛒 QUICK<span className="text-yellow-500">SHOP</span>
          </h1>
          
          <div className="flex-1 max-w-xl relative">
            <input 
              type="text" 
              placeholder="Search through 15+ items..." 
              className="w-full p-3 pl-12 rounded-2xl text-black bg-white font-medium shadow-lg outline-none focus:ring-4 focus:ring-yellow-500/50"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
          </div>

          <button onClick={() => setIsCheckoutOpen(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-2xl flex items-center gap-3 font-bold transition-all transform active:scale-95 shadow-lg">
            <span className="hidden sm:inline">${cart.reduce((a, b) => a + b.price, 0)}</span>
            <span className="bg-black text-white px-2 py-0.5 rounded-lg text-xs">{cart.length}</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex p-6 gap-8">
        {/* DECORATIVE SIDEBAR */}
        <aside className="w-72 hidden md:block shrink-0">
          <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-white sticky top-28">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🛍️</span>
              </div>
              <h2 className="font-black text-gray-900 text-lg">Collections</h2>
            </div>
            <ul className="space-y-4">
              {[{ name: 'All', icon: '🌈' }, { name: 'Electronics', icon: '⚡' }, { name: 'Food & Oils', icon: '🍯' }, { name: 'Fashion', icon: '✨' }].map(cat => (
                <li 
                  key={cat.name} 
                  onClick={() => setActiveCategory(cat.name)} 
                  className={`cursor-pointer p-4 rounded-2xl flex items-center gap-4 transition-all ${activeCategory === cat.name ? 'bg-yellow-500 text-black shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-bold text-sm">{cat.name}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-5 bg-black rounded-3xl text-white">
              <p className="text-[10px] font-bold text-yellow-500 mb-1">OFFER</p>
              <p className="font-black text-xs leading-tight">Same Day Delivery In Addis Ababa!</p>
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-[45px] p-7 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group relative">
                <div className="h-44 w-full mb-6 flex items-center justify-center bg-gray-50 rounded-[35px] overflow-hidden p-6">
                  <img src={p.img} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition duration-700 mix-blend-multiply" />
                </div>
                <div className="flex-1 px-2">
                  <p className="text-[10px] text-yellow-600 font-black uppercase mb-1">{p.category}</p>
                  <h3 className="font-black text-gray-900 text-lg mb-2">{p.name}</h3>
                </div>
                <div className="mt-6 flex items-center justify-between px-2">
                  <span className="text-2xl font-black text-gray-900">${p.price}</span>
                  <button onClick={() => setCart([...cart, p])} className="bg-gray-900 text-white font-black px-6 py-3 rounded-2xl text-[10px] hover:bg-yellow-500 hover:text-black transition-all transform active:scale-95">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* --- THE MISSING CHECKOUT MODAL --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[45px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Complete Your Order</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 text-2xl font-bold">×</button>
            </div>

            <div className="bg-blue-50 p-6 rounded-[32px] mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-blue-900">🏦 CBE: 1000123456789</p>
                <button onClick={() => copyToClipboard('1000123456789')} className="bg-blue-200 text-blue-800 text-[10px] px-3 py-1 rounded-lg font-bold">Copy</button>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-blue-900">📱 Telebirr: 0911223344</p>
                <button onClick={() => copyToClipboard('0911223344')} className="bg-blue-200 text-blue-800 text-[10px] px-3 py-1 rounded-lg font-bold">Copy</button>
              </div>
              <div className="pt-3 border-t border-blue-200 flex justify-between items-center">
                <span className="font-bold text-gray-600 uppercase text-xs">Total Amount</span>
                <span className="text-2xl font-black text-red-600">${cart.reduce((a, b) => a + b.price, 0)}</span>
              </div>
            </div>

            <form onSubmit={completePurchase} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-2">YOUR NAME</label>
                <input type="text" placeholder="Abebe Kebede" required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 ring-yellow-500" 
                       onChange={(e) => setFormData({...formData, name: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-2">PHONE NUMBER</label>
                <input type="text" placeholder="09..." required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 ring-yellow-500" 
                       onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
              </div>
              <div className="border-2 border-dashed border-gray-100 p-6 rounded-3xl text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Upload Payment Proof</p>
                <input type="file" accept="image/*" required className="text-xs w-full" onChange={(e) => setScreenshot(e.target.files[0])}/>
              </div>
              <button disabled={loading} className="w-full bg-yellow-500 py-5 rounded-[24px] font-black text-lg shadow-xl shadow-yellow-500/20 active:scale-95 transition-all">
                {loading ? "PROCESSING..." : "FINISH PURCHASE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}