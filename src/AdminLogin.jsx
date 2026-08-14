import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==================================================
  // CHECK PASSWORD RECOVERY
  // ==================================================

  useEffect(() => {
    const checkRecovery = async () => {
      const hash = window.location.hash;

      if (
        hash.includes("type=recovery") ||
        hash.includes("access_token=")
      ) {
        setMode("reset");
      }
    };

    checkRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setError("");
        setMessage("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ==================================================
  // NORMAL LOGIN
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (data?.user) {
        onLogin(data.user);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // SEND PASSWORD RESET EMAIL
  // ==================================================

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your admin email first.");
      return;
    }

    setLoading(true);

    try {
      const redirectUrl =
        `${window.location.origin}/admin`;

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: redirectUrl,
          }
        );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMessage(
        "Password reset link has been sent to your email."
      );
    } catch (err) {
      console.error(err);
      setError("Unable to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // UPDATE NEW PASSWORD
  // ==================================================

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      if (data?.user) {
        setMessage(
          "Password updated successfully. You can now login."
        );

        setNewPassword("");
        setConfirmPassword("");

        await supabase.auth.signOut();

        window.history.replaceState(
          {},
          document.title,
          "/admin"
        );

        setMode("login");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to update password.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // STYLES
  // ==================================================

  return (
    <>
      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(
              circle at 50% 25%,
              rgba(0,232,137,.10),
              transparent 38%
            ),
            #050505;
          color: #fff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .admin-login-card {
          width: min(430px, 100%);
          padding: 38px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,.09);
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.065),
              rgba(255,255,255,.02)
            );
          box-shadow: 0 30px 90px rgba(0,0,0,.45);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .admin-login-brand {
          text-align: center;
          margin-bottom: 30px;
        }

        .admin-login-brand .badge {
          width: 58px;
          height: 58px;
          margin: 0 auto 15px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #f0d98a, #b8872d);
          color: #080808;
          font-weight: 900;
          border: 2px solid rgba(255,244,185,.65);
          box-shadow: 0 10px 28px rgba(184,135,45,.24);
        }

        .admin-login-brand h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: 1px;
        }

        .admin-login-brand p {
          margin: 8px 0 0;
          color: #777f84;
          font-size: 12px;
          letter-spacing: 2px;
        }

        .admin-login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
        }

        .admin-login-field label {
          color: #c9ced2;
          font-size: 13px;
          font-weight: 600;
        }

        .admin-login-field input {
          width: 100%;
          padding: 14px 15px;
          border-radius: 11px;
          border: 1px solid rgba(255,255,255,.09);
          background: #090b0b;
          color: #fff;
          outline: none;
          font: inherit;
          box-sizing: border-box;
        }

        .admin-login-field input:focus {
          border-color: #00e889;
          box-shadow: 0 0 0 3px rgba(0,232,137,.07);
        }

        .admin-login-button {
          width: 100%;
          margin-top: 8px;
          padding: 14px 18px;
          border: 1px solid #00e889;
          border-radius: 11px;
          background: #00e889;
          color: #050505;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
          transition: .25s ease;
        }

        .admin-login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(0,232,137,.22);
        }

        .admin-login-button:disabled {
          opacity: .65;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .admin-forgot-button {
          width: 100%;
          margin-top: 14px;
          padding: 11px;
          border: none;
          background: transparent;
          color: #00e889;
          cursor: pointer;
          font-size: 13px;
        }

        .admin-forgot-button:hover {
          text-decoration: underline;
        }

        .admin-back-button {
          width: 100%;
          margin-top: 12px;
          padding: 11px;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 10px;
          background: transparent;
          color: #aaa;
          cursor: pointer;
        }

        .admin-login-error {
          margin-top: 14px;
          padding: 11px 12px;
          border-radius: 9px;
          border: 1px solid rgba(255,90,90,.22);
          background: rgba(255,90,90,.06);
          color: #ff7a7a;
          font-size: 12px;
          text-align: center;
        }

        .admin-login-success {
          margin-top: 14px;
          padding: 11px 12px;
          border-radius: 9px;
          border: 1px solid rgba(0,232,137,.22);
          background: rgba(0,232,137,.06);
          color: #00e889;
          font-size: 12px;
          text-align: center;
        }
      `}</style>

      <div className="admin-login-page">

        {/* ==================================================
            RESET PASSWORD
        ================================================== */}

        {mode === "reset" ? (

          <form
            className="admin-login-card"
            onSubmit={handlePasswordUpdate}
          >

            <div className="admin-login-brand">

              <div className="badge">
                1K
              </div>

              <h1>
                Royal Trader
              </h1>

              <p>
                SET NEW PASSWORD
              </p>

            </div>

            <div className="admin-login-field">

              <label htmlFor="new-password">
                New Password
              </label>

              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />

            </div>

            <div className="admin-login-field">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
              />

            </div>

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            {message && (
              <div className="admin-login-success">
                {message}
              </div>
            )}

          </form>

        ) : (

          /* ==================================================
             LOGIN
          ================================================== */

          <form
            className="admin-login-card"
            onSubmit={handleSubmit}
          >

            <div className="admin-login-brand">

              <div className="badge">
                1K
              </div>

              <h1>
                Royal Trader
              </h1>

              <p>
                ADMIN LOGIN
              </p>

            </div>

            <div className="admin-login-field">

              <label htmlFor="admin-email">
                Admin Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />

            </div>

            <div className="admin-login-field">

              <label htmlFor="admin-password">
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />

            </div>

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login to Admin"}
            </button>

            <button
              type="button"
              className="admin-forgot-button"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot Password?
            </button>

            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            {message && (
              <div className="admin-login-success">
                {message}
              </div>
            )}

          </form>

        )}

      </div>
    </>
  );
}

export default AdminLogin;