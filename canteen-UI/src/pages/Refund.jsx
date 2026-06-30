import { useState } from "react";
import api from "../api/axios";
import "./Refund.css";

function Refund() {
  const [orderId, setOrderId] = useState("");

  const refund = async () => {
    if (!orderId) {
      alert("Enter Order ID");
      return;
    }

    try {
      const res = await api.post(`/payment/refund/${orderId}`);

      alert(res.data);

      setOrderId("");
    } catch (error) {
      alert(error.response?.data || "Refund Failed");
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

        <button className="refund-btn" onClick={refund}>
          Refund
        </button>
      </div>
    </div>
  );
}

export default Refund;
