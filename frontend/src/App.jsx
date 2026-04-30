import Navbar from "./components/Navbar";
import CardList from "./components/CardList";
import Counter from "./components/Counter";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
 
        {/* Main pages */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div>
                <Navbar />
                <Counter />
                <CardList />
              </div>
            </PrivateRoute>
          }
        />
 
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}