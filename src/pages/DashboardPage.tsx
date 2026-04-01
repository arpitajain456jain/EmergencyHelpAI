import { useState, useEffect, useCallback, useRef } from "react";
import { Shield, LogOut, Settings, Phone, MapPin, ChevronRight, X, Mic, MicOff, LocateFixed, Copy, Check } from "lucide-react";
import { situations, getHelplines, supportedCountries, type Helpline, type SituationCategory } from "@/data/helplines";
import PanicButton from "@/components/PanicButton";
import EmergencyContacts, { type Contact } from "@/components/EmergencyContacts";

const situationIcons: Record<string, { bg: string; iconColor: string }> = {
  medical: { bg: "bg-emergency/10", iconColor: "text-emergency" },
  fire: { bg: "bg-warning/10", iconColor: "text-warning" },
  police: { bg: "bg-primary/10", iconColor: "text-primary" },
  mental_health: { bg: "bg-safe/10", iconColor: "text-safe" },
  domestic_violence: { bg: "bg-destructive/10", iconColor: "text-destructive" },
  disaster: { bg: "bg-primary/10", iconColor: "text-primary" },
};

const timezoneToCountry: Record<string, string> = {
  "Asia/Kolkata": "India", "Asia/Calcutta": "India", "Asia/Mumbai": "India",
  "America/New_York": "USA", "America/Chicago": "USA", "America/Denver": "USA", "America/Los_Angeles": "USA", "America/Phoenix": "USA", "America/Anchorage": "USA", "Pacific/Honolulu": "USA",
  "Europe/London": "UK", "Europe/Belfast": "UK",
};

