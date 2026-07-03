import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, getRateLimitStatus, getAdminSession } from "@/lib/adminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rateStatus, setRateStatus] = useState({ locked: false, minutesLeft: 0 });

  useEffect(() => {
    // Redirect if already logged in
    getAdminSession().then((s) => { if (s) navigate("/ssuunnlliitt/dashboard"); });
    setRateStatus(getRateLimitStatus());
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const rate = getRateLimitStatus();
    setRateStatus(rate);
    if (rate.locked) {
      setError(`Account locked. Try again in ${rate.minutesLeft} minute${rate.minutesLeft !== 1 ? "s" : ""}.`);
      return;
    }
    setLoading(true);
    const { error: loginError } = await adminLogin(password);
    setLoading(false);
    if (loginError) {
      setError(loginError);
      setRateStatus(getRateLimitStatus());
    } else {
      navigate("/ssuunnlliitt/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-teal-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">Admin Portal</h1>
          <p className="text-white/60 text-sm mt-1">Sunlit Centre Kenya</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-foreground mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your admin password to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  disabled={rateStatus.locked || loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShow(!show)}
                  tabIndex={-1}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {rateStatus.locked && (
              <div className="text-sm text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2">
                Too many failed attempts. Locked for {rateStatus.minutesLeft} min.
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={loading || rateStatus.locked}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Restricted access — authorised personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
