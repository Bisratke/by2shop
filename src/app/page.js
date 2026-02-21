"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase Connection
// Make sure these match the keys you put in Vercel!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  // --- STATE ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);

  // --- PRODUCT DATA ---
  const products = [
    { id: 1, name: 'Premium Headphones', price: 99, img: '/images/headphones.jpg', color: 'bg-yellow-500', stars: 5 },
    { id: 2, name: 'Smart Watch', price: 149, img: '/images/watch.jpg', color: 'bg-yellow-500', stars: 4 },
    { id: 3, name: 'Gaming Mouse', price: 59, img: '/images/mouse.jpg', color: 'bg-yellow-500', stars: 5 },
    { id: 4, name: 'Mechanical Keyboard', price: 59, img: '/images/keyboard.jpg', color: 'bg-yellow-500', stars: 4 },
    { id: 5, name: 'Organic Essential Oil', price: 25, img: '/images/oil.jpg', color: 'bg-yellow-500', stars: 5 },
    { id: 6, name: 'Designer Glasses', price: 190, img: '/images/glass.jpg', color: 'bg-blue-500', stars: 4 },
    { id: 7, name: 'Pro Laptop', price: 1200, img: '/images/laptop.jpg', color: 'bg-yellow-500', stars: 5 },
    { id: 8, name: 'Classic Sneakers', price: 75, img: '/images/shoes.jpg', color: 'bg-blue-500', stars: 4 },
  ];

  // --- HANDLERS ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAuth = async (e, type) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "Register") {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name } }
        });
        if (error) throw error;
        alert("Registration Successful! Check your email for a confirmation link.");
        setIsRegisterOpen(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        alert("Welcome back, " + (data.user.email));
        setIsLoginOpen(false);
      }
    } catch (error) {
      alert("Auth Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c343a] text-white font-sans">
      {/* --- NAVBAR --- */}
      <nav className="bg-[#1a2024] p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded text-lg">🛒</div>
          <span className="text-xl font-bold tracking-tight text-white">
            Quick<span className="text-yellow-500">Shop</span>
          </span>
        </div>
        
        <div className="flex-1 max-w-2xl mx-10">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full p-2 rounded bg-white text-black focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-6 text-sm">
          <button onClick={() => setIsLoginOpen(true)} className="hover:text-yellow-500 font-medium transition">Login</button>
          <button onClick={() => setIsRegisterOpen(true)} className="hover:text-yellow-500 font-medium border border-gray-600 px-3 py-1 rounded">Register</button>
          <div className="bg-[#374151] p-2 px-4 rounded-lg flex items-center gap-3">
            <span className="text-yellow-500 font-bold">$0</span>
            <div className="relative text-lg">🛒<span className="absolute -top-2 -right-2 bg-yellow-500 text-[10px] px-1.5 py-0.5 rounded-full text-black font-bold">0</span></div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="flex p-6 gap-8 max-w-[1600px] mx-auto">
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <h3 className="text-gray-400 font-semibold mb-6 text-sm uppercase">Departments</h3>
          <ul className="space-y-3">
            <li className="bg-[#374151] p-3 rounded-xl border-l-4 border-blue-500 cursor-pointer flex items-center gap-3">👦 All Products</li>
            <li className="p-3 hover:bg-[#374151] rounded-xl cursor-pointer text-gray-400 flex items-center gap-3 transition">💻 Electronics</li>
            <li className="p-3 hover:bg-[#374151] rounded-xl cursor-pointer text-gray-400 flex items-center gap-3 transition">🥫 Food & Oils</li>
            <li className="p-3 hover:bg-[#374151] rounded-xl cursor-pointer text-gray-400 flex items-center gap-3 transition">👟 Clothing & Shoes</li>
          </ul>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {products.map((item) => (
              <div key={item.id} className="bg-[#3b444b] border border-gray-600 rounded-2xl p-4 flex flex-col shadow-xl hover:scale-[1.02] transition-transform group">
                <div className="bg-white rounded-xl mb-4 h-48 flex items-center justify-center p-4">
                  <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <h4 className="font-bold text-sm mb-1 group-hover:text-yellow-500 transition">{item.name}</h4>
                <div className="text-yellow-500 text-xs mb-2">{"★".repeat(item.stars)}{"☆".repeat(5 - item.stars)}</div>
                <p className="text-2xl font-black mb-4">${item.price}</p>
                <div className="mt-auto flex gap-2">
                  <button className={`${item.color} text-black text-xs font-black py-2.5 px-3 rounded-lg flex-1 hover:brightness-110`}>Add to Cart</button>
                  <button className="bg-white text-black text-xs font-bold py-2.5 px-3 rounded-lg">Similar</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* --- AUTH MODALS --- */}
      {(isLoginOpen || isRegisterOpen) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#3b444b] p-8 rounded-3xl w-full max-w-md border border-gray-600 shadow-2xl relative">
            <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            <h2 className="text-3xl font-bold mb-6 text-yellow-500">{isLoginOpen ? "Welcome Back" : "Join QuickShop"}</h2>

            <form onSubmit={(e) => handleAuth(e, isLoginOpen ? "Login" : "Register")} className="space-y-4">
              {!isLoginOpen && (
                <input name="name" type="text" placeholder="Full Name" onChange={handleChange} required className="w-full p-3 rounded-xl bg-[#2c343a] border border-gray-600 focus:border-yellow-500 outline-none" />
              )}
              <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required className="w-full p-3 rounded-xl bg-[#2c343a] border border-gray-600 focus:border-yellow-500 outline-none" />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 rounded-xl bg-[#2c343a] border border-gray-600 focus:border-yellow-500 outline-none" />
              
              <button disabled={loading} type="submit" className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 disabled:bg-gray-500 transition mt-4">
                {loading ? "PROCESSING..." : (isLoginOpen ? "LOGIN" : "CREATE ACCOUNT")}
              </button>
            </form>

            <button onClick={() => { setIsLoginOpen(!isLoginOpen); setIsRegisterOpen(!isRegisterOpen); }} className="w-full text-center mt-6 text-sm text-yellow-500 font-bold hover:underline">
              {isLoginOpen ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}