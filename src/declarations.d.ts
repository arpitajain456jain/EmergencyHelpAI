declare module "react" {
  const content: any;
  export default content;
  export const useState: any;
  export const useEffect: any;
  export const useCallback: any;
  export const useMemo: any;
  export const useRef: any;
  export const createContext: any;
  export const useContext: any;
}

declare module "react-dom/client" {
  export const createRoot: any;
}

declare module "react-router-dom" {
  export const BrowserRouter: any;
  export const Route: any;
  export const Routes: any;
  export const Link: any;
  export const useNavigate: any;
  export const useParams: any;
  export const useLocation: any;
}

declare module "@tanstack/react-query" {
  export const QueryClient: any;
  export const QueryClientProvider: any;
  export const useQuery: any;
  export const useMutation: any;
}

declare module "lucide-react" {
  export const Shield: any;
  export const LogOut: any;
  export const Settings: any;
  export const Phone: any;
  export const MapPin: any;
  export const ChevronRight: any;
  export const X: any;
  export const Mic: any;
  export const MicOff: any;
  export const LocateFixed: any;
  export const Copy: any;
  export const Check: any;
}

declare module "sonner" {
  export const Toaster: any;
  export const toast: any;
}

declare module "@/components/ui/sonner" {
  export const Toaster: any;
}

declare module "@/components/ui/toaster" {
  export const Toaster: any;
}

declare module "@/components/ui/tooltip" {
  export const TooltipProvider: any;
}

declare module "@/data/helplines" {
  export const situations: any[];
  export const getHelplines: (situation: any, country: string) => any[];
  export const supportedCountries: string[];
  export type Helpline = any;
  export type SituationCategory = any;
}

declare module "@/components/PanicButton" {
  const content: any;
  export default content;
}

declare module "@/components/EmergencyContacts" {
  const content: any;
  export default content;
  export type Contact = any;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
