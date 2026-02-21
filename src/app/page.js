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

  // --- FULL 15 PRODUCT LIST ---
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

  // --- FILTER LOGIC ---
  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* HEADER */}
      <header className="bg-[#1a2024] text-white p-4 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-black italic cursor-pointer" onClick={() => {setActiveCategory('All'); setSearchQuery('');}}>
            🛒 QUICK<span className="text-yellow-500">SHOP</span>
          </h1>
          <input 
            type="text" 
            placeholder="Search 15+ items..." 
            className="flex-1 max-w-md p-2 rounded-lg text-black text-sm hidden sm:block"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setIsCheckoutOpen(true)} className="bg-gray-800 p-2 rounded-xl flex items-center">
            <span className="text-yellow-500 font-bold mr-2">${cart.reduce((a, b) => a + b.price, 0)}</span>
            🛒 <span className="ml-1 bg-yellow-600 px-2 rounded-full text-xs">{cart.length}</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex p-4 gap-6">
        {/* SIDEBAR */}
        <aside className="w-48 hidden md:block">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 sticky top-24">
            <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">Categories</p>
            <ul className="space-y-3 text-sm font-semibold">
              {['All', 'Electronics', 'Food & Oils', 'Fashion'].map(cat => (
                <li key={cat} onClick={() => setActiveCategory(cat)} className={`cursor-pointer hover:text-yellow-600 ${activeCategory === cat ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-[32px] p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                <div className="h-40 w-full mb-4 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
                  <img src={p.img} alt={p.name} className="max-h-32 object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 leading-tight mb-1">{p.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{p.category}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900">${p.price}</span>
                  <button onClick={() => setCart([...cart, p])} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-4 py-2 rounded-xl text-xs transition-transform active:scale-95">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* FOOTER MOBILE SEARCH */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full p-4 rounded-2xl shadow-2xl border border-gray-200 outline-none"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CHECKOUT MODAL - REMAINING LOGIC IS THE SAME */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black mb-6">Your Order</h2>
            <div className="bg-yellow-50 p-4 rounded-2xl mb-6 text-sm border border-yellow-100">
               <p className="font-bold">Total Items: {cart.length}</p>
               <p className="text-xl font-black text-red-600">Total Price: ${cart.reduce((a, b) => a + b.price, 0)}</p>
            </div>
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100" />
              <input type="text" placeholder="Phone Number" required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100" />
              <button type="button" onClick={() => setIsCheckoutOpen(false)} className="w-full py-4 font-bold text-gray-400">Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}