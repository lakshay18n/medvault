import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Home", icon: "🗂️", path: "/dashboard" },
    { label: "Scan", icon: "🔎", path: "/scan" },
    { label: "Prescriptions", icon: "💊", path: "/prescriptions" },
    { label: "Profile", icon: "👤", path: "/profile" },
  ];

  return (
    <div style={styles.wrapper}>
      {tabs.map((tab) => {
        const active = location.pathname.startsWith(tab.path);

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              ...styles.btn,
              color: active ? "#4f46e5" : "#555",
            }}
          >
            <div style={{ fontSize: 20 }}>{tab.icon}</div>
            <div style={{ fontSize: 12 }}>{tab.label}</div>
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    background: "#fff",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid #ddd",
    zIndex: 1000,
  },
  btn: {
    background: "none",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },


};
