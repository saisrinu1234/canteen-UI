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
      console.error(err);
    }
  };
  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((i) => i.id === item.id);

    if (exists) {
      alert("Item already in cart");
      return;
    }
    alert("Item added Successfully");
    // add with default quantity = 1
    cart.push({ ...item, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
  };
  return (
    <div>
      <div className="menu-list">
        {items.map((item) => {
          const imageSrc = `data:image/jpeg;base64,${item.image}`;

          return (
            <div
              key={item.id}
              className={`menu-card ${!item.available ? "unavailable" : ""}`}
            >
              <img src={imageSrc} alt={item.name} />

              <div className="details">
                <p>
                  <span className="label">Name:</span> {item.name}
                </p>
                <p>
                  <span className="label">Price:</span> ₹{item.price}
                </p>
              </div>

              <button
                className="cart-btn"
                disabled={!item.available}
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
