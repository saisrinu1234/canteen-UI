import { useEffect, useState } from "react";
import api from "../api/axios";
import "./admin.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/pending-orders");
      setOrders(res.data);
    } catch (err) {
      console.log("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };
  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmCancel) return;

    try {
      const res = await api.post(`/payment/refund/${orderId}`);

      alert(res.data);

      // Reload orders after refund
      fetchOrders();
    } catch (error) {
      alert(error.response?.data || "Failed to cancel order");
    }
  };
  const markServed = async (id) => {
    try {
      await api.put(`/orders/admin/serve/${id}`);
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-page">
      <h2>📦 Admin Orders</h2>

      <h3>Total Pending Orders: {orders.length}</h3>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <p>
              <b>Order ID:</b> {order.id}
            </p>
            <p>
              <b>User:</b> {order.userEmail}
            </p>

            <p>
              <b>Status:</b>{" "}
              {order.served ? (
                <span className="status-done">✅ Delivered</span>
              ) : (
                <span className="status-pending">⏳ Pending</span>
              )}
            </p>

            <p>
              <b>Items:</b>
            </p>

            {order.items?.map((item, i) => (
              <div key={i} className="order-item">
                🍽 {item.name} × {item.qty} = ₹{item.price * item.qty}
              </div>
            ))}

            <hr />

            <p className="total">Total: ₹{order.totalAmount}</p>

            {!order.served && (
              <button
                className="servebutton"
                onClick={() => markServed(order.id)}
              >
                ✔ Mark as Served
              </button>
            )}
            {!order.served && (
              <button
                className="cancel-btn"
                onClick={() => cancelOrder(order.id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
