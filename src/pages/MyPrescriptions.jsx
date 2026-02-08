import { useEffect, useState } from "react";
import { supabase } from "../superbaseClient";
import { useNavigate } from "react-router-dom";




function MyPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();



    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await supabase
                .from("prescriptions")
                .select(`
  id,
  image_url,
  created_at,
  medicines:medicines_prescription_id_fkey (
    id,
    name,
    dosage,
    duration
  )
`)

                //         .select(`
                //   id,
                //   image_url,
                //   created_at,
                //   medicines (
                //     id,
                //     name,
                //     dosage,
                //     duration
                //   )
                // `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            setPrescriptions(data || []);
        } catch (err) {
            console.error("SUPABASE ERROR:", err);
            alert(err.message || JSON.stringify(err));
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        body {
          background:#f4f6ff;
          font-family: Segoe UI, sans-serif;
        }

        .container {
          max-width:1100px;
          margin:auto;
          padding:50px;
        }

        h1 {
          color:#4f46e5;
          margin-bottom:16px;
        }

        .grid {
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap:20px;
        }

        .card {
          background:#fff;
          border-radius:14px;
          padding:14px;
          box-shadow:0 8px 20px rgba(0,0,0,0.08);
        }

        .card img {
          width:100%;
          height:180px;
          object-fit:cover;
          border-radius:10px;
        }

        .date {
          font-size:13px;
          color:#666;
          margin-top:8px;
        }

        .count {
          margin-top:6px;
          font-size:14px;
          color:#3730a3;
        }

        .med {
          font-size:13px;
          margin-top:4px;
          color:#333;
        }

        .empty {
          text-align:center;
          margin-top:80px;
          color:#555;
        }
      `}</style>

            <div className="container">
                <h1>My Prescriptions</h1>

                {loading && <p>Loading...</p>}

                {!loading && prescriptions.length === 0 && (
                    <div className="empty">
                        <p>No prescriptions saved yet</p>
                    </div>
                )}

                <div className="grid">
                    {prescriptions.map((p) => {
                        const meds = p.medicines || []; // 🔥 NULL SAFE

                        return (
                            <div className="card" key= {p.id}>
                                {p.image_url ? (
                                    <img src={p.image_url} alt="Prescription" />
                                ) : (
                                    <div
                                        style={{
                                            height: "180px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#eef2ff",
                                            borderRadius: "10px",
                                            color: "#555",
                                            fontSize: "14px",
                                        }}
                                    >
                                        No image available
                                    </div>
                                )}


                                <div className="date">
                                    {new Date(p.created_at).toDateString()}
                                </div>

                                <div className="count">
                                    💊 {meds.length} medicines
                                </div>

                                {/* 👇 SINGLE BUTTON */}
                                <button
                                    onClick={() => navigate(`/prescriptions/${p.id}`)}
                                >
                                    👁 View Details
                                </button>




                                {meds.slice(0, 3).map((m) => (
                                    <div className="med" key={m.id}>
                                        • {m.name}
                                    </div>
                                ))}

                                {meds.length > 3 && (
                                    <div className="med">+ more…</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default MyPrescriptions;
