import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../superbaseClient";


function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Account created successfully! Please login.");
            navigate("/login");
        }
    };

    return (
        <>
            <style>{`
        body {
          font-family: "Segoe UI", sans-serif;
          background: linear-gradient(135deg, #eef2ff, #f8f9ff);
        }

        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .card {
          background: #fff;
          width: 100%;
          max-width: 380px;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }

        h2 {
          text-align: center;
          color: #4f46e5;
          margin-bottom: 8px;
        }

        p {
          text-align: center;
          font-size: 14px;
          color: #555;
          margin-bottom: 25px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 14px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        input:focus {
          outline: none;
          border-color: #4f46e5;
        }

        button {
          width: 100%;
          padding: 12px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
        }

        button:hover {
          background: #4338ca;
        }

        .link {
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
        }

        .link span {
          color: #4f46e5;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>

            <div className="container">
                <form className="card" onSubmit={handleSignup}>
                    <h2>Create Account</h2>
                    <p>Start scanning prescriptions</p>

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Sign Up</button>

                    <div className="link">
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")}>Login</span>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Signup;
