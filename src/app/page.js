"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '', address: '' });

  const products = [
    { id: 1, name: 'Premium Headphones', price: 99, img: '/images/headphones.jpg', stars: 5 },
    { id: 2, name: 'Smart Watch', price: 149, img: '/images/watch.jpg', stars: 4 },
    { id: 3, name: 'Gaming Mouse', price: 59, img: '/images/mouse.jpg', stars: 5 },
    { id: 4, name: 'Mechanical Keyboard', price: 89, img: '/images/keyboard.jpg', stars: 4 },
    { id: 5, name: 'Organic Essential Oil', price: 25, img: '/images/oil.jpg', stars: 5 },
    { id: 6, name: 'Designer Glasses', price: 140, img: '/images/glass.jpg', stars: 4 },
  ];

  // --- CHECK SESSION ON LOAD ---
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    checkUser();
  }, []);

  // --- ACTIONS ---
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert("Logged out!");
  };

  const handleAuth = async (e, type) => {
    e.preventDefault();
    try {
      if (type === "Register") {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name } }
        });
        if (error) throw error;
        alert("Success! Check email.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        setUser(data.user);
        setIsLoginOpen(false);
      }
    } catch (err) { alert(err.message); }
  };

  const completePurchase = () => {
    alert(`Order placed for ${formData.name}! Total: $${cart.reduce((a, b) => a + b.price, 0)}`);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#2c343a] text-white font-sans">
      {/* --- NAVBAR --- */}
      <nav className="bg-[#1a2024] p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">🛒 QuickShop</div>
        
        <div className="flex-1 max-w-xl mx-4">
          <input type="text" placeholder="Search product..." className="w-full p-2 rounded bg-white text-black text-sm" />
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button onClick={() => setIsLoginOpen(true)} className="text-sm hover:text-yellow-500">Login</button>
              <button onClick={() => setIsRegisterOpen(true)} className="text-sm hover:text-yellow-500">Register</button>
            </>
          ) : (
            <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded text-sm font-bold hover:bg-red-600">Logout</button>
          )}
          <div onClick={() => setIsCheckoutOpen(true)} className="relative cursor-pointer bg-[#374151] p-2 rounded">
            🛒 <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>
          </div>
        </div>
      </nav>

      <div className="flex p-6 gap-6 max-w-[1400px] mx-auto">
        {/* --- SIDEBAR --- */}
        <aside className="w-48 flex-shrink-0">
          <h3 className="font-bold mb-4 text-gray-400 uppercase text-xs">Departments</h3>
          <ul className="space-y-2 text-sm">
            <li className="bg-[#3b444b] p-2 rounded-lg text-yellow-500">📦 All Products</li>
            <li className="p-2 hover:bg-gray-700 rounded-lg">💻 Electronics</li>
            <li className="p-2 hover:bg-gray-700 rounded-lg">🥫 Food & Oils</li>
          </ul>
        </aside>

        {/* --- PRODUCT GRID --- */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white text-black rounded-xl p-4 flex flex-col items-center text-center shadow-lg">
              <img src={item.img} alt={item.name} className="h-40 object-contain mb-4" />
              <h4 className="font-bold">{item.name}</h4>
              <div className="text-yellow-500 text-xs">{"★".repeat(item.stars)}</div>
              <p className="text-xl font-bold text-red-600 mb-4">${item.price}</p>
              <div className="flex gap-2 w-full mt-auto">
                <button onClick={() => addToCart(item)} className="bg-yellow-500 text-xs font-bold py-2 rounded flex-1 hover:bg-yellow-400 transition">Add to Cart</button>
                <button className="bg-gray-200 text-xs font-bold py-2 rounded px-3">Similar</button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* --- CHECKOUT MODAL (MATCHES IMAGE) --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white text-black p-8 rounded-2xl w-full max-w-xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#2c343a]">Checkout</h2>
              <span className="text-2xl">🛒</span>
            </div>
            
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
              {cart.map((i, idx) => (
                <div key={idx} className="flex items-center gap-2 border p-2 rounded bg-gray-50 min-w-[150px]">
                  <img src={i.img} className="w-10 h-10 object-contain" />
                  <div className="text-[10px] font-bold">
                    <p>{i.name}</p>
                    <p className="text-red-600">${i.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <input type="text" placeholder="Full Name" onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:border-yellow-500" />
              <input type="text" placeholder="Phone Number" onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:border-yellow-500" />
              <input type="text" placeholder="Shipping Address" onChange={(e)=>setFormData({...formData, address: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:border-yellow-500" />
              
              <button onClick={completePurchase} className="w-full bg-yellow-500 text-black font-bold py-4 rounded-lg hover:bg-yellow-400 transition text-lg mt-4">
                Complete Purchase
              </button>
              <button onClick={() => setIsCheckoutOpen(false)} className="w-full text-blue-500 text-sm font-bold hover:underline">Continue Shopping</button>
            </div>
          </div>
        </div>
      )}

      {/* --- AUTH MODALS (HIDDEN IF LOGGED IN) --- */}
      {(isLoginOpen || isRegisterOpen) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#3b444b] p-8 rounded-2xl w-full max-w-md relative">
            <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(false); }} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">{isLoginOpen ? "Login" : "Register"}</h2>
            <form onSubmit={(e) => handleAuth(e, isLoginOpen ? "Login" : "Register")} className="space-y-4">
              {!isLoginOpen && <input name="name" type="text" placeholder="Name" onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded bg-[#2c343a] border border-gray-600" />}
              <input name="email" type="email" placeholder="Email" onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full p-3 rounded bg-[#2c343a] border border-gray-600" />
              <input name="password" type="password" placeholder="Password" onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full p-3 rounded bg-[#2c343a] border border-gray-600" />
              <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded">GO</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}