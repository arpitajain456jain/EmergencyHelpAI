import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Settings, Shield, LogOut } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import SituationChips from "@/components/SituationChips";
import VoiceButton from "@/components/VoiceButton";
import PanicButton from "@/components/PanicButton";
import EmergencyContacts, { type Contact } from "@/components/EmergencyContacts";
import { detectSituation, getHelplines, supportedCountries, type Helpline } from "@/data/helplines";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
  helplines?: Helpline[];
}

type ChatState = "greeting" | "awaiting_situation" | "awaiting_location" | "resolved";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatState, setChatState] = useState<ChatState>("greeting");
  const [pendingSituation, setPendingSituation] = useState<ReturnType<typeof detectSituation>>(null);
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem("emergency_contacts");
    return saved ? JSON.parse(saved) : [];
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);

  const addMessage = useCallback((role: "user" | "bot", content: string, helplines?: Helpline[]) => {
    const id = nextId.current++;
    setMessages((prev) => [...prev, { id, role, content, helplines }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    addMessage("bot", "👋 Hi! I'm your emergency helpline assistant.\n\nTell me what's happening, or select a situation below. I'll find the right helpline number for you.");
    setChatState("awaiting_situation");
  }, [addMessage]);

  const updateContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem("emergency_contacts", JSON.stringify(updated));
  };

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    addMessage("user", msg);

    if (chatState === "awaiting_situation" || chatState === "greeting" || chatState === "resolved") {
      const situation = detectSituation(msg);
      if (situation) {
        setPendingSituation(situation);
        setChatState("awaiting_location");
        addMessage("bot", `I understand you're dealing with a ${situation.icon} **${situation.label}** situation.\n\nWhat's your country? (${supportedCountries.join(", ")})`);
      } else {
        addMessage("bot", "I couldn't identify the emergency type. Could you describe your situation in more detail? Or select one of the options below.");
      }
    } else if (chatState === "awaiting_location" && pendingSituation) {
      const country = supportedCountries.find((c) => msg.toLowerCase().includes(c.toLowerCase()));
      if (country) {
        const helplines = getHelplines(pendingSituation, country);
        addMessage(
          "bot",
          `Here are the helpline numbers for **${pendingSituation.label}** in **${country}**:\n\nTap any number to call directly. Stay safe! 💪`,
          helplines
        );
        setChatState("resolved");
        setPendingSituation(null);

        setTimeout(() => {
          addMessage("bot", "Need help with something else? Just type or select a situation below.");
        }, 1500);
      } else {
        // Try with default helplines
        const helplines = pendingSituation.defaultHelplines;
        addMessage(
          "bot",
          `I couldn't find specific helplines for that location. Here are general emergency numbers for **${pendingSituation.label}**:`,
          helplines
        );
        setChatState("resolved");
        setPendingSituation(null);
      }
    }
  };

  const handleSituationSelect = (label: string) => {
    handleSend(label);
  };

  const handleVoiceResult = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(text), 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("helpline_user");
    window.location.reload();
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
            <p className="text-[10px] text-muted-foreground">Emergency Helpline Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowContacts(true)}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Emergency Contacts"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={handleLogout}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Panic Button */}
      <div className="border-b border-border bg-card px-4 py-3">
        <PanicButton emergencyContacts={contacts} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} helplines={msg.helplines} />
        ))}

        {(chatState === "awaiting_situation" || chatState === "resolved") && (
          <div className="mt-2">
            <SituationChips onSelect={handleSituationSelect} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <VoiceButton onResult={handleVoiceResult} />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your emergency..."
            className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Emergency Contacts Modal */}
      {showContacts && (
        <EmergencyContacts
          contacts={contacts}
          onUpdate={updateContacts}
          onClose={() => setShowContacts(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
