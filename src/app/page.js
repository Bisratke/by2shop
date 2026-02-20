"use client";
import { db } from "./firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function BShopApp() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: State for customer details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Firebase Error:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => setCart([...cart, product]);
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const sendToTelegram = async () => {
    if (cart.length === 0) return alert("Your basket is empty!");
    if (!customerName || !customerPhone) return alert("Please enter your Name and Phone Number!");

    const botToken = "8296320903:AAF3xx-J0KWVCYDAAAObgoAS8yu8NlyMfk4";
    const chatId = "8513639706"; 

    // Formatting the message to include Customer Info
    let message = "🛍️ **NEW ORDER FROM BY2SHOP**\n";
    message += "━━━━━━━━━━━━━━━━━━\n";
    message += `👤 **Customer:** ${customerName}\n`;
    message += `📞 **Phone:** ${customerPhone}\n`;
    message += "━━━━━━━━━━━━━━━━━━\n";
    cart.forEach((item, i) => {
      message += `✅ ${item.name} — $${item.price}\n`;
    });
    message += "━━━━━━━━━━━━━━━━━━\n";
    message += `💰 **TOTAL: $${total}**\n`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (response.ok) {
        alert("🚀 Order sent! We will call you soon.");
        setCart([]); 
        setCustomerName("");
        setCustomerPhone("");
      } else {
        alert("Error: Bot not started.");
      }
    } catch (error) {
      alert("Network Error.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <nav className="p-4 bg-white border-b sticky top-0 z-20 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-black text-blue-600">BY2SHOP</h1>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
          Basket: {cart.length} | ${total}
        </div>
      </nav>

      <main className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white border rounded-3xl p-4 shadow-sm">
                <img src={p.image} className="w-full h-48 object-cover rounded-2xl mb-4" alt={p.name} />
                <h3 className="font-bold text-lg">{p.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-black text-blue-600">${p.price}</span>
                  <button onClick={() => addToCart(p)} className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold">Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar with Phone Number Input */}
        <div className="bg-white border rounded-3xl p-6 h-fit shadow-lg sticky top-24">
          <h2 className="font-bold text-xl mb-4">Delivery Details</h2>
          
          <div className="space-y-4 mb-6">
            <input 
              type="text" 
              placeholder="Your Full Name" 
              className="w-full p-3 border rounded-xl outline-blue-500"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input 
              type="tel" 
              placeholder="Phone Number (e.g. 09...)" 
              className="w-full p-3 border rounded-xl outline-blue-500"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <h2 className="font-bold text-lg border-t pt-4 mb-4">Items: {cart.length}</h2>
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500">Total:</span>
            <span className="text-3xl font-black">${total}</span>
          </div>
          
          <button 
            onClick={sendToTelegram}
            className="w-full py-4 rounded-2xl font-black text-lg bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg"
          >
            CONFIRM ORDER
          </button>
        </div>
      </main>
    </div>
  );
}