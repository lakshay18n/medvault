import { useEffect, useState } from "react";
import { supabase } from "../superbaseClient";

function Reminders() {
    const [loading, setLoading] = useState(true);
    const [reminders, setReminders] = useState([]);
    const handleDeleteReminder = async (id) => {
        const confirmDelete = window.confirm("Delete this reminder?");
        if (!confirmDelete) return;

        try {
            const { error } = await supabase
                .from("reminders")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setReminders((prev) => prev.filter((r) => r.id !== id));

            // 🔥 notify navbar
            window.dispatchEvent(new Event("reminder-updated"));

        } catch (err) {
            console.error(err);
            alert("Failed to delete reminder");
        }
    };



    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            setLoading(true);

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await supabase
                .from("reminders")
                .select(`
          id,
          times,
          food,
          duration_type,
          days,
          created_at,
          medicines ( name )
        `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            setReminders(data || []);
        } catch (err) {
            console.error(err);
            alert("Failed to load reminders");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <div style={{ maxWidth: 800, margin: "auto", padding: 50 }}>
            <h2>⏰ Active Reminders</h2>

            {reminders.length === 0 && <p>No active reminders</p>}

            {reminders.map((r) => (
                <div
                    key={r.id}
                    style={{
                        background: "#f8fafc",
                        padding: 14,
                        borderRadius: 10,
                        marginBottom: 12,
                    }}
                >
                    <strong>💊 {r.medicines?.name}</strong>

                    <div>
                        ⏱ Times:{" "}
                        {Object.keys(r.times)
                            .filter((t) => r.times[t])
                            .join(", ")}
                    </div>

                    <div>🍽 {r.food} food</div>

                    <div>
                        📅{" "}
                        {r.duration_type === "days"
                            ? `For ${r.days} days`
                            : "Everyday"}
                    </div>

                    <button
                        onClick={() => handleDeleteReminder(r.id)}
                        style={{
                            marginTop: 8,
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 12,
                        }}
                    >
                        ❌ Delete Reminder
                    </button>

                </div>

            ))}
        </div>
    );
}

export default Reminders;
