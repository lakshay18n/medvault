import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../superbaseClient";


function TopNav() {
    const navigate = useNavigate();
    const [reminderCount, setReminderCount] = useState(0);

    useEffect(() => {
        fetchReminderCount();

        const refresh = () => fetchReminderCount();

        window.addEventListener("reminder-updated", refresh);

        return () => {
            window.removeEventListener("reminder-updated", refresh);
        };
    }, []);


    const fetchReminderCount = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { count } = await supabase
            .from("reminders")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

        setReminderCount(count || 0);
    };


    return (
        <div style={styles.wrapper}>
            {/* LEFT: APP NAME */}
            <div style={styles.logo} onClick={() => navigate("/dashboard")}>
                MedVault
            </div>

            {/* RIGHT: REMINDER ICON */}
            <button
                onClick={() => navigate("/reminders")}
                style={styles.reminderBtn}
            >
                🔔
                {reminderCount > 0 && (
                    <span style={styles.badge}>{reminderCount}</span>
                )}
            </button>

        </div>
    );
}

export default TopNav;

/* ---------------- STYLES ---------------- */

const styles = {
    wrapper: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #ddd",
        zIndex: 1000,
    },

    logo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4f46e5",
        cursor: "pointer",
    },

    reminderBtn: {
        background: "none",
        border: "none",
        fontSize: 22,
        cursor: "pointer",
        position: "relative",
    },

    badge: {
        position: "absolute",
        top: -4,
        right: -6,
        background: "red",
        color: "#fff",
        borderRadius: "50%",
        padding: "2px 6px",
        fontSize: 10,
        fontWeight: "bold",
    },

};
