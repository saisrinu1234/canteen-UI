import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const email = localStorage.getItem("usermail");
      const res = await api.get(`/auth/get/${email}`);
      setUser(res.data);

      // ✅ fill form with existing data
      setForm({
        name: res.data.name,
        phone: res.data.phone,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 UPDATE API CALL
  const handleUpdate = async () => {
    try {
      const email = localStorage.getItem("usermail");

      const res = await api.put(`/auth/update/${email}`, form);

      setUser(res.data); // update UI
      setEditing(false); // close edit mode
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="header-left">
          <div className="avatar">👤</div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        {/* 🔥 Toggle Update */}
      </div>
      <div className="update-div">
        {!editing ? (
          <button className="update-btn" onClick={() => setEditing(true)}>
            Update
          </button>
        ) : (
          <button className="update-btn" onClick={handleUpdate}>
            Save
          </button>
        )}
      </div>

      {/* 🔥 EDIT MODE */}
      {editing && (
        <div className="edit-form">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone"
          />

          <button className="cancel-btn" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      )}

      {/* Details Section */}
      {!editing && (
        <div className="profile-details">
          <div className="detail-box">
            <span>Phone</span>
            <p>{user.phone}</p>
          </div>

          <div className="detail-box">
            <span>Joined</span>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
