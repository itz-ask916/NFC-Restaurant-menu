import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const LiveOrderStatus = ({ tableNumber }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!tableNumber) return; // Don't fetch if no table number entered

    const q = query(collection(db, "orders"), where("table", "==", tableNumber));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [tableNumber]);

  return (
    <div>
      <h2>📊 Your Order Status</h2>
      {orders.length === 0 ? <p>No orders found for Table {tableNumber}.</p> : null}
      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
          <h4>🛑 Table {order.table}</h4>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>🍽️ {item.name} - ₹{item.price}</li>
            ))}
          </ul>
          <p>Status: <strong>{order.status}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default LiveOrderStatus;
