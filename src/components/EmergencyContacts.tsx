import { Mail, Phone, Trash2, UserPlus, X } from "lucide-react";
import { useState } from "react";

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface EmergencyContactsProps {
  contacts: Contact[];
  onUpdate: (contacts: Contact[]) => void;
  onClose: () => void;
}

const EmergencyContacts = ({ contacts, onUpdate, onClose }: EmergencyContactsProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const addContact = () => {
    if (!name.trim() || !phone.trim() || !email.trim()) return;
    onUpdate([...contacts, { name: name.trim(), phone: phone.trim(), email: email.trim() }]);
    setName("");
    setPhone("");
    setEmail("");
  };

  const removeContact = (index: number) => {
    onUpdate(contacts.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md animate-in slide-in-from-bottom rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Emergency Contacts</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          These people will receive your location via SMS & email when you press the emergency button.
        </p>

        {contacts.length > 0 && (
          <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
            {contacts.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-secondary p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>
                    <span className="flex items-center gap-1 truncate"><Mail className="h-3 w-3" />{c.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeContact(i)}
                  className="ml-2 shrink-0 rounded-full p-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Contact name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={addContact}
            disabled={!name.trim() || !phone.trim() || !email.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
          >
            <UserPlus className="h-4 w-4" />
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
