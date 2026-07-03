import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { isRateLimited, recordFailure, clearRateLimit } from "@/lib/authRateLimit";
import Navbar from "@/components/Navbar";
import "@/styles/LoginPage.css";

type View = "login" | "register" | "forgot";

const passwordStrength = (pwd: string) => {
  let s = 0;
  if (pwd.length >= 8)        s++;
  if (pwd.length >= 12)       s++;
  if (/[A-Z]/.test(pwd))     s++;
  if (/[0-9]/.test(pwd))     s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};

const LoginRegister = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const returnUrl = searchParams.get("returnUrl") || "/view-jobs";

  const [view, setView] = useState<View>("login");

  // shared
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [rateStatus, setRateStatus] = useState(isRateLimited());

  // register only
  const [fullName, setFullName]   = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(returnUrl, { replace: true });
    });
    setRateStatus(isRateLimited());
  }, [navigate, returnUrl]);

  const reset = (v: View) => {
    setView(v);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setConfirmPwd("");
    setFullName("");
  };

  // ── LOGIN ──────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = isRateLimited();
    setRateStatus(rate);
    if (rate.locked) {
      setError(`Too many attempts. Try again in ${rate.minutesLeft} min.`);
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (err) {
      recordFailure();
      setRateStatus(isRateLimited());
      setError(
        err.message.includes("Invalid")
          ? "Incorrect email or password."
          : err.message.includes("Email")
          ? "Please verify your email first."
          : "Sign in failed. Try again."
      );
    } else {
      clearRateLimit();
      navigate(returnUrl, { replace: true });
    }
  };

  // ── REGISTER ────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim())        { setError("Enter your full name."); return; }
    if (!email)                  { setError("Enter your email."); return; }
    if (password.length < 8)    { setError("Password must be 8+ characters."); return; }
    if (passwordStrength(password) < 2) { setError("Password too weak. Add numbers or symbols."); return; }
    if (password !== confirmPwd) { setError("Passwords don't match."); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    setLoading(false);
    if (err) {
      setError(
        err.message.includes("already registered")
          ? "Email already registered. Sign in instead."
          : err.message || "Registration failed."
      );
    } else {
      setSuccess("Account created! Check your email to confirm, then sign in.");
      setTimeout(() => reset("login"), 4000);
    }
  };

  // ── FORGOT PASSWORD ─────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Enter your email above first."); return; }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/login-register`,
    });
    setLoading(false);
    setSuccess("Reset link sent! Check your inbox.");
  };

  const strength = passwordStrength(password);
  const strengthColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-blue-500", "bg-green-500"];

  return (
    <>
      <Navbar />
      <div className="login-body">

        {/* ─── LOGIN VIEW ────────────────────────────── */}
        {view === "login" && (
          <div className="login-container">
            <div className="drop">
              <div className="content">
                <h2>Login</h2>

                {error   && <p className="login-error">{error}</p>}
                {success && <p className="login-success">{success}</p>}
                {rateStatus.locked && (
                  <p className="login-error">Locked {rateStatus.minutesLeft} min.</p>
                )}

                <form onSubmit={handleLogin}>
                  <div className="input-box">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={loading || rateStatus.locked}
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      disabled={loading || rateStatus.locked}
                    />
                  </div>
                  <div className={`input-box ${loading ? "loading" : ""}`}>
                    <input
                      type="submit"
                      value={loading ? "..." : "Login"}
                      disabled={loading || rateStatus.locked}
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Orbit buttons */}
            <button className="btn" onClick={() => reset("forgot")}>
              Forgot Password
            </button>
            <button className="btn signup" onClick={() => reset("register")}>
              Signup
            </button>
          </div>
        )}

        {/* ─── FORGOT PASSWORD VIEW ──────────────────── */}
        {view === "forgot" && (
          <div className="login-container">
            <div className="drop">
              <div className="content">
                <h2>Reset</h2>

                {error   && <p className="login-error">{error}</p>}
                {success && <p className="login-success">{success}</p>}

                <form onSubmit={handleForgotPassword}>
                  <div className="input-box">
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                  <div className={`input-box ${loading ? "loading" : ""}`}>
                    <input
                      type="submit"
                      value={loading ? "..." : "Send Link"}
                      disabled={loading}
                    />
                  </div>
                </form>
              </div>
            </div>

            <button className="btn" onClick={() => reset("login")}>
              Back to Login
            </button>
          </div>
        )}

        {/* ─── REGISTER VIEW ─────────────────────────── */}
        {view === "register" && (
          <div className="register-scene">
            <div className="register-card">
              <h2>Register</h2>

              {error   && <p className="login-error">{error}</p>}
              {success && <p className="login-success">{success}</p>}

              <form
                onSubmit={handleRegister}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", width: "100%" }}
              >
                <div className="reg-input-box">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
                <div className="reg-input-box">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                <div className="reg-input-box">
                  <input
                    type="password"
                    placeholder="Password (8+ chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={loading}
                  />
                </div>

                {/* Password strength bar */}
                {password && (
                  <div style={{ width: "240px", display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: "4px", borderRadius: "2px",
                          background: i <= strength ? undefined : "#c8d5da",
                        }}
                        className={i <= strength ? strengthColors[strength - 1] : ""}
                      />
                    ))}
                  </div>
                )}

                <div className="reg-input-box">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={loading}
                    style={{ borderBottom: confirmPwd && confirmPwd !== password ? "2px solid #c62828" : undefined }}
                  />
                </div>

                <button
                  type="submit"
                  className="reg-submit"
                  disabled={loading || (!!confirmPwd && confirmPwd !== password)}
                >
                  {loading ? "..." : "Sign Up"}
                </button>
              </form>
            </div>

            {/* Orbit back button */}
            <button className="reg-back-btn" onClick={() => reset("login")}>
              Back to Login
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default LoginRegister;
