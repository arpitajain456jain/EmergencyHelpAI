export interface Helpline {
  name: string;
  number: string;
  description: string;
  available: string;
}

export interface SituationCategory {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
  helplines: Record<string, Helpline[]>;
  defaultHelplines: Helpline[];
}

export const situations: SituationCategory[] = [
  {
    id: "medical",
    label: "Medical Emergency",
    icon: "🏥",
    keywords: ["medical", "health", "hospital", "injury", "hurt", "pain", "bleeding", "heart", "breathing", "accident", "ambulance", "sick", "unconscious", "seizure", "stroke", "burn", "poison", "overdose"],
    defaultHelplines: [
      { name: "Emergency Services", number: "112", description: "Universal emergency number", available: "24/7" },
      { name: "Ambulance", number: "102", description: "Ambulance services", available: "24/7" },
    ],
    helplines: {
      "India": [
        { name: "Ambulance", number: "102", description: "National ambulance service", available: "24/7" },
        { name: "Emergency", number: "112", description: "Unified emergency number", available: "24/7" },
      ],
      "USA": [
        { name: "Emergency Services", number: "911", description: "Police, Fire, Medical", available: "24/7" },
        { name: "Poison Control", number: "1-800-222-1222", description: "Poison help hotline", available: "24/7" },
      ],
      "UK": [
        { name: "Emergency Services", number: "999", description: "Police, Fire, Ambulance", available: "24/7" },
        { name: "NHS Direct", number: "111", description: "Non-emergency medical advice", available: "24/7" },
      ],
    },
  },
  {
    id: "fire",
    label: "Fire Emergency",
    icon: "🔥",
    keywords: ["fire", "burning", "smoke", "flames", "explosion", "gas leak", "trapped"],
    defaultHelplines: [
      { name: "Fire Services", number: "101", description: "Fire department", available: "24/7" },
    ],
    helplines: {
      "India": [
        { name: "Fire Services", number: "101", description: "Fire department", available: "24/7" },
        { name: "Emergency", number: "112", description: "Unified emergency number", available: "24/7" },
      ],
      "USA": [
        { name: "Emergency Services", number: "911", description: "Police, Fire, Medical", available: "24/7" },
      ],
      "UK": [
        { name: "Emergency Services", number: "999", description: "Police, Fire, Ambulance", available: "24/7" },
      ],
    },
  },
  {
    id: "police",
    label: "Crime / Police",
    icon: "🚔",
    keywords: ["police", "crime", "theft", "robbery", "assault", "attack", "stalking", "threat", "break-in", "burglary", "kidnap", "missing", "violence", "gun", "weapon", "murder", "danger"],
    defaultHelplines: [
      { name: "Police", number: "100", description: "Police emergency", available: "24/7" },
    ],
    helplines: {
      "India": [
        { name: "Police", number: "100", description: "Police control room", available: "24/7" },
        { name: "Emergency", number: "112", description: "Unified emergency number", available: "24/7" },
        { name: "Women Helpline", number: "1091", description: "Women in distress", available: "24/7" },
      ],
      "USA": [
        { name: "Emergency Services", number: "911", description: "Police, Fire, Medical", available: "24/7" },
      ],
      "UK": [
        { name: "Emergency Services", number: "999", description: "Police, Fire, Ambulance", available: "24/7" },
        { name: "Non-Emergency Police", number: "101", description: "Non-urgent police matters", available: "24/7" },
      ],
    },
  },
  {
    id: "mental_health",
    label: "Mental Health",
    icon: "🧠",
    keywords: ["depressed", "depression", "suicide", "suicidal", "anxiety", "panic", "mental", "stress", "lonely", "hopeless", "self-harm", "emotional", "crisis", "sad", "crying", "overwhelmed"],
    defaultHelplines: [
      { name: "Crisis Helpline", number: "112", description: "Emergency services", available: "24/7" },
    ],
    helplines: {
      "India": [
        { name: "iCall", number: "9152987821", description: "Psychosocial helpline", available: "Mon-Sat, 8AM-10PM" },
        { name: "Vandrevala Foundation", number: "1860-2662-345", description: "Mental health support", available: "24/7" },
        { name: "AASRA", number: "9820466726", description: "Suicide prevention", available: "24/7" },
      ],
      "USA": [
        { name: "Suicide & Crisis Lifeline", number: "988", description: "Suicide prevention hotline", available: "24/7" },
        { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Text-based crisis support", available: "24/7" },
      ],
      "UK": [
        { name: "Samaritans", number: "116 123", description: "Emotional support", available: "24/7" },
        { name: "CALM", number: "0800 58 58 58", description: "Campaign Against Living Miserably", available: "5PM-Midnight" },
      ],
    },
  },
  {
    id: "domestic_violence",
    label: "Domestic Violence",
    icon: "🛡️",
    keywords: ["domestic", "abuse", "abused", "beaten", "hit", "spouse", "partner", "husband", "wife", "family violence", "child abuse", "harassment"],
    defaultHelplines: [
      { name: "Emergency", number: "112", description: "Emergency services", available: "24/7" },
    ],
    helplines: {
      "India": [
        { name: "Women Helpline", number: "181", description: "Women in distress", available: "24/7" },
        { name: "NCW Helpline", number: "7827-170-170", description: "National Commission for Women", available: "24/7" },
        { name: "Child Helpline", number: "1098", description: "Childline India", available: "24/7" },
      ],
      "USA": [
        { name: "Domestic Violence Hotline", number: "1-800-799-7233", description: "National DV hotline", available: "24/7" },
        { name: "Childhelp", number: "1-800-422-4453", description: "Child abuse hotline", available: "24/7" },
      ],
      "UK": [
        { name: "National DV Helpline", number: "0808 2000 247", description: "Domestic abuse support", available: "24/7" },
        { name: "NSPCC", number: "0808 800 5000", description: "Child protection", available: "24/7" },
      ],
    },
  },
  {
    id: "disaster",
    label: "Natural Disaster",
    icon: "🌊",
    keywords: ["earthquake", "flood", "tsunami", "cyclone", "hurricane", "tornado", "landslide", "storm", "disaster", "trapped", "rescue", "collapsed"],
    defaultHelplines: [
      { name: "Emergency", number: "112", description: "Emergency services", available: "24/7" },
    ],
    helplines: {
      "India": [
        { name: "NDRF", number: "011-24363260", description: "National Disaster Response Force", available: "24/7" },
        { name: "Emergency", number: "112", description: "Unified emergency number", available: "24/7" },
      ],
      "USA": [
        { name: "FEMA", number: "1-800-621-3362", description: "Federal Emergency Management", available: "24/7" },
        { name: "Emergency Services", number: "911", description: "Police, Fire, Medical", available: "24/7" },
      ],
      "UK": [
        { name: "Emergency Services", number: "999", description: "Police, Fire, Ambulance", available: "24/7" },
        { name: "Floodline", number: "0345 988 1188", description: "Flood warnings", available: "24/7" },
      ],
    },
  },
];

export function detectSituation(message: string): SituationCategory | null {
  const lower = message.toLowerCase();
  for (const situation of situations) {
    for (const keyword of situation.keywords) {
      if (lower.includes(keyword)) {
        return situation;
      }
    }
  }
  return null;
}

export function getHelplines(situation: SituationCategory, country: string): Helpline[] {
  return situation.helplines[country] || situation.defaultHelplines;
}

export const supportedCountries = ["India", "USA", "UK"];
