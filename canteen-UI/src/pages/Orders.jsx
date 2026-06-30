import { useEffect, useState } from "react";
import api from "../api/axios";
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);
  

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my/pending");
      console.log(res.data); // debug
      setOrders(res.data || []); // safety
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="orders-container">
      <h2 className="title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={order.served ? "served" : "pending"}>
                {order.served ? "Served" : "Pending"}
              </span>
            </div>

            <p className="total">Total: ₹{order.totalAmount}</p>

            <div className="items">
              {order.items.map((item) => (
                <div className="item" key={item.id}>
                  <span>{item.name.replace(/"/g, "")}</span>
                  <span>
                    ₹{item.price} × {item.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
