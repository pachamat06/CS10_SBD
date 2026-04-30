import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function CardList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchItems(token);
  }, []);

  async function fetchItems(token) {
    try {
      const res = await fetch(`${API}/item`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat barang");
      // support berbagai bentuk response: array langsung atau { payload: [...] }
      setItems(Array.isArray(data) ? data : data.payload ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Loading skeleton (sama dengan style card asli) ──
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-xl shadow p-4 animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-full mb-1" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => { setLoading(true); setError(""); fetchItems(localStorage.getItem("token")); }}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ── Empty state ──
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p className="text-4xl mb-2">📦</p>
        <p className="font-semibold">Belum ada barang tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {items.map((item) => (
        <div key={item.id} className="border rounded-xl shadow p-4">
          <img
            src={item.image || `https://picsum.photos/seed/${item.id}/500/300`}
            alt={item.name}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="font-bold text-lg mt-2">{item.name}</h2>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {item.description || "Tidak ada deskripsi"}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-blue-600 font-bold text-base">
              Rp {Number(item.price).toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              Stok: {item.stock}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}