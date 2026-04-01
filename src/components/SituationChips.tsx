import { situations } from "@/data/helplines";

interface SituationChipsProps {
  onSelect: (label: string) => void;
}

const SituationChips = ({ onSelect }: SituationChipsProps) => {
  return (
    <div className="chat-appear">
      <p className="mb-3 text-xs font-medium text-muted-foreground">Quick select your situation:</p>
      <div className="flex flex-wrap gap-2">
        {situations.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.label)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:border-emergency hover:bg-emergency/5 active:scale-95"
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SituationChips;