const DashboardPage = () => {
  const [selectedSituation, setSelectedSituation] = useState<SituationCategory | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "recognized" | "not_found">("idle");
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem("emergency_contacts");
    return saved ? JSON.parse(saved) : [];
  });
  const [profile, setProfile] = useState<{ name: string; country?: string } | null>(null);
  const [exactLocation, setExactLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);
  const [locationCopied, setLocationCopied] = useState(false);

  const detectCountryFromTimezone = useCallback(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const country = timezoneToCountry[tz];
      if (country && !selectedCountry) {
        setSelectedCountry(country);
      }
    } catch {}
  }, [selectedCountry]);

  const detectCountryFromGeolocation = useCallback(() => {
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await res.json();
          const address = data?.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setExactLocation({ lat: latitude, lon: longitude, address });

          const countryName = data?.address?.country;
          if (countryName) {
            const match = supportedCountries.find(
              (c) => countryName.toLowerCase().includes(c.toLowerCase()) ||
                (c === "USA" && countryName.toLowerCase().includes("united states")) ||
                (c === "UK" && countryName.toLowerCase().includes("united kingdom"))
            );
            if (match) setSelectedCountry(match);
          }
        } catch {} finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        detectCountryFromTimezone();
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [detectCountryFromTimezone]);

  useEffect(() => {
    const saved = localStorage.getItem("helpline_profile");
    if (saved) {
      const p = JSON.parse(saved);
      setProfile(p);
    }
    // Auto-detect location
    detectCountryFromGeolocation();
  }, [detectCountryFromGeolocation]);

  const updateContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem("emergency_contacts", JSON.stringify(updated));
  };

  const handleSituationClick = (situation: SituationCategory) => {
    setSelectedSituation(situation);
    if (selectedCountry) {
      setHelplines(getHelplines(situation, selectedCountry));
    }
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    if (selectedSituation) {
      setHelplines(getHelplines(selectedSituation, country));
    }
  };

  const voiceStatusRef = useRef(voiceStatus);
  voiceStatusRef.current = voiceStatus;
  const recognitionRef = useRef<any>(null);

  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\s/g, "")).then(() => {
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    });
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleVoice = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    // Request microphone permission explicitly first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop()); // release immediately, just needed permission
    } catch (err) {
      alert("Microphone access denied. Please allow microphone permission and try again.");
      return;
    }

    const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceTranscript("");
      setVoiceStatus("listening");
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      if (voiceStatusRef.current === "listening") {
        setVoiceStatus("idle");
      }
    };

    recognition.onresult = (event: any) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setVoiceTranscript(fullTranscript);

      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const text = fullTranscript.toLowerCase();
        for (const s of situations) {
          for (const kw of s.keywords) {
            if (text.includes(kw)) {
              handleSituationClick(s);
              setVoiceStatus("recognized");
              recognition.stop();
              setTimeout(() => setVoiceStatus("idle"), 3000);
              return;
            }
          }
        }
        setVoiceStatus("not_found");
        setTimeout(() => {
          setVoiceStatus("idle");
        }, 3000);
        // Don't stop — keep listening for more input
      }
    };

    recognition.onerror = (e: any) => {
      console.log("Speech recognition error:", e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        alert("Microphone access was blocked. Please allow it in your browser settings.");
      } else if (e.error === "no-speech") {
        // No speech detected, keep listening
        return;
      }
      setIsListening(false);
      setVoiceStatus("idle");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleLogout = () => {
    localStorage.removeItem("helpline_user");
    localStorage.removeItem("helpline_profile");
    localStorage.removeItem("helpline_needs_onboarding");
    window.location.reload();
  };

  const closeHelplines = () => {
    setSelectedSituation(null);
    setHelplines([]);
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emergency text-emergency-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">EmergencyHelp AI</h1>
            {profile && <p className="text-[10px] text-muted-foreground">Hi, {profile.name}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowContacts(true)} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Emergency Contacts">
            <Settings className="h-5 w-5" />
          </button>
          <button onClick={handleLogout} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Logout">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Panic Button */}
        <div className="px-4 py-3">
          <PanicButton emergencyContacts={contacts} />
        </div>

        {/* Voice Button */}
        <div className="px-4 pb-3">
          <button
            onClick={handleVoice}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-4 text-sm font-semibold transition-all ${
              isListening
                ? "border-emergency bg-emergency/5 text-emergency voice-ripple"
                : voiceStatus === "recognized"
                ? "border-safe bg-safe/5 text-safe"
                : voiceStatus === "not_found"
                ? "border-warning bg-warning/5 text-warning"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
            {isListening
              ? "🔴 Listening... Speak now"
              : voiceStatus === "recognized"
              ? "✅ Emergency recognized!"
              : voiceStatus === "not_found"
              ? "⚠️ Couldn't identify — try again"
              : "🎤 Tap to speak your emergency"}
          </button>
          {(voiceTranscript || isListening) && (
            <div className="mt-2 rounded-xl bg-secondary px-4 py-2.5 text-center">
              <p className="text-xs text-muted-foreground">You said:</p>
              <p className="text-sm font-medium text-foreground">
                {voiceTranscript || <span className="animate-pulse text-muted-foreground">...</span>}
              </p>
            </div>
          )}
        </div>

        {/* Location Card */}
        <div className="px-4 pb-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                <MapPin className="mr-1 inline h-3.5 w-3.5 text-emergency" />
                Your Location {detectingLocation && <span className="animate-pulse text-muted-foreground">(detecting...)</span>}
              </label>
              <button
                onClick={detectCountryFromGeolocation}
                disabled={detectingLocation}
                className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline disabled:opacity-50"
              >
                <LocateFixed className="h-3 w-3" />
                {exactLocation ? "Refresh" : "Auto-detect"}
              </button>
            </div>

            {exactLocation && (
              <div className="mb-3 rounded-xl bg-secondary p-3">
                <p className="text-xs text-muted-foreground mb-1">Exact address:</p>
                <p className="text-xs font-medium text-foreground leading-relaxed">{exactLocation.address}</p>
                <p className="text-[10px] text-muted-foreground mt-1">📍 {exactLocation.lat.toFixed(6)}, {exactLocation.lon.toFixed(6)}</p>
                <button
                  onClick={() => {
                    const locationText = `📍 ${exactLocation.address}\nCoordinates: ${exactLocation.lat.toFixed(6)}, ${exactLocation.lon.toFixed(6)}\nGoogle Maps: https://maps.google.com/?q=${exactLocation.lat},${exactLocation.lon}`;
                    navigator.clipboard.writeText(locationText).then(() => {
                      setLocationCopied(true);
                      setTimeout(() => setLocationCopied(false), 2000);
                    });
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/20 active:scale-[0.97]"
                >
                  {locationCopied ? <><Check className="h-3.5 w-3.5" /> Location Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy Location</>}
                </button>
              </div>
            )}

            {/* Country Selector */}
            <div className="flex gap-2">
              {supportedCountries.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCountrySelect(c)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                    selectedCountry === c
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {c === "India" ? "🇮🇳" : c === "USA" ? "🇺🇸" : "🇬🇧"} {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Situations Grid */}
        <div className="px-4 pb-3">
          <h2 className="mb-3 text-sm font-bold text-foreground">What's your emergency?</h2>
          <div className="grid grid-cols-2 gap-3">
            {situations.map((s) => {
              const style = situationIcons[s.id] || { bg: "bg-secondary", iconColor: "text-foreground" };
              const isSelected = selectedSituation?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSituationClick(s)}
                  className={`flex flex-col items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.97] ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${style.bg}`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.label}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {s.keywords.slice(0, 3).join(", ")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Helplines Result */}
        {selectedSituation && helplines.length > 0 && (
          <div className="chat-appear mx-4 mb-4 rounded-2xl border-2 border-primary bg-card p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                {selectedSituation.icon} {selectedSituation.label} — {selectedCountry || "General"}
              </h3>
              <button onClick={closeHelplines} className="rounded-full p-1 hover:bg-secondary">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-2">
              {helplines.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <a
                    href={`tel:${h.number.replace(/\s/g, "")}`}
                    className="flex flex-1 items-center justify-between rounded-xl bg-secondary p-3 transition-all hover:bg-accent active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-safe text-safe-foreground">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{h.name}</p>
                        <p className="text-xs text-muted-foreground">{h.description} • {h.available}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">{h.number}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(h.number)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-90"
                    title="Copy number"
                  >
                    {copiedNumber === h.number ? <Check className="h-4 w-4 text-safe" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSituation && !selectedCountry && (
          <div className="chat-appear mx-4 mb-4 rounded-2xl border border-warning bg-warning/10 p-4 text-center">
            <p className="text-sm font-semibold text-foreground">👆 Please select your country above to see helpline numbers</p>
          </div>
        )}
      </div>

      {/* Emergency Contacts Modal */}
      {showContacts && (
        <EmergencyContacts contacts={contacts} onUpdate={updateContacts} onClose={() => setShowContacts(false)} />
      )}
    </div>
  );
};

export default DashboardPage;
