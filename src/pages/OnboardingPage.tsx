import { useState } from "react";
import { User, MapPin, Heart, ArrowRight, Plus, Trash2, CheckCircle } from "lucide-react";

interface OnboardingPageProps {
  onComplete: () => void;
}

interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
  relation: string;
}

const OnboardingPage = ({ onComplete }: OnboardingPageProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRelation, setContactRelation] = useState("");

  const totalSteps = 3;

  const addContact = () => {
    if (!contactName.trim() || !contactPhone.trim() || !contactEmail.trim()) return;
    setContacts([...contacts, { name: contactName.trim(), phone: contactPhone.trim(), email: contactEmail.trim(), relation: contactRelation.trim() }]);
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setContactRelation("");
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    const profile = { name, age, gender, address, city, country };
    localStorage.setItem("helpline_profile", JSON.stringify(profile));
    localStorage.setItem("emergency_contacts", JSON.stringify(contacts.map(c => ({ name: c.name, phone: c.phone, email: c.email }))));
    localStorage.removeItem("helpline_needs_onboarding");
    onComplete();
  };

  const canProceedStep1 = name.trim() && age.trim();
  const canProceedStep2 = city.trim() && country.trim();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Progress */}
      <div className="px-6 pt-6">
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Step {step} of {totalSteps}</p>
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        {step === 1 && (
          <div className="chat-appear flex flex-1 flex-col">
            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">Tell us about yourself</h2>
              <p className="mt-2 text-sm text-muted-foreground">This helps us personalize your emergency experience</p>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-card px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">Age *</label>
                  <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-card px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-card px-4 py-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="chat-appear flex flex-1 flex-col">
            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-safe/10">
                <MapPin className="h-7 w-7 text-safe" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">Your location</h2>
              <p className="mt-2 text-sm text-muted-foreground">We'll use this to find relevant helpline numbers</p>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">Address</label>
                <input
                  type="text"
                  placeholder="House/Street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-card px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">City *</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-card px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-card px-4 py-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-border py-4 text-base font-semibold text-foreground transition-all hover:bg-secondary"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="chat-appear flex flex-1 flex-col">
            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emergency/10">
                <Heart className="h-7 w-7 text-emergency" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">Emergency contacts</h2>
              <p className="mt-2 text-sm text-muted-foreground">People who'll be notified when you press the panic button</p>
            </div>

            <div className="flex-1">
              {contacts.length > 0 && (
                <div className="mb-4 space-y-2">
                  {contacts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between rounded-2xl bg-secondary p-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.phone} • {c.email} {c.relation && `• ${c.relation}`}</p>
                      </div>
                      <button onClick={() => removeContact(i)} className="rounded-full p-2 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 rounded-2xl border border-border p-4">
                <input
                  type="text"
                  placeholder="Contact name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                    type="tel"
                    placeholder="Phone number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                <input
                    type="email"
                    placeholder="Email address"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Relation (optional)"
                    value={contactRelation}
                    onChange={(e) => setContactRelation(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <button
                  onClick={addContact}
                  disabled={!contactName.trim() || !contactPhone.trim() || !contactEmail.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                  Add Contact
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-2xl border border-border py-4 text-base font-semibold text-foreground transition-all hover:bg-secondary"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-safe py-4 text-base font-bold text-safe-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <CheckCircle className="h-5 w-5" />
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
