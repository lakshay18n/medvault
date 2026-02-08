import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../superbaseClient";
import { useState } from "react";


function Dashboard() {
    const navigate = useNavigate();
    const [prescriptionCount, setPrescriptionCount] = useState(0);
    const [medicineCount, setMedicineCount] = useState(0);

    const badgeStyle = {
        position: "absolute",
        top: 0,
        right: 0,
        color: "red",
        fontSize: "20px",
    };



    // 🔐 Auth Guard
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                navigate("/login");
            }
        });

    }, [navigate]);

    useEffect(() => {
        const fetchStats = async () => {
            const { count: pCount } = await supabase
                .from("prescriptions")
                .select("*", { count: "exact", head: true });

            const { count: mCount } = await supabase
                .from("medicines")
                .select("*", { count: "exact", head: true });

            setPrescriptionCount(pCount || 0);
            setMedicineCount(mCount || 0);
        };

        fetchStats();
    }, []);


    return (
        <>
            <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: "Segoe UI", sans-serif;
          background: #f4f6ff;
        }


        /* MAIN */
        .container {
          max-width: 1100px;
          margin: auto;
          padding: 50px 16px;
        }

        h1 {
          color: #4f46e5;
          margin-bottom: 6px;
        }

        .subtitle {
          color: #555;
          font-size: 14px;
          margin-bottom: 30px;
        }

        /* STATS */
        .stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .stat-box {
          flex: 1;
          min-width: 140px;
          background: #ffffff;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .stat-box h2 {
          margin: 0;
          color: #4f46e5;
        }

        .stat-box span {
          font-size: 13px;
          color: #555;
        }

        /* CARDS */
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .card h3 {
          margin-bottom: 10px;
        }

        .card p {
          font-size: 14px;
          color: #555;
          margin-bottom: 16px;
        }

        .btn {
          padding: 12px 20px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
        }

        .btn:hover {
          background: #4338ca;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
          
      `}</style>

            {/* DASHBOARD */}
            <div className="container">
                <h1>Dashboard</h1>
                <p className="subtitle">
                    Manage your prescriptions and medicines
                </p>

                {/* STATS */}
                <div className="stats">
                    <div className="stat-box">
                        <h2>{prescriptionCount}</h2>
                        <span>Total Prescriptions</span>
                    </div>
                    <div className="stat-box">
                        <h2>{medicineCount}</h2>
                        <span>Total Medicines</span>

                    </div>
                </div>

                {/* ACTION CARDS */}
                <div className="grid">
                    <div className="card">
                        <h3>📸 Scan New Prescription</h3>
                        <p>
                            Upload a photo of doctor’s handwritten prescription and extract
                            medicine details instantly.
                        </p>
                        <button className="btn" onClick={() => navigate("/scan")}>
                            Scan Now
                        </button>
                    </div>

                    <div className="card">
                        <h3>📁 My Prescriptions</h3>
                        <p>
                            View previously scanned prescriptions and their extracted
                            medicines.
                        </p>
                        <button
                            className="btn"
                            onClick={() => navigate("/prescriptions")}
                        >
                            View Records
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
