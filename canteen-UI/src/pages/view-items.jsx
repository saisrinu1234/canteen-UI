// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import "./viewitems.css";

// function ViewItems() {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     try {
//       const res = await api.get("/menu/all");
//       setItems(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const deleteItem = async (id) => {
//     const ok = window.confirm("Are you sure you want to delete this item?");
//     if (!ok) return;

//     try {
//       await api.delete(`/menu/admin/delete/${id}`);
//       fetchItems();
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   const toggleAvailability = async (id) => {
//     try {
//       const response = await api.put(`/menu/admin/availability/${id}`);
//       fetchItems();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="vi-container">
//       <h2 className="vi-title">🍽 Menu Items</h2>

//       <div className="vi-grid">
//         {items.map((item) => (
//           <div
//             key={item.id}
//             className={`vi-card ${!item.available ? "vi-unavailable" : ""}`}
//           >
//             <div className="vi-imgBox">
//               <img
//                 src={`data:image/jpeg;base64,${item.image}`}
//                 alt={item.name}
//                 className="vi-img"
//               />
//             </div>

//             <div className="vi-content">
//               <h3 className="vi-name">{item.name}</h3>
//               <div className="vi-price">₹{item.price}</div>
//             </div>

//             <div className="vi-actions">
//               <button
//                 className="vi-statusBtn"
//                 onClick={() => toggleAvailability(item.id)}
//               >
//                 {item.available ? "🚫 Unavailable" : "✅ Available"}
//               </button>

//               <button
//                 className="vi-deleteBtn"
//                 onClick={() => deleteItem(item.id)}
//               >
//                 🗑 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ViewItems;
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
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this item?");
    if (!ok) return;

    try {
      await api.delete(`/menu/admin/delete/${id}`);
      fetchItems();
      alert("Item deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await api.put(`/menu/admin/availability/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="vi-container">
      <h2 className="vi-title">🍽 Menu Items</h2>

      <div className="vi-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`vi-card ${!item.available ? "vi-unavailable" : ""}`}
          >
            <div className="vi-imgBox">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="vi-img"
                onError={(e) => {
                  e.target.src = "/no-image.png"; // Optional fallback image
                }}
              />
            </div>

            <div className="vi-content">
              <h3 className="vi-name">{item.name}</h3>
              <p>{item.description}</p>
              <div className="vi-price">₹{item.price}</div>
            </div>

            <div className="vi-actions">
              <button
                className="vi-statusBtn"
                onClick={() => toggleAvailability(item.id)}
              >
                {item.available ? "🚫 Unavailable" : "✅ Available"}
              </button>

              <button
                className="vi-deleteBtn"
                onClick={() => deleteItem(item.id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewItems;