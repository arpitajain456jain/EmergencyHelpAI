import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import OnboardingPage from "./OnboardingPage";
import DashboardPage from "./DashboardPage";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("helpline_user");
    if (user) {
      setIsLoggedIn(true);
      const needsOb = localStorage.getItem("helpline_needs_onboarding");
      const profile = localStorage.getItem("helpline_profile");
      if (needsOb || !profile) {
        setNeedsOnboarding(true);
      }
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={() => {
          setIsLoggedIn(true);
          const profile = localStorage.getItem("helpline_profile");
          if (!profile) setNeedsOnboarding(true);
        }}
      />
    );
  }

  if (needsOnboarding) {
    return <OnboardingPage onComplete={() => setNeedsOnboarding(false)} />;
  }

  return <DashboardPage />;
};

export default Index;
