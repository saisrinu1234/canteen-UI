import { useState } from "react";
import api from "../api/axios";
import "./Refund.css";

function Refund() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkOrder = async () => {
    if (!orderId) {
      alert("Enter Order ID");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(`/orders/admin/${orderId}`);
      console.log(res.data);

      setOrder(res.data);
    } catch (err) {
      alert(err.response?.data || "Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const refund = async () => {
    try {
      const res = await api.post(`/payment/refund/${order.id}`);

      alert(res.data);

      setOrder(null);
      setOrderId("");
    } catch (err) {
      alert(err.response?.data || "Refund Failed");
    }
  };

  return (
    <div className="refund-container">
      <div className="refund-card">
        <h2>Refund Payment</h2>

        <input
          type="number"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />

        <button className="check-btn" onClick={checkOrder}>
          {loading ? "Checking..." : "Check Order"}
        </button>

        {order && (
          <div className="order-details">
            <h3>Order Details</h3>

            <p>
              <b>Order ID:</b> {order.id}
            </p>

            <p>
              <b>Customer:</b> {order.userEmail}
            </p>

            <p>
              <b>Total:</b> ₹{order.totalAmount}
            </p>

            <p>
              <b>Payment:</b>{" "}
              <span
                className={`status ${
                  order.paymentStatus === "SUCCESS"
                    ? "success"
                    : order.paymentStatus === "REFUNDED"
                      ? "refunded"
                      : "pending"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>

            <p>
              <b>Order:</b>{" "}
              <span
                className={`status ${order.served ? "served" : "not-served"}`}
              >
                {order.served ? "Served" : "Pending"}
              </span>
            </p>

            <p>
              <b>Created:</b> {order.createdAt}
            </p>

            <h4>Items</h4>
            <p>Total Items: {order.items?.length}</p>
            <ul>
              {order.items?.map((item) => (
                <li key={item.id}>
                  <span>
                    <strong>{item.name}</strong>
                  </span>
                  <span>Qty: {item.qty}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>

            <button
              className="refund-btn"
              onClick={refund}
              disabled={order.paymentStatus !== "SUCCESS"}
            >
              Refund Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Refund;
