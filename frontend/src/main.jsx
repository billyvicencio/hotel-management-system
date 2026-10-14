import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  BedDouble,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  ArrowLeft,
  Check,
  X,
  Menu,
} from "lucide-react";
import "./style.css";

const readSession = () => sessionStorage.getItem("staywise.session") === "yes";
const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

function App() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [signedIn, setSignedIn] = useState(readSession);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    fetch(`${API_BASE}/rooms`)
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            "Could not load rooms. Is the Laravel server running?",
          );
        return response.json();
      })
      .then((data) => setRooms(data.data ?? data))
      .catch(() =>
        setApiError(
          "Could not connect to the room database. Start the Laravel server and refresh.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  const login = () => {
    setSignedIn(true);
    sessionStorage.setItem("staywise.session", "yes");
  };
  const logout = () => {
    setSignedIn(false);
    sessionStorage.removeItem("staywise.session");
  };
  const addRoom = async (room) => {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(room),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not save room.");
    const saved = data.data ?? data;
    setRooms((current) => [saved, ...current]);
    return saved;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            signedIn ? <Navigate to="/" replace /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/*"
          element={
            signedIn ? (
              <Shell
                rooms={rooms}
                loading={loading}
                apiError={apiError}
                onLogout={logout}
                onAdd={addRoom}
                notice={notice}
                setNotice={setNotice}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    if (username.trim() === "pms_admin" && password === "hotelpms2026") {
      setError("");
      onLogin();
    } else setError("That username or password is incorrect.");
  }
  return (
    <main className="login-page">
      <div className="login-card">
        <Brand />
        <div className="login-heading">
          <h1>Welcome back</h1>
          <p>Sign in to manage your rooms.</p>
        </div>
        <form onSubmit={submit}>
          <label>
            Username
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>
          {error && (
            <div className="inline-error" role="alert">
              {error}
            </div>
          )}
          <button className="button primary full">
            Sign in <span>→</span>
          </button>
        </form>
        <p className="login-hint">
          Demo: <strong>pms_admin</strong> · <strong>hotelpms2026</strong>
        </p>
      </div>
      <span className="login-foot">A little more room to breathe.</span>
    </main>
  );
}

function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-icon">
        <BedDouble size={19} />
      </span>
      <span>
        staywise<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
function Shell({
  rooms,
  loading,
  apiError,
  onLogout,
  onAdd,
  notice,
  setNotice,
}) {
  const loc = useLocation(),
    nav = useNavigate(),
    [mobileOpen, setMobileOpen] = useState(false);
  const isAdd = loc.pathname === "/rooms/new",
    isDetail = loc.pathname.startsWith("/rooms/") && !isAdd;
  const title = isAdd ? "Add a room" : isDetail ? "Room details" : "Rooms";
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <Brand />
        <div className="side-label">WORKSPACE</div>
        <Link
          onClick={() => setMobileOpen(false)}
          className={`nav-link ${loc.pathname === "/" ? "active" : ""}`}
          to="/"
        >
          <LayoutDashboard size={18} /> <span>Room list</span>
        </Link>
        <div className="side-bottom">
          <div className="help-card">
            <span className="help-icon">
              <CircleHelp size={17} />
            </span>
            <div>
              <strong>Need a hand?</strong>
              <p>Your rooms, all in one place.</p>
            </div>
          </div>
          <button className="nav-link logout" onClick={onLogout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
          <div className="user-row">
            <div className="avatar">A</div>
            <div className="user-info">
              <strong>Administrator</strong>
              <small>Hotel manager</small>
            </div>
            <Settings size={17} className="user-settings" />
          </div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <div className="crumb">
            Workspace <span>/</span> <strong>{title}</strong>
          </div>
          <div className="top-right">
            <span className="live-dot" /> All changes saved
            <div className="avatar top-avatar">A</div>
          </div>
        </header>
        <section className="content">
          <Routes>
            <Route
              path="/"
              element={
                <RoomList
                  rooms={rooms}
                  loading={loading}
                  apiError={apiError}
                  notice={notice}
                  setNotice={setNotice}
                />
              }
            />
            <Route
              path="/rooms/new"
              element={
                <AddRoom
                  onAdd={async (room) => {
                    const saved = await onAdd(room);
                    setNotice(`Room ${saved.number} was added.`);
                    nav(`/rooms/${saved.id}`);
                  }}
                />
              }
            />
            <Route path="/rooms/:id" element={<RoomDetails rooms={rooms} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
        <footer>
          © 2026 Staywise <span>·</span> Room management made simple
        </footer>
      </main>
    </div>
  );
}

function RoomList({ rooms, loading, apiError, notice, setNotice }) {
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All rooms");
  const shown = rooms.filter(
    (r) =>
      `${r.number} ${r.type}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All rooms" || r.status === filter),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR PROPERTY</div>
          <h1>Room list</h1>
          <p>Keep track of every room in your hotel.</p>
        </div>
        <Link className="button primary" to="/rooms/new">
          <Plus size={17} /> Add a room
        </Link>
      </div>
      {notice && (
        <div className="notice">
          <Check size={16} />
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}
      {apiError && (
        <div className="inline-error api-error" role="alert">
          {apiError}
        </div>
      )}
      <div className="stats">
        <Stat label="Total rooms" value={rooms.length} tone="blue" />
        <Stat
          label="Available"
          value={rooms.filter((r) => r.status === "Available").length}
          tone="green"
        />
        <Stat
          label="Occupied"
          value={rooms.filter((r) => r.status === "Occupied").length}
          tone="amber"
        />
        <Stat
          label="Cleaning"
          value={rooms.filter((r) => r.status === "Cleaning").length}
          tone="purple"
        />
      </div>
      <div className="list-panel">
        <div className="panel-head">
          <div>
            <h2>
              All rooms <span className="count">{rooms.length}</span>
            </h2>
            <p>A quick overview of your room inventory.</p>
          </div>
          <div className="list-tools">
            <label className="search-box">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rooms..."
              />
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option>All rooms</option>
              <option>Available</option>
              <option>Occupied</option>
              <option>Cleaning</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ROOM</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
                <th>NIGHTLY RATE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link className="room-number" to={`/rooms/${r.id}`}>
                      <span className="room-symbol">
                        <BedDouble size={17} />
                      </span>
                      Room {r.number}
                    </Link>
                  </td>
                  <td>{r.type}</td>
                  <td>
                    <span className={`status status-${r.status.toLowerCase()}`}>
                      <i />
                      {r.status}
                    </span>
                  </td>
                  <td className="rate">
                    ${Number(r.rate).toFixed(2)} <small>/ night</small>
                  </td>
                  <td>
                    <Link className="view-link" to={`/rooms/${r.id}`}>
                      View <span>→</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <div className="empty">Loading rooms...</div>
          ) : (
            shown.length === 0 && (
              <div className="empty">
                No rooms found. Try a different search.
              </div>
            )
          )}
        </div>
        <div className="panel-foot">
          Showing{" "}
          <strong>
            {shown.length ? 1 : 0}–{shown.length}
          </strong>{" "}
          of <strong>{shown.length}</strong> rooms
        </div>
      </div>
    </>
  );
}
function Stat({ label, value, tone }) {
  return (
    <div className="stat">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <span className={`stat-icon ${tone}`}>
        <BedDouble size={19} />
      </span>
    </div>
  );
}

function AddRoom({ onAdd }) {
  const [form, setForm] = useState({ number: "", type: "", rate: "" }),
    [errors, setErrors] = useState({});
  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.number.trim()) next.number = "Enter a room number.";
    if (!form.type) next.type = "Choose a room category.";
    if (!form.rate || Number(form.rate) <= 0)
      next.rate = "Enter a rate greater than zero.";
    setErrors(next);
    if (!Object.keys(next).length)
      try {
        await onAdd({
          ...form,
          number: form.number.trim(),
          rate: Number(form.rate),
          floor: "Not specified",
          description: "A comfortable room ready for your guests.",
        });
      } catch (error) {
        setErrors({ server: error.message });
      }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ROOM INVENTORY</div>
          <h1>Add a room</h1>
          <p>Add a room to your property in a few steps.</p>
        </div>
        <Link className="button secondary" to="/">
          <ArrowLeft size={16} /> Back to rooms
        </Link>
      </div>
      <div className="form-panel">
        <div className="form-title">
          <span className="form-icon">
            <Plus size={19} />
          </span>
          <div>
            <h2>Room information</h2>
            <p>Fill in the basic details for this room.</p>
          </div>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <label>
              Room number <em>*</em>
              <input
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="e.g. 104"
                aria-invalid={!!errors.number}
              />
              {errors.number && (
                <small className="field-error">{errors.number}</small>
              )}
            </label>
            <label>
              Room category <em>*</em>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                aria-invalid={!!errors.type}
              >
                <option value="">Select a category</option>
                <option>Standard Single</option>
                <option>Deluxe Double</option>
                <option>Executive Suite</option>
                <option>Penthouse</option>
              </select>
              {errors.type && (
                <small className="field-error">{errors.type}</small>
              )}
            </label>
            <label>
              Nightly rate <em>*</em>
              <div className="money-input">
                <span>$</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: e.target.value })}
                  placeholder="0.00"
                  aria-invalid={!!errors.rate}
                />
              </div>
              {errors.rate && (
                <small className="field-error">{errors.rate}</small>
              )}
            </label>
          </div>
          {errors.server && (
            <div className="inline-error api-error" role="alert">
              {errors.server}
            </div>
          )}
          <div className="form-bottom">
            <span>
              <em>*</em> Required fields
            </span>
            <button className="button primary" type="submit">
              Save room <span>→</span>
            </button>
          </div>
        </form>
      </div>
      <div className="tip">
        <CircleHelp size={17} />
        <span>
          <strong>Tip</strong> You can update room information at any time from
          the room details page.
        </span>
      </div>
    </>
  );
}

function RoomDetails({ rooms }) {
  const { id } = useParams(),
    room = rooms.find((r) => String(r.id) === id);
  if (!room)
    return (
      <div className="not-found">
        <h1>Room not found</h1>
        <p>This room may have been removed.</p>
        <Link className="button secondary" to="/">
          Back to rooms
        </Link>
      </div>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ROOM INVENTORY / ROOM {room.number}</div>
          <h1>Room {room.number}</h1>
          <p>Room information and current status.</p>
        </div>
        <Link className="button secondary" to="/">
          <ArrowLeft size={16} /> Back to rooms
        </Link>
      </div>
      <div className="detail-panel">
        <div className="detail-banner">
          <span className="detail-bed">
            <BedDouble size={30} />
          </span>
          <div>
            <span className="eyebrow">ROOM NUMBER</span>
            <h2>{room.number}</h2>
          </div>
          <span className={`status status-${room.status.toLowerCase()}`}>
            <i />
            {room.status}
          </span>
        </div>
        <div className="detail-grid">
          <Detail label="Room category" value={room.type} />
          <Detail
            label="Nightly rate"
            value={`$${Number(room.rate).toFixed(2)} / night`}
          />
          <Detail label="Floor" value={room.floor || "Not specified"} />
          <Detail label="Room ID" value={`#${room.id}`} />
        </div>
        <div className="detail-description">
          <span>DESCRIPTION</span>
          <p>{room.description || "No description has been added."}</p>
        </div>
      </div>
      <div className="tip">
        <CircleHelp size={17} />
        <span>Room details are saved with your room inventory.</span>
      </div>
    </>
  );
}
function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
