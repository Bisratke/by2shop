"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [formData, setFormData] = useState({ email: '', name: '', phone: '', address: '' });

  const products = [
    { id: 1, name: 'Premium Headphones', price: 99, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', stars: 4 },
    { id: 2, name: 'Smart Watch', price: 149, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', stars: 5 },
    { id: 3, name: 'Gaming Mouse', price: 59, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', stars: 4 },
    { id: 4, name: 'Mechanical Keyboard', price: 89, img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500', stars: 5 },
    { id: 5, name: 'Organic Essential Oil', price: 25, img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', stars: 4 },
    { id: 6, name: 'Designer Glasses', price: 120, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', stars: 5 },
  ];

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const completePurchase = async (e) => {
    e.preventDefault();
    
    // Safety check for keys
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return alert("ERROR: Telegram Keys are missing in Vercel. Please add them and REDEPLOY.");
    }
    if (!screenshot) return alert("Please upload your payment screenshot!");

    setLoading(true);
    const total = cart.reduce((a, b) => a + b.price, 0);
    const orderItems = cart.map(item => `${item.name} ($${item.price})`).join(', ');

    try {
      // 1. SEND TO TELEGRAM
      const telegramData = new FormData();
      telegramData.append('chat_id', chatId);
      telegramData.append('photo', screenshot);
      telegramData.append('caption', `🚀 NEW ORDER!\n👤 Name: ${formData.name}\n📞 Phone: ${formData.phone}\n📍 Address: ${formData.address}\n💰 Total: $${total}\n📦 Items: ${orderItems}`);

      const telResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: telegramData,
      });

      if (!telResponse.ok) throw new Error("Telegram failed. Check your Bot Token.");

      // 2. SEND EMAIL (Optional - Won't crash if it fails)
      try {
        if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY && process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
          await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            { to_email: formData.email, user_name: formData.name, total_amount: `$${total}` },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
          );
        }
      } catch (emailErr) {
        console.error("Email failed but Telegram worked", emailErr);
      }

      // 3. FINAL SUCCESS MESSAGE
      alert("✅ SUCCESS! Order and Screenshot sent to Admin.");
      setCart([]);
      setIsCheckoutOpen(false);
      setScreenshot(null);

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-900">
      {/* HEADER */}
      <header className="bg-[#1a2024] text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-10">
          <div className="text-2xl font-black italic">🛒 QUICK<span className="text-yellow-500">SHOP</span></div>
          <div className="flex-1 max-w-xl mx-10 hidden md:block">
            <input type="text" placeholder="Search..." className="w-full p-2 rounded-lg text-black text-sm outline-none" />
          </div>
          <div className="flex items-center gap-6">
            {!user ? (
              <button onClick={() => setIsLoginOpen(true)} className="text-sm font-bold">Login</button>
            ) : (
              <button onClick={() => supabase.auth.signOut()} className="text-sm font-bold text-red-400">Logout</button>
            )}
            <div onClick={() => setIsCheckoutOpen(true)} className="relative cursor-pointer bg-gray-800 p-2 rounded-xl">
              <span className="text-yellow-500 font-bold mr-2">${cart.reduce((a, b) => a + b.price, 0)}</span>
              🛒 <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex p-6 gap-8">
        {/* SIDEBAR */}
        <aside className="w-64 hidden lg:block">
          <div className="bg-[#1a2024] text-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-6">Categories</h3>
            <ul className="space-y-4 text-sm">
              <li className="text-yellow-500 cursor-pointer">📦 All Products</li>
              <li className="text-gray-400 hover:text-white cursor-pointer">💻 Electronics</li>
              <li className="text-gray-400 hover:text-white cursor-pointer">🍔 Food & Oils</li>
              <li className="text-gray-400 hover:text-white cursor-pointer">👟 Fashion</li>
            </ul>
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition group">
              <div className="h-48 w-full mb-6 flex items-center justify-center overflow-hidden">
                <img src={p.img} alt={p.name} className="max-h-full object-contain group-hover:scale-110 transition" />
              </div>
              <h4 className="font-bold text-lg mb-1">{p.name}</h4>
              <div className="text-yellow-400 text-sm mb-3">{"★".repeat(p.stars)}{"☆".repeat(5-p.stars)}</div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-red-600">${p.price}</span>
                <button onClick={() => setCart([...cart, p])} className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-2xl text-xs hover:bg-yellow-400">Add to Cart</button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[40px] w-full max-w-lg shadow-2xl overflow-y-auto max-h-[95vh]">
            <h2 className="text-3xl font-black mb-6">Checkout</h2>
            <div className="bg-blue-50 p-5 rounded-3xl mb-6 border border-blue-100">
              <p className="text-xs font-bold text-blue-800 mb-3 uppercase">Bank Details</p>
              <p className="text-sm mb-1">🏦 <b>CBE:</b> 1000123456789</p>
              <p className="text-sm">📱 <b>Telebirr:</b> 0911223344</p>
              <p className="text-red-600 font-black text-xl mt-3">Total: ${cart.reduce((a, b) => a + b.price, 0)}</p>
            </div>

            <form onSubmit={completePurchase} className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full p-4 bg-gray-100 rounded-2xl" onChange={(e)=>setFormData({...formData, name:e.target.value})}/>
              <input type="text" placeholder="Phone" required className="w-full p-4 bg-gray-100 rounded-2xl" onChange={(e)=>setFormData({...formData, phone:e.target.value})}/>
              <input type="email" placeholder="Email" required className="w-full p-4 bg-gray-100 rounded-2xl" onChange={(e)=>setFormData({...formData, email:e.target.value})}/>
              
              <div className="border-2 border-dashed border-gray-200 p-6 rounded-3xl text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Upload Payment Receipt</p>
                <input type="file" accept="image/*" required className="text-xs" onChange={(e)=>setScreenshot(e.target.files[0])}/>
              </div>

              <button disabled={loading} className="w-full bg-yellow-500 py-5 rounded-3xl font-black text-lg shadow-xl">
                {loading ? "PROCCESSING..." : "COMPLETE PURCHASE"}
              </button>
              <button type="button" onClick={() => setIsCheckoutOpen(false)} className="w-full text-gray-400 font-bold text-sm mt-2">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}