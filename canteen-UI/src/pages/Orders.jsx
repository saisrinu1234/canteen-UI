import { useEffect, useState } from "react";
import api from "../api/axios";
import "./orders.css";

const Orders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);

  useEffect(() => {
    loadOrders();
    loadHistory();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my/pending");
      setPendingOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get("/orders/served");
      setHistoryOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const renderOrders = (orders) =>
    orders.map((order) => (
      <div className="order-card" key={order.id}>
        <div className="order-header">
          <h3>Order #{order.id}</h3>

          <span className={order.served ? "served" : "pending"}>
            {order.served ? "Served" : "Pending"}
          </span>
        </div>

        <p className="date">
          {new Date(order.createdAt).toLocaleString()}
        </p>

        <p className="total">₹{order.totalAmount}</p>

        <div className="items">
          {order.items.map((item) => (
            <div className="item" key={item.id}>
              <span>{item.name}</span>
              <span>
                {item.qty} × ₹{item.price}
              </span>
            </div>
          ))}
        </div>

        <div className="payment">
          Payment : {order.paymentStatus}
        </div>
      </div>
    ));

  return (
    <div className="orders-container">
      <h2 className="title">My Orders</h2>

      <h3 className="section-title">Pending Orders</h3>

      {pendingOrders.length === 0 ? (
        <p className="empty">No pending orders.</p>
      ) : (
        renderOrders(pendingOrders)
      )}

      <h3 className="section-title history-title">Order History</h3>

      {historyOrders.length === 0 ? (
        <p className="empty">No order history.</p>
      ) : (
        renderOrders(historyOrders)
      )}
    </div>
  );
};

export default Orders;