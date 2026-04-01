import { useState } from "react";
import { Shield, Phone, Mail, ArrowRight } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "phone" && !phone.trim()) return;
    if (mode === "email" && !email.trim()) return;

    localStorage.setItem(
      "helpline_user",
      JSON.stringify({ mode, value: mode === "phone" ? phone : email })
    );
    const profile = localStorage.getItem("helpline_profile");
    if (!profile) {
      localStorage.setItem("helpline_needs_onboarding", "true");
    }
    onLogin();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emergency text-emergency-foreground shadow-xl">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">EmergencyHelp AI</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your emergency helpline assistant</p>
        </div>

        {/* Toggle */}
        <div className="mb-6 flex rounded-2xl bg-secondary p-1.5">
          <button
            onClick={() => setMode("phone")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
              mode === "phone"
                ? "bg-card text-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Phone className="h-4 w-4" />
            Phone
          </button>
          <button
            onClick={() => setMode("email")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
              mode === "email"
                ? "bg-card text-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "phone" ? (
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-2xl border border-input bg-card px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-input bg-card px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
