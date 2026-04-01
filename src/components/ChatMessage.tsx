import { Phone } from "lucide-react";
import type { Helpline } from "@/data/helplines";

interface ChatMessageProps {
  role: "user" | "bot";
  content: string;
  helplines?: Helpline[];
}

const ChatMessage = ({ role, content, helplines }: ChatMessageProps) => {
  return (
    <div className={`chat-appear flex ${role === "user" ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          role === "user"
            ? "bg-chat-user text-chat-user-foreground rounded-br-sm"
            : "bg-chat-bot text-chat-bot-foreground rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {helplines && helplines.length > 0 && (
          <div className="mt-3 space-y-2">
            {helplines.map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-3 rounded-xl bg-emergency/10 p-3 transition-all hover:bg-emergency/20 active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emergency text-emergency-foreground">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{h.name}</p>
                  <p className="text-lg font-bold text-emergency">{h.number}</p>
                  <p className="text-xs text-muted-foreground">{h.description} • {h.available}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
