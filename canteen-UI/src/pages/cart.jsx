import { useEffect, useState } from "react";
import "./Cart.css";
import api from "../api/axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const placeOrder = async () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      // ❌ If cart is empty
      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      // ✅ Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      };

      // ✅ API call
      const orderResponse = await api.post("/orders/place", orderData);
      // ✅ Success
      const order = orderResponse.data;
      console.log(order.id);
      const paymentResponse = await api.post(`/payment/create/${order.id}`);

      console.log(paymentResponse);
      const options = {
        key: paymentResponse.data.key,
        amount: paymentResponse.data.amount,
        currency: "INR",
        name: "Canteen",
        description: "Food Order",
        order_id: paymentResponse.data.orderId,

        handler: async function (response) {
          console.log(response);

          await api.post("/payment/verify", {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          alert("Payment Successful ✅");

          localStorage.removeItem("cart");
          setCartItems([]);
        },

        theme: {
          color: "#3399cc",
        },
      };
      setTimeout(() => {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }, 300);
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Network Error");
      }
    }
  };

  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(data);
  };

  const updateCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // ➕ Increase quantity
  const increaseQty = (index) => {
    let cart = [...cartItems];
    cart[index].qty++;
    updateCart(cart);
  };

  // ➖ Decrease (minimum 1 only)
  const decreaseQty = (index) => {
    let cart = [...cartItems];
    if (cart[index].qty > 1) {
      cart[index].qty--;
      updateCart(cart);
    }
  };

  // ❌ Remove item
  const removeItem = (index) => {
    let cart = [...cartItems];
    cart.splice(index, 1);
    updateCart(cart);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty">Cart is empty</p>
      ) : (
        cartItems.map((item, index) => {
          return (
            <div className="cart-card" key={index}>
              <img
                src={item.imageUrl}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "/no-image.png"; // Optional fallback image
                }}
              />

              <div className="cart-details">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>

                {/* Quantity Controls */}
                <div className="qty-box">
                  <button onClick={() => decreaseQty(index)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(index)}>+</button>
                </div>

                {/* Remove Button */}
                <button
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })
      )}
      <div className="cart-summary">
        <h3>Total: ₹{totalAmount}</h3>

        <button
          onClick={placeOrder}
          className="order-btn"
          disabled={cartItems.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
