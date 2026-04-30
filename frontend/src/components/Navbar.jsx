import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        pachamat.06
      </h1>
      <ul className="flex gap-6 items-center">
        <li>
          <a className="cursor-pointer hover:underline" onClick={() => navigate("/")}>
            Home
          </a>
        </li>
        {user ? (
          <>
            {/* Link Admin */}
            <li>
              <a className="cursor-pointer hover:underline" onClick={() => navigate("/admin")}>
                Admin
              </a>
            </li>
            <li className="text-blue-200 text-sm">
              Halo, <span className="font-semibold text-white">{user.name}</span>
            </li>
            <li>
              <button onClick={handleLogout}
                className="bg-white text-blue-600 font-semibold px-4 py-1.5 rounded hover:bg-blue-50 transition">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <a className="cursor-pointer hover:underline" onClick={() => navigate("/login")}>
                Login
              </a>
            </li>
            <li>
              <button onClick={() => navigate("/register")}
                className="bg-white text-blue-600 font-semibold px-4 py-1.5 rounded hover:bg-blue-50 transition">
                Register
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}