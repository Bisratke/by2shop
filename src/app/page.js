"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null); // For the image
  const [formData, setFormData] = useState({ email: '', name: '', phone: '', address: '' });

  // --- PRODUCTS (Keep your existing list here) ---
  const products = [
    { id: 1, name: 'Premium Headphones', price: 99, img: '/images/headphones.jpg', stars: 5 },
    { id: 2, name: 'Smart Watch', price: 149, img: '/images/watch.jpg', stars: 4 },
    // ... add others
  ];

  // --- HANDLERS ---
  const handleScreenshotChange = (e) => {
    if (e.target.files[0]) setScreenshot(e.target.files[0]);
  };

  const completePurchase = async (e) => {
    e.preventDefault();
    if (!screenshot) return alert("Please upload a payment screenshot first!");
    
    setLoading(true);
    const total = cart.reduce((a, b) => a + b.price, 0);
    const orderItems = cart.map(item => `${item.name} ($${item.price})`).join(', ');

    try {
      // 1. SEND TO TELEGRAM (Admin)
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

      // Send Text Data first
      const textMsg = `🚀 NEW ORDER!\n👤 ${formData.name}\n📞 ${formData.phone}\n📍 ${formData.address}\n💰 Total: $${total}\n📦 Items: ${orderItems}`;
      
      const formDataTelegram = new FormData();
      formDataTelegram.append('chat_id', chatId);
      formDataTelegram.append('photo', screenshot);
      formDataTelegram.append('caption', textMsg);

      await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formDataTelegram,
      });

      // 2. SEND CONFIRMATION EMAIL (Customer)
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          to_email: formData.email,
          user_name: formData.name,
          total_amount: `$${total}`,
          message: "Thank you! We received your screenshot. We will verify and deliver soon."
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      alert("Order & Screenshot Sent! We will contact you soon.");
      setCart([]);
      setIsCheckoutOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c343a] text-white">
      {/* ... (Your Navbar and Product Grid Code) ... */}

      {/* --- CHECKOUT MODAL WITH PAYMENT DETAILS --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white text-black p-6 rounded-2xl w-full max-w-lg my-8">
            <h2 className="text-2xl font-bold mb-4">Finalize Order</h2>
            
            {/* Payment Accounts Box */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6 text-sm">
              <p className="font-bold text-blue-800 mb-2">Bank Transfer Details:</p>
              <p>🏦 <b>CBE:</b> 1000123456789</p>
              <p>🏦 <b>Awash:</b> 0132045678900</p>
              <p>📱 <b>Telebirr:</b> 0911223344</p>
              <p className="mt-2 text-red-600 font-semibold italic">* Please pay the total: ${cart.reduce((a, b) => a + b.price, 0)} and upload screenshot below.</p>
            </div>

            <form onSubmit={completePurchase} className="space-y-3">
              <input type="text" placeholder="Full Name" required onChange={(e)=>setFormData({...formData, name:e.target.value})} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Phone Number" required onChange={(e)=>setFormData({...formData, phone:e.target.value})} className="w-full p-2 border rounded" />
              <input type="email" placeholder="Email (for receipt)" required onChange={(e)=>setFormData({...formData, email:e.target.value})} className="w-full p-2 border rounded" />
              
              <label className="block text-xs font-bold text-gray-500 uppercase">Upload Payment Screenshot</label>
              <input type="file" accept="image/*" required onChange={handleScreenshotChange} className="w-full text-sm" />

              <button disabled={loading} type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 mt-4">
                {loading ? "SENDING..." : "SUBMIT ORDER"}
              </button>
              <button type="button" onClick={() => setIsCheckoutOpen(false)} className="w-full text-gray-500 text-xs">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}