import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        /* RESET */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f8f9ff, #eef1ff);
          color: #1f2937;
        }

        /* NAVBAR */
        .nav {
          width: 100%;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-size: 22px;
          font-weight: 700;
          color: #4f46e5;
        }

        .nav-btn {
          background: transparent;
          border: 1.5px solid #4f46e5;
          padding: 8px 18px;
          border-radius: 6px;
          color: #4f46e5;
          font-weight: 600;
          cursor: pointer;
        }

        .nav-btn:hover {
          background: #4f46e5;
          color: #fff;
        }

        /* HERO */
        .hero {
          max-width: 1200px;
          margin: auto;
          padding: 70px 20px;
          display: flex;
          flex-direction: column;
          gap: 50px;
          align-items: center;
          text-align: center;
        }

        .hero-text h1 {
          font-size: 36px;
          line-height: 1.2;
        }

        .hero-text span {
          color: #4f46e5;
        }

        .hero-text p {
          margin-top: 18px;
          font-size: 16px;
          color: #4b5563;
          max-width: 520px;
        }

        .cta {
          margin-top: 30px;
          padding: 14px 34px;
          font-size: 16px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }

        .cta:hover {
          background: #4338ca;
        }

        /* CARD */
        .card {
          width: 100%;
          max-width: 360px;
          background: #ffffff;
          border-radius: 18px;
          padding: 26px;
          box-shadow: 0 15px 40px rgba(79,70,229,0.15);
        }

        .card h3 {
          font-size: 18px;
          margin-bottom: 14px;
        }

        .card ul {
          list-style: none;
          font-size: 14px;
          color: #374151;
        }

        .card li {
          margin-bottom: 10px;
        }

        /* FEATURES */
        .features {
          max-width: 1100px;
          margin: 0 auto 80px;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .feature-box {
          background: #ffffff;
          padding: 24px;
          border-radius: 14px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
        }

        .feature-box h4 {
          margin-bottom: 8px;
          color: #4f46e5;
        }

        .feature-box p {
          font-size: 14px;
          color: #4b5563;
        }

        /* RESPONSIVE */
        @media (min-width: 768px) {
          .hero {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }

          .hero-text h1 {
            font-size: 44px;
          }

          .features {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .hero-text h1 {
            font-size: 52px;
          }
        }
      `}</style>

      {/* NAV */}
      <div className="nav">
        <div className="logo">MedVault</div>
        <button className="nav-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Understand your <span>doctor’s prescription</span> without confusion
          </h1>
          <p>
            Upload any handwritten medical prescription and instantly get clear
            medicine names, dosage, and instructions.
          </p>
          <button className="cta" onClick={() => navigate("/signup")}>
            Scan Prescription
          </button>
        </div>

        <div className="card">
          <h3>What MedVault extracts</h3>
          <ul>
            <li>✔ Medicine names</li>
            <li>✔ Dosage (1-0-1 format)</li>
            <li>✔ Duration & instructions</li>
            <li>✔ Securely saved history</li>
          </ul>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-box">
          <h4>📸 Scan Prescription</h4>
          <p>
            Just upload a photo of doctor’s handwritten prescription.
          </p>
        </div>

        <div className="feature-box">
          <h4>🧠 Smart Extraction</h4>
          <p>
            Automatically reads medicine names, dosage and duration.
          </p>
        </div>

        <div className="feature-box">
          <h4>🔒 Private & Secure</h4>
          <p>
            Your medical data is encrypted and accessible only to you.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
