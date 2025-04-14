import { BenefitsSection } from "./ui/BenefitsSection";
import { HeroSection } from "./ui/HeroSection";
import { WorkflowSection } from "./ui/WorkflowSection";

export const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <WorkflowSection />
      <BenefitsSection />
    </main>
  );
};
