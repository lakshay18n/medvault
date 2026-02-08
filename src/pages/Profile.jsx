import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../superbaseClient";

function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  /* ---------------- GET LOGGED IN USER ---------------- */
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setEmail(user.email);
    };
    fetchUser();
  }, [navigate]);



  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await supabase.auth.signOut();

    // 🔥 logout ke baad HOME page
    navigate("/");
  };

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

        .container {
          max-width: 600px;
          margin: auto;
          padding: 70px 16px 90px;
        }

        h1 {
          text-align: center;
          color: #4f46e5;
          margin-bottom: 6px;
        }

        .subtitle {
          text-align: center;
          font-size: 14px;
          color: #555;
          margin-bottom: 30px;
        }

        .card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .field {
          margin-bottom: 18px;
        }

        label {
          display: block;
          font-size: 13px;
          margin-bottom: 6px;
          color: #555;
        }

        input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          background: #f9fafb;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          cursor: pointer;
          margin-top: 10px;
        }

        .btn-primary {
          background: #4f46e5;
          color: #fff;
        }

        .btn-primary:hover {
          background: #4338ca;
        }

        .btn-logout {
          background: #ef4444;
          color: #fff;
        }

        .btn-logout:hover {
          background: #dc2626;
        }
      `}</style>

      <div className="container">
        <h1>Profile</h1>
        <p className="subtitle">Manage your account</p>

        <div className="card">
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} disabled />
          </div>

          <div className="field">
            <label>Change Password</label>
            <input type="password" placeholder="New password (coming soon)" disabled />
          </div>

          <button className="btn btn-primary" disabled>
            Update Password
          </button>

          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
