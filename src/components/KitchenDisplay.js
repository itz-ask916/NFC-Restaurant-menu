import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, orderBy, query, updateDoc, doc, deleteDoc } from "firebase/firestore";
import "./KitchenDisplay.css";  // ✅ Import CSS

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, currentStatus) => {
    let newStatus;
    if (currentStatus === "Pending") newStatus = "Cooking";
    else if (currentStatus === "Cooking") newStatus = "Ready to Serve";
    else return;

    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  const deleteOrder = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await deleteDoc(orderRef);
  };

  return (
    <div className="kitchen-container">
      <h2>🍽️ Kitchen Display</h2>
      {orders.length === 0 ? <p>No orders yet</p> : null}
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className={`order-card ${order.status.toLowerCase().replace(" ", "-")}`}>
            <h3>🛑 Table {order.table}</h3>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>🍽️ {item.name} - ₹{item.price}</li>
              ))}
            </ul>
            <p><strong>Status:</strong> {order.status}</p>

            {order.status !== "Ready to Serve" ? (
              <button
                onClick={() => updateStatus(order.id, order.status)}
                className={`order-btn ${order.status === "Pending" ? "start-cooking" : "mark-ready"}`}
              >
                {order.status === "Pending" ? "Start Cooking" : "Mark as Ready"}
              </button>
            ) : (
              <button
                onClick={() => deleteOrder(order.id)}
                className="order-btn serve-remove"
              >
                ✅ Serve & Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDisplay;
