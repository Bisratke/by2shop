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
  const [formData, setFormData] = useState({ name: '', phone: '' });
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

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* HEADER: FIXED SEARCH VISIBILITY */}
      <header className="bg-[#1a2024] text-white p-4 sticky top-0 z-50 shadow-xl border-b border-gray-700">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
          <h1 className="text-2xl font-black italic cursor-pointer shrink-0" onClick={() => {setActiveCategory('All'); setSearchQuery('');}}>
            🛒 QUICK<span className="text-yellow-500">SHOP</span>
          </h1>
          
          <div className="flex-1 max-w-xl relative">
            <input 
              type="text" 
              placeholder="Search through 15+ items..." 
              className="w-full p-3 pl-12 rounded-2xl text-black bg-white font-medium shadow-lg outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
          </div>

          <button onClick={() => setIsCheckoutOpen(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-2xl flex items-center gap-3 font-bold transition-all transform active:scale-95 shadow-lg shadow-yellow-500/20">
            <span className="hidden sm:inline">${cart.reduce((a, b) => a + b.price, 0)}</span>
            <span className="bg-black text-white px-2 py-0.5 rounded-lg text-xs">{cart.length}</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex p-6 gap-8">
        {/* SIDEBAR: DECORATIVE VERSION */}
        <aside className="w-72 hidden md:block shrink-0">
          <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-blue-900/5 border border-white sticky top-28">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🛍️</span>
              </div>
              <h2 className="font-black text-gray-900 text-lg">Collections</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Shop by category</p>
            </div>

            <ul className="space-y-4">
              {[
                { name: 'All', icon: '🌈' },
                { name: 'Electronics', icon: '⚡' },
                { name: 'Food & Oils', icon: '🍯' },
                { name: 'Fashion', icon: '✨' }
              ].map(cat => (
                <li 
                  key={cat.name} 
                  onClick={() => setActiveCategory(cat.name)} 
                  className={`group cursor-pointer p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                    activeCategory === cat.name 
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-xl transition-transform group-hover:scale-125 ${activeCategory === cat.name ? 'grayscale-0' : 'grayscale'}`}>
                    {cat.icon}
                  </span>
                  <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl">
              <p className="text-[10px] font-bold opacity-70 mb-1">PROMOTION</p>
              <p className="font-black text-sm">Free Delivery in Addis Ababa!</p>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-[45px] p-7 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group relative overflow-hidden">
                <div className="absolute top-6 right-6 bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-gray-300 group-hover:text-yellow-500 transition-colors">
                  ♡
                </div>
                <div className="h-44 w-full mb-6 flex items-center justify-center bg-gray-50 rounded-[35px] overflow-hidden p-6">
                  <img src={p.img} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition duration-700 mix-blend-multiply" />
                </div>
                <div className="flex-1 px-2">
                  <p className="text-[10px] text-yellow-600 font-black uppercase tracking-widest mb-1">{p.category}</p>
                  <h3 className="font-black text-gray-900 leading-tight text-lg mb-2">{p.name}</h3>
                </div>
                <div className="mt-6 flex items-center justify-between px-2">
                  <span className="text-2xl font-black text-gray-900">${p.price}</span>
                  <button onClick={() => setCart([...cart, p])} className="bg-gray-900 text-white font-black px-6 py-3 rounded-2xl text-[10px] hover:bg-yellow-500 hover:text-black transition-all transform active:scale-90 shadow-xl shadow-gray-200">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-40">
              <p className="text-gray-400 text-lg font-bold">Oops! No items found. 🔍</p>
              <button onClick={() => setSearchQuery('')} className="text-blue-600 font-bold mt-2">Clear Search</button>
            </div>
          )}
        </main>
      </div>

      {/* FOOTER MOBILE SEARCH (Visible only on mobile) */}
      <div className="sm:hidden fixed bottom-6 left-6 right-6 z-40">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full p-5 rounded-3xl shadow-2xl border-none outline-none ring-4 ring-black/5 bg-white font-bold"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CHECKOUT MODAL LOGIC (Hidden for brevity, but use the one from previous version) */}
    </div>
  );
}