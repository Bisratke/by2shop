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
  const [formData, setFormData] = useState({ email: '', name: '', phone: '', address: '' });
  
  // --- NEW: CATEGORY FILTER STATE ---
  const [activeCategory, setActiveCategory] = useState('All');

  const products = [
    { id: 1, name: 'Premium Headphones', price: 99, category: 'Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', stars: 4 },
    { id: 2, name: 'Smart Watch', price: 149, category: 'Electronics', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', stars: 5 },
    { id: 3, name: 'Gaming Mouse', price: 59, category: 'Electronics', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', stars: 4 },
    { id: 4, name: 'Mechanical Keyboard', price: 89, category: 'Electronics', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500', stars: 5 },
    { id: 5, name: 'Organic Essential Oil', price: 25, category: 'Food & Oils', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', stars: 4 },
    { id: 6, name: 'Designer Glasses', price: 120, category: 'Fashion', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', stars: 5 },
  ];

  useEffect(() => { setMounted(true); }, []);

  // --- FILTERED PRODUCTS LOGIC ---
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const completePurchase = async (e) => {
    e.preventDefault();
    if (!screenshot) return alert("Please upload a payment screenshot!");
    setLoading(true);
    try {
      const total = cart.reduce((a, b) => a + b.price, 0);
      const telegramData = new FormData();
      telegramData.append('chat_id', process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID);
      telegramData.append('photo', screenshot);
      telegramData.append('caption', `💰 NEW ORDER!\n👤 ${formData.name}\n📞 ${formData.phone}\n💵 Total: $${total}`);

      await fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: 'POST', body: telegramData,
      });

      // Silent Email Attempt
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          { to_email: formData.email, user_name: formData.name, total_amount: `$${total}` },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        );
      } catch (e) { console.log("Email limit/error"); }

      alert("✅ Order Sent to Admin!");
      setCart([]); setIsCheckoutOpen(false);
    } catch (err) { alert("Error: " + err.message); }
    finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-900">
      {/* HEADER */}
      <header className="bg-[#1a2024] text-white p-4 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4">
          <div className="text-2xl font-black italic cursor-pointer" onClick={() => setActiveCategory('All')}>🛒 QUICK<span className="text-yellow-500">SHOP</span></div>
          <div className="flex items-center gap-6">
            <div onClick={() => setIsCheckoutOpen(true)} className="relative cursor-pointer bg-gray-800 p-2 rounded-xl">
              <span className="text-yellow-500 font-bold mr-2">${cart.reduce((a, b) => a + b.price, 0)}</span>
              🛒 <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex p-6 gap-8">
        {/* SIDEBAR (Now Working!) */}
        <aside className="w-64 hidden lg:block">
          <div className="bg-[#1a2024] text-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-6">Categories</h3>
            <ul className="space-y-4 text-sm">
              <li 
                onClick={() => setActiveCategory('All')} 
                className={`cursor-pointer flex items-center gap-2 ${activeCategory === 'All' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <span>📦</span> All Products
              </li>
              <li 
                onClick={() => setActiveCategory('Electronics')} 
                className={`cursor-pointer flex items-center gap-2 ${activeCategory === 'Electronics' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <span>💻</span> Electronics
              </li>
              <li 
                onClick={() => setActiveCategory('Food & Oils')} 
                className={`cursor-pointer flex items-center gap-2 ${activeCategory === 'Food & Oils' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <span>🍔</span> Food & Oils
              </li>
              <li 
                onClick={() => setActiveCategory('Fashion')} 
                className={`cursor-pointer flex items-center gap-2 ${activeCategory === 'Fashion' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <span>👟</span> Fashion
              </li>
            </ul>
          </div>
        </aside>

        {/* PRODUCTS (Using filteredProducts) */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition group">
              <div className="h-48 w-full mb-6 flex items-center justify-center">
                <img src={p.img} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition" />
              </div>
              <h4 className="font-bold text-lg">{p.name}</h4>
              <p className="text-xs text-gray-400 mb-2">{p.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-red-600">${p.price}</span>
                <button onClick={() => setCart([...cart, p])} className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-2xl text-xs">Add</button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* MODALS (Checkout, etc.) - These remain the same as previous code */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-[40px] w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-3xl font-black mb-4">Checkout</h2>
                <form onSubmit={completePurchase} className="space-y-4">
                    <input type="text" placeholder="Full Name" required className="w-full p-4 bg-gray-100 rounded-2xl" onChange={(e)=>setFormData({...formData, name:e.target.value})}/>
                    <input type="text" placeholder="Phone" required className="w-full p-4 bg-gray-100 rounded-2xl" onChange={(e)=>setFormData({...formData, phone:e.target.value})}/>
                    <input type="file" accept="image/*" required className="w-full border-2 border-dashed p-4 rounded-2xl" onChange={(e)=>setScreenshot(e.target.files[0])}/>
                    <button disabled={loading} className="w-full bg-yellow-500 py-5 rounded-3xl font-black">{loading ? "SENDING..." : "COMPLETE PURCHASE"}</button>
                    <button type="button" onClick={() => setIsCheckoutOpen(false)} className="w-full text-gray-400 text-sm">Close</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}