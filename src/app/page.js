"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser';

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
    { id: 1, name: 'Premium Headphones', price: 99, img: '/images/headphones.jpg', stars: 4 },
    { id: 2, name: 'Smart Watch', price: 149, img: '/images/watch.jpg', stars: 5 },
    { id: 3, name: 'Gaming Mouse', price: 59, img: '/images/mouse.jpg', stars: 4 },
    { id: 4, name: 'Mechanical Keyboard', price: 89, img: '/images/keyboard.jpg', stars: 5 },
    { id: 5, name: 'Organic Essential Oil', price: 25, img: '/images/oil.jpg', stars: 4 },
    { id: 6, name: 'Designer Glasses', price: 120, img: '/images/glass.jpg', stars: 5 },
    { id: 7, name: 'Pro Laptop', price: 1200, img: '/images/laptop.jpg', stars: 5 },
    { id: 8, name: 'Classic Sneakers', price: 75, img: '/images/shoes.jpg', stars: 4 },
  ];

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const completePurchase = async (e) => {
    e.preventDefault();
    if (!screenshot) return alert("Please upload a payment screenshot!");
    setLoading(true);

    try {
      const telegramData = new FormData();
      telegramData.append('chat_id', process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID);
      telegramData.append('photo', screenshot);
      telegramData.append('caption', `💰 NEW ORDER\n👤 ${formData.name}\n📞 ${formData.phone}\n📍 ${formData.address}\n💵 Total: $${cart.reduce((a, b) => a + b.price, 0)}`);

      await fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: 'POST', body: telegramData
      });

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        { to_email: formData.email, from_name: "QuickShop", message: "Pay to CBE: 1000123... or Telebirr: 0911..." },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      alert("Order & Receipt Sent Successfully!");
      setCart([]); setIsCheckoutOpen(false);
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* HEADER */}
      <header className="bg-[#2c343a] text-white p-3 flex items-center justify-between px-10 shadow-lg">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">🛒 Quick<span className="text-yellow-500">Shop</span></div>
        <div className="flex-1 max-w-xl mx-8">
          <input type="text" placeholder="Search products..." className="w-full p-2 rounded text-black text-sm outline-none" />
        </div>
        <div className="flex items-center gap-6 text-sm">
          {!user ? <button onClick={() => setIsLoginOpen(true)}>Login | Register</button> : <button onClick={() => supabase.auth.signOut()}>Logout</button>}
          <div onClick={() => setIsCheckoutOpen(true)} className="bg-[#3b444b] p-2 rounded flex items-center gap-2 cursor-pointer relative">
            <span className="text-yellow-500 font-bold">$ {cart.reduce((a, b) => a + b.price, 0)}</span>
            🛒 <span className="absolute -top-2 -right-2 bg-yellow-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold text-white">{cart.length}</span>
          </div>
        </div>
      </header>

      <div className="flex p-8 gap-8 max-w-[1400px] mx-auto">
        {/* SIDEBAR */}
        <aside className="w-56 flex-shrink-0 bg-white p-5 rounded-2xl shadow-sm h-fit">
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase">Departments</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="bg-[#2c343a] text-white p-2 rounded-lg cursor-pointer">📦 All Products</li>
            <li className="hover:text-yellow-600 cursor-pointer p-2 transition">💻 Electronics</li>
            <li className="hover:text-yellow-600 cursor-pointer p-2 transition">🥫 Food & Oils</li>
            <li className="hover:text-yellow-600 cursor-pointer p-2 transition">👟 Clothing & Shoes</li>
          </ul>
        </aside>

        {/* GRID */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition group">
              <div className="h-40 w-full flex items-center justify-center mb-4">
                <img src={p.img} alt={p.name} className="max-h-full object-contain group-hover:scale-105 transition" />
              </div>
              <h4 className="font-bold text-center text-sm mb-1">{p.name}</h4>
              <div className="text-yellow-500 text-xs mb-2">{"★".repeat(p.stars)}{"☆".repeat(5-p.stars)}</div>
              <p className="text-xl font-bold text-red-600 mb-4">${p.price}</p>
              <div className="flex gap-2 w-full">
                <button onClick={() => setCart([...cart, p])} className="bg-yellow-500 text-black text-[10px] font-bold py-2 px-3 rounded-lg flex-1 hover:bg-yellow-400">Add to Cart</button>
                <button className="bg-gray-100 text-gray-500 text-[10px] font-bold py-2 px-3 rounded-lg">Similar</button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white text-black p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">Checkout</h2>
            <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm border border-blue-100">
              <p className="font-bold text-blue-800 mb-2">Payment Accounts:</p>
              <p>🏦 <b>CBE:</b> 1000123456789</p>
              <p>📱 <b>Telebirr:</b> 0911223344</p>
              <p className="mt-2 text-red-600 font-bold">Total: ${cart.reduce((a, b) => a + b.price, 0)}</p>
            </div>
            <form onSubmit={completePurchase} className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-xl" onChange={(e)=>setFormData({...formData, name:e.target.value})}/>
              <input type="text" placeholder="Phone Number" required className="w-full p-3 border rounded-xl" onChange={(e)=>setFormData({...formData, phone:e.target.value})}/>
              <input type="email" placeholder="Email Address" required className="w-full p-3 border rounded-xl" onChange={(e)=>setFormData({...formData, email:e.target.value})}/>
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <p className="text-[10px] font-bold text-gray-400 mb-2">UPLOAD RECEIPT SCREENSHOT</p>
                <input type="file" accept="image/*" required className="text-xs" onChange={(e)=>setScreenshot(e.target.files[0])}/>
              </div>
              <button disabled={loading} className="w-full bg-yellow-500 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition shadow-lg shadow-yellow-200">{loading ? "SENDING..." : "Complete Purchase"}</button>
              <button type="button" onClick={()=>setIsCheckoutOpen(false)} className="w-full text-blue-500 font-bold text-sm">Continue Shopping</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}