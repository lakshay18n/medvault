import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../superbaseClient";

function PrescriptionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [prescription, setPrescription] = useState(null);
    const [medicines, setMedicines] = useState([]);

    const [showReminder, setShowReminder] = useState(false);
    const [activeMedicine, setActiveMedicine] = useState(null);

    const [reminder, setReminder] = useState({
        times: {
            morning: false,
            afternoon: false,
            night: false,
        },
        food: "after", // before | after
        durationType: "days", // days | everyday
        days: 5,
    });

    /* ---------------- FETCH DETAILS ---------------- */
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);

                const { data: pData, error: pError } = await supabase
                    .from("prescriptions")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (pError) throw pError;

                const { data: mData, error: mError } = await supabase
                    .from("medicines")
                    .select("*")
                    .eq("prescription_id", id);

                if (mError) throw mError;

                setPrescription(pData);
                setMedicines(mData || []);
            } catch (err) {
                console.error(err);
                alert("Failed to load prescription");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, []);



    /* ---------------- DELETE PRESCRIPTION ---------------- */
    const handleDeletePrescription = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this prescription?"
        );
        if (!confirmDelete) return;

        try {
            await supabase.from("medicines").delete().eq("prescription_id", id);
            await supabase.from("prescriptions").delete().eq("id", id);

            alert("Prescription deleted");
            navigate("/prescriptions");
        } catch (err) {
            console.error(err);
            alert("Failed to delete prescription");
        }
    };

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <div style={{ maxWidth: 900, margin: "auto", padding: 50 }}>
            <h2>📄 Prescription Details</h2>

            {prescription?.image_url && (
                <img
                    src={prescription.image_url}
                    alt="Prescription"
                    style={{ width: "100%", maxWidth: 400, borderRadius: 12 }}
                />
            )}

            <p>
                <strong>Date:</strong>{" "}
                {new Date(prescription.created_at).toDateString()}
            </p>

            <h3>💊 Medicines</h3>

            {medicines.length === 0 && <p>No medicines found</p>}

            {medicines.map((med) => (
                <div
                    key={med.id}
                    style={{
                        background: "#eef2ff",
                        padding: 12,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                >
                    <strong>{med.name}</strong>
                    <div>Dosage: {med.dosage || "-"}</div>
                    <div>Duration: {med.duration || "-"}</div>

                    <button
                        onClick={() => {
                            setActiveMedicine(med);
                            setShowReminder(true);
                        }}
                        style={{
                            background: "#e0e7ff",
                            color: "#3730a3",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            marginTop: "6px",
                        }}
                    >
                        ⏰ Set Reminder
                    </button>
                </div>
            ))}

            <button
                onClick={handleDeletePrescription}
                style={{
                    marginTop: 20,
                    background: "#fee2e2",
                    color: "#991b1b",
                    border: "none",
                    padding: "12px 16px",
                    borderRadius: 10,
                    cursor: "pointer",
                }}
            >
                ❌ Delete Prescription
            </button>

            {/* ---------------- REMINDER MODAL ---------------- */}
            {showReminder && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "50px ",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "#fff",
                        borderRadius: "16px",
                        padding: "24px",
                        width: "100%",
                        maxWidth: "480px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                    }}>
                        <h3 style={{
                            margin: "0 0 20px 0",
                            fontSize: "20px",
                            color: "#333",
                            borderBottom: "2px solid #f0f0f0",
                            paddingBottom: "12px"
                        }}>⏰ Reminder for: {activeMedicine?.name}</h3>

                        <p style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#555",
                            marginBottom: "10px"
                        }}><strong>Time of day</strong></p>
                        {["morning", "afternoon", "night"].map((t) => (
                            <label key={t} style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "12px",
                                marginBottom: "8px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                cursor: "pointer",
                                backgroundColor: "#fafafa"
                            }}>
                                <input
                                    type="checkbox"
                                    checked={reminder.times[t]}
                                    onChange={(e) =>
                                        setReminder({
                                            ...reminder,
                                            times: { ...reminder.times, [t]: e.target.checked },
                                        })
                                    }
                                    style={{
                                        width: "18px",
                                        height: "18px",
                                        marginRight: "10px",
                                        cursor: "pointer"
                                    }}
                                />
                                <span style={{ textTransform: "capitalize", fontSize: "15px" }}>{t}</span>
                            </label>
                        ))}

                        <p style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#555",
                            marginTop: "16px",
                            marginBottom: "10px"
                        }}><strong>Food</strong></p>
                        <select
                            value={reminder.food}
                            onChange={(e) =>
                                setReminder({ ...reminder, food: e.target.value })
                            }
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d0d0d0",
                                borderRadius: "8px",
                                fontSize: "15px",
                                cursor: "pointer",
                                backgroundColor: "#fff"
                            }}
                        >
                            <option value="before">Before food</option>
                            <option value="after">After food</option>
                        </select>

                        <p style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#555",
                            marginTop: "16px",
                            marginBottom: "10px"
                        }}><strong>Duration</strong></p>
                        <select
                            value={reminder.durationType}
                            onChange={(e) =>
                                setReminder({ ...reminder, durationType: e.target.value })
                            }
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d0d0d0",
                                borderRadius: "8px",
                                fontSize: "15px",
                                cursor: "pointer",
                                backgroundColor: "#fff"
                            }}
                        >
                            <option value="days">For X days</option>
                            <option value="everyday">Everyday</option>
                        </select>

                        {reminder.durationType === "days" && (
                            <input
                                type="number"
                                min="1"
                                value={reminder.days}
                                onChange={(e) =>
                                    setReminder({ ...reminder, days: e.target.value })
                                }
                                placeholder="Enter number of days"
                                style={{
                                    marginTop: "12px",
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #d0d0d0",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    boxSizing: "border-box"
                                }}
                            />
                        )}

                        <div style={{
                            marginTop: "24px",
                            display: "flex",
                            gap: "12px",
                            paddingTop: "16px",
                            borderTop: "1px solid #f0f0f0"
                        }}>
                            <button
                                onClick={() => setShowReminder(false)}
                                style={{
                                    flex: 1,
                                    padding: "12px 20px",
                                    border: "1px solid #d0d0d0",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    cursor: "pointer",
                                    backgroundColor: "#fff",
                                    color: "#666",
                                    fontWeight: "500"
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        const {
                                            data: { user },
                                        } = await supabase.auth.getUser();

                                        if (!user || !activeMedicine) {
                                            alert("Missing user or medicine");
                                            return;
                                        }

                                        const { error } = await supabase.from("reminders").insert({
                                            user_id: user.id,
                                            prescription_id: prescription.id,
                                            medicine_id: activeMedicine.id,
                                            times: reminder.times,
                                            food: reminder.food,
                                            duration_type: reminder.durationType,
                                            days: reminder.durationType === "days" ? reminder.days : null,
                                        });

                                        if (error) throw error;

                                        alert("✅ Reminder saved successfully");
                                        setShowReminder(false);
                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to save reminder");
                                    }
                                }}

                                style={{
                                    flex: 1,
                                    padding: "12px 20px",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    cursor: "pointer",
                                    backgroundColor: "#1976D2",
                                    color: "#fff",
                                    fontWeight: "600"
                                }}
                            >
                                Save Reminder
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* {showReminder && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>⏰ Reminder for: {activeMedicine?.name}</h3>

            <p><strong>Time of day</strong></p>
            {["morning", "afternoon", "night"].map((t) => (
              <label key={t} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={reminder.times[t]}
                  onChange={(e) =>
                    setReminder({
                      ...reminder,
                      times: { ...reminder.times, [t]: e.target.checked },
                    })
                  }
                />{" "}
                {t}
              </label>
            ))}

            <p><strong>Food</strong></p>
            <select
              value={reminder.food}
              onChange={(e) =>
                setReminder({ ...reminder, food: e.target.value })
              }
            >
              <option value="before">Before food</option>
              <option value="after">After food</option>
            </select>

            <p><strong>Duration</strong></p>
            <select
              value={reminder.durationType}
              onChange={(e) =>
                setReminder({ ...reminder, durationType: e.target.value })
              }
            >
              <option value="days">For X days</option>
              <option value="everyday">Everyday</option>
            </select>

            {reminder.durationType === "days" && (
              <input
                type="number"
                min="1"
                value={reminder.days}
                onChange={(e) =>
                  setReminder({ ...reminder, days: e.target.value })
                }
                style={{ marginTop: 8, width: "100%" }}
              />
            )}

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  console.log("REMINDER:", {
                    medicine: activeMedicine,
                    reminder,
                  });
                  setShowReminder(false);
                }}
                style={primaryBtn}
              >
                Save Reminder
              </button>

              <button
                onClick={() => setShowReminder(false)}
                style={secondaryBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
        </div>
    );
}

export default PrescriptionDetails; 