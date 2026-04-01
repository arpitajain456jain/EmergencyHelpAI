import { AlertTriangle, MapPin, Check, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

interface PanicButtonProps {
  emergencyContacts: { name: string; phone: string; email: string }[];
}

const PanicButton = ({ emergencyContacts }: PanicButtonProps) => {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handlePanic = async () => {
    if (emergencyContacts.length === 0) {
      alert("Please add emergency contacts first in Settings.");
      return;
    }

    setIsSending(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;
      const mapsUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;

      // Get exact address
      let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
        );
        const data = await res.json();
        if (data?.display_name) address = data.display_name;
      } catch {}

      const profile = localStorage.getItem("helpline_profile");
      const userName = profile ? JSON.parse(profile).name : "Someone";

      // Build email content
      const emailSubject = `🚨 EMERGENCY ALERT from ${userName}`;
      const emailBody = `🚨 EMERGENCY ALERT!\n\n${userName} needs immediate help!\n\n📍 Exact Location:\n${address}\n\n🗺️ Google Maps:\n${mapsUrl}\n\n📌 Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nPlease respond immediately!`;

      const emails = emergencyContacts.map((c) => c.email).filter(Boolean);
      const phones = emergencyContacts.map((c) => c.phone).filter(Boolean);

      // Open email client with all contacts
      if (emails.length > 0) {
        const mailtoLink = `mailto:${emails.join(",")}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoLink, "_blank");
      }

      // Also open SMS after a small delay
      if (phones.length > 0) {
        const smsBody = encodeURIComponent(`🚨 EMERGENCY! ${userName} needs help!\n📍 ${address}\n🗺️ ${mapsUrl}`);
        setTimeout(() => {
          window.open(`sms:${phones.join(",")}?body=${smsBody}`, "_blank");
        }, 500);
      }

      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch {
      // Fallback without location
      const emails = emergencyContacts.map((c) => c.email).filter(Boolean);
      const phones = emergencyContacts.map((c) => c.phone).filter(Boolean);

      if (emails.length > 0) {
        window.open(`mailto:${emails.join(",")}?subject=${encodeURIComponent("🚨 EMERGENCY ALERT")}&body=${encodeURIComponent("🚨 EMERGENCY! I need help! Please call me immediately.")}`, "_blank");
      }
      if (phones.length > 0) {
        setTimeout(() => {
          window.open(`sms:${phones.join(",")}?body=${encodeURIComponent("🚨 EMERGENCY! I need help! Please call me immediately.")}`, "_blank");
        }, 500);
      }

      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handlePanic}
        disabled={isSending}
        className={`emergency-pulse flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition-all active:scale-[0.97] ${
          sent
            ? "bg-safe text-safe-foreground"
            : "bg-emergency text-emergency-foreground hover:bg-emergency-glow"
        }`}
      >
        {sent ? (
          <>
            <Check className="h-5 w-5" />
            Alert Sent via Email & SMS!
          </>
        ) : isSending ? (
          <>
            <MapPin className="h-5 w-5 animate-pulse" />
            Getting Exact Location...
          </>
        ) : (
          <>
            <AlertTriangle className="h-5 w-5" />
            🚨 Alert Emergency Contacts
          </>
        )}
      </button>
      <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email</span>
        <span>+</span>
        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> SMS</span>
        <span>→</span>
        <span>{emergencyContacts.length} contact{emergencyContacts.length !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
};

export default PanicButton;
