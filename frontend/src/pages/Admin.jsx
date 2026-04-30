import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "http://localhost:3000";

// helper
function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

// konfirm hapus
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <p className="text-gray-700 font-medium mb-6 text-center">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// user management
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/user/all`, { headers: authHeader() });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.payload ?? []);
    } catch {
      setMsg({ type: "error", text: "Gagal memuat data user" });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          id: editUser.id,
          name: editUser.name,
          username: editUser.username,
          email: editUser.email,
          phone: editUser.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ type: "success", text: "User berhasil diperbarui" });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/user/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ type: "success", text: "User berhasil dihapus" });
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      {/* Feedback */}
      {msg.text && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm border ${
          msg.type === "success"
            ? "bg-green-50 border-green-300 text-green-700"
            : "bg-red-50 border-red-300 text-red-600"
        }`}>
          {msg.text}
          <button className="float-right font-bold" onClick={() => setMsg({ type: "", text: "" })}>✕</button>
        </div>
      )}

      {/* Modal edit */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              {["name", "username", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editUser[field] || ""}
                    onChange={(e) => setEditUser({ ...editUser, [field]: e.target.value })}
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setEditUser(null)}
                  className="flex-1 border rounded-lg py-2 text-gray-600 hover:bg-gray-100">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {deleteTarget && (
        <ConfirmModal
          message={`Hapus user "${deleteTarget.name}"?`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Tabel */}
      {loading ? (
        <p className="text-gray-400 text-center py-8">Memuat...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Tidak ada user</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border rounded-xl overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                {["ID", "Nama", "Username", "Email", "Telepon", "Saldo", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-gray-500">{u.id}</td>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.phone}</td>
                  <td className="px-4 py-3">Rp {Number(u.balance || 0).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditUser(u)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200">
                        Edit
                      </button>
                      <button onClick={() => setDeleteTarget(u)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// baraang manajemen
function ItemManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/item`, { headers: authHeader() });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.payload ?? []);
    } catch {
      setMsg({ type: "error", text: "Gagal memuat data barang" });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/item/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          name: editItem.name,
          description: editItem.description,
          price: Number(editItem.price),
          stock: Number(editItem.stock),
          image: editItem.image,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ type: "success", text: "Barang berhasil diperbarui" });
      setEditItem(null);
      fetchItems();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/item/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ type: "success", text: "Barang berhasil dihapus" });
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      {/* Feedback */}
      {msg.text && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm border ${
          msg.type === "success"
            ? "bg-green-50 border-green-300 text-green-700"
            : "bg-red-50 border-red-300 text-red-600"
        }`}>
          {msg.text}
          <button className="float-right font-bold" onClick={() => setMsg({ type: "", text: "" })}>✕</button>
        </div>
      )}

      {/* Modal edit */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Barang</h3>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editItem.name || ""}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2} value={editItem.description || ""}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editItem.price || ""}
                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editItem.stock || ""}
                    onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..." value={editItem.image || ""}
                  onChange={(e) => setEditItem({ ...editItem, image: e.target.value })} />
                {editItem.image && (
                  <img src={editItem.image} alt="preview"
                    className="mt-2 h-24 w-full object-cover rounded-lg border"
                    onError={(e) => e.target.style.display = "none"} />
                )}
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setEditItem(null)}
                  className="flex-1 border rounded-lg py-2 text-gray-600 hover:bg-gray-100">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {deleteTarget && (
        <ConfirmModal
          message={`Hapus barang "${deleteTarget.name}"?`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Grid barang */}
      {loading ? (
        <p className="text-gray-400 text-center py-8">Memuat...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Tidak ada barang</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-xl shadow p-4">
              <img
                src={item.image || `https://picsum.photos/seed/${item.id}/500/300`}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/500/300`; }}
              />
              <h2 className="font-bold text-base mt-2">{item.name}</h2>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-blue-600 font-bold text-sm">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  Stok: {item.stock}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditItem({ ...item })}
                  className="flex-1 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200">
                  Edit
                </button>
                <button onClick={() => setDeleteTarget(item)}
                  className="flex-1 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// admin
export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("users");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Panel Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola user dan barang</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setTab("users")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition ${
              tab === "users"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            👥 Manajemen User
          </button>
          <button
            onClick={() => setTab("items")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition ${
              tab === "items"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            📦 Manajemen Barang
          </button>
        </div>

        {/* Tab content */}
        {tab === "users" ? <UserManagement /> : <ItemManagement />}
      </div>
    </div>
  );
}