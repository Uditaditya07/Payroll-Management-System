import { useState } from "react";

export default function Login({
  onLogin,
  loading,
  error,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      return;
    }

    await onLogin(email, password);
  };

  return (
    <div className="login-page">

      <div className="login-background">
        <div className="orb orb-one"></div>
        <div className="orb orb-two"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="login-container">

        <div className="login-brand">
          <div className="logo">
            P
          </div>

          <div>
            <div className="brand-name">
              PayFlow
            </div>

            <div className="brand-subtitle">
              Payroll Management
            </div>
          </div>
        </div>

        <div className="login-card">

          <div className="login-header">

            <div className="welcome-badge">
              ✦ Welcome back
            </div>

            <h1>
              Manage payroll.
              <br />
              <span>Without the chaos.</span>
            </h1>

            <p>
              Sign in to your payroll workspace
              and keep your entire organization
              on track.
            </p>

          </div>

          {error && (
            <div className="login-error">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Work email
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <div className="label-row">

                <label>
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-button"
                >
                  Forgot password?
                </button>

              </div>

              <div className="input-wrapper">

                <span className="input-icon">
                  ●
                </span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          <div className="login-footer">

            <span className="security-icon">
              ✓
            </span>

            <span>
              Your connection is secure
            </span>

          </div>

        </div>

        <div className="login-bottom">
          © 2026 PayFlow · Payroll made simple
        </div>

      </div>

    </div>
  );
}