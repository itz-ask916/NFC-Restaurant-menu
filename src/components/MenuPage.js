import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import LiveOrderStatus from "./LiveOrderStatus";
import "./MenuPage.css";

const menuItems = [
  { id: 1, name: "Pizza", price: 200, time: 15 },
  { id: 2, name: "Burger", price: 150, time: 10 },
  { id: 3, name: "Pasta", price: 180, time: 12 },
  { id: 4, name: "French Fries", price: 100, time: 8 },
  { id: 5, name: "Sandwich", price: 120, time: 7 },
  { id: 6, name: "Salad", price: 130, time: 6 },
  { id: 7, name: "Soup", price: 140, time: 9 },
  { id: 8, name: "Coffee", price: 90, time: 5 },
  { id: 9, name: "Tea", price: 80, time: 4 },
  { id: 10, name: "Juice", price: 110, time: 6 },
];

const MenuPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [message, setMessage] = useState("");

  const totalBill = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const avgTime =
    selectedItems.length > 0
      ? Math.round(
          selectedItems.reduce((sum, item) => sum + item.time, 0) /
            selectedItems.length
        )
      : 0;

  const toggleSelection = (item) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(item)
        ? prevItems.filter((i) => i !== item)
        : [...prevItems, item]
    );
  };

  const placeOrder = async () => {
    if (!tableNumber) {
      setMessage("❌ Please enter a table number.");
      return;
    }

    if (selectedItems.length === 0) {
      setMessage("❌ Please select at least one item.");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        table: tableNumber,
        items: selectedItems,
        status: "Pending",
        timestamp: serverTimestamp(),
      });

      setMessage("✅ Order placed successfully!");
      setSelectedItems([]);
    } catch (error) {
      setMessage("❌ Failed to place order. Try again.");
    }
  };

  return (
    <div className="menu-container">
      <h2>📜 Restaurant Menu</h2>
      <input
        type="number"
        placeholder="Enter Table Number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        className="table-input"
      />
      <div className="menu-list">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${selectedItems.includes(item) ? "selected" : ""}`}
            onClick={() => toggleSelection(item)}
          >
            {item.name} - ₹{item.price} ({item.time} min)
          </div>
        ))}
      </div>
      <div className="order-summary">
        {selectedItems.length > 0 && (
          <div>
            <h3>🧾 Bill Summary</h3>
            <p>Total: ₹{totalBill}</p>
            <p>Avg. Time: {avgTime} min</p>
          </div>
        )}
        <button onClick={placeOrder} className="order-button" disabled={!tableNumber || selectedItems.length === 0}>
          Place Order
        </button>
      </div>
      {message && <p className="message">{message}</p>}
      {tableNumber && <LiveOrderStatus tableNumber={tableNumber} />}
    </div>
  );
};

export default MenuPage;
