import { useState } from "react";
import api from "../api/axios";
import "./admin.css";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("image", image);

    try {
      const res = await api.post("menu/admin/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      alert(res.data);
      setForm({
        name: "",
        description: "",
        price: "",
      });

      setImage(null);

      // optional: reset file input visually
      e.target.reset();
    } catch (err) {
      console.log(err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit} className="add-product-form">
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default AddProduct;
