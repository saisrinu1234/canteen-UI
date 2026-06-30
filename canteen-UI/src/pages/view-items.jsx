import { useEffect, useState } from "react";
import api from "../api/axios";
import "./viewitems.css";

function ViewItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/menu/all");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this item?");
    if (!ok) return;

    try {
      await api.delete(`/menu/admin/delete/${id}`);
      fetchItems();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="vi-container">
      <h2 className="vi-title">🍽 Menu Items</h2>

      <div className="vi-grid">
        {items.map((item) => (
          <div key={item.id} className="vi-card">

            <div className="vi-imgBox">
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.name}
                className="vi-img"
              />
            </div>

            <div className="vi-content">
              <h3 className="vi-name">{item.name}</h3>
              <div className="vi-price">₹{item.price}</div>
            </div>

            <button
              className="vi-deleteBtn"
              onClick={() => deleteItem(item.id)}
            >
              🗑 Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewItems;