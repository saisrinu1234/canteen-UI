// import { useEffect, useState } from "react";
// import api from "../api/axios";

// const Home = () => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   const fetchMenu = async () => {
//     try {
//       const res = await api.get("/menu/all");
//       setItems(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const addToCart = (item) => {
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];

//     const exists = cart.find((i) => i.id === item.id);

//     if (exists) {
//       alert("Item already in cart");
//       return;
//     }
//     alert("Item added Successfully");
//     // add with default quantity = 1
//     cart.push({ ...item, qty: 1 });

//     localStorage.setItem("cart", JSON.stringify(cart));
//   };
//   return (
//     <div>
//       <div className="menu-list">
//         {items.map((item) => {
//           const imageSrc = `data:image/jpeg;base64,${item.image}`;

//           return (
//             <div
//               key={item.id}
//               className={`menu-card ${!item.available ? "unavailable" : ""}`}
//             >
//               <img src={imageSrc} alt={item.name} />

//               <div className="details">
//                 <h3 className="item-name">{item.name}</h3>
//                 <p className="item-price">₹{item.price}</p>
//               </div>
//               <button
//                 className="cart-btn"
//                 disabled={!item.available}
//                 onClick={() => addToCart(item)}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Home;
import { useEffect, useState } from "react";
import api from "../api/axios";

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu/all");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((i) => i.id === item.id);

    if (exists) {
      alert("Item already in cart");
      return;
    }

    cart.push({ ...item, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Item added successfully");
  };

  return (
    <div>
      <div className="menu-list">
        {items.map((item) => (
          <div
            key={item.id}
            className={`menu-card ${!item.available ? "unavailable" : ""}`}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="menu-image"
            />

            <div className="details">
              <h3 className="item-name">{item.name}</h3>
              <p>{item.description}</p>
              <p className="item-price">₹{item.price}</p>
            </div>

            <button
              className="cart-btn"
              disabled={!item.available}
              onClick={() => addToCart(item)}
            >
              {item.available ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;