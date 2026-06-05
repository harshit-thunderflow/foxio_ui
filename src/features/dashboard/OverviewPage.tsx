import { HeroSection, ActiveStepCard, UpcomingSteps, HelpIllustration, OverviewFooter } from "./components";
import { usePageTitle } from "@/hooks";
import type { StepItem } from "./components/UpcomingSteps";

const upcomingSteps: StepItem[] = [
  {
    id: "2",
    number: 2,
    title: "Configure your triggers",
    description: "Set up event-based triggers to automate repetitive tasks.",
  },
  {
    id: "3",
    number: 3,
    title: "Connect modules",
    description: "Link your data sources and outputs for seamless flow.",
  },
  {
    id: "4",
    number: 4,
    title: "Test & deploy",
    description: "Run a dry test and publish your automation live.",
  },
];

export function OverviewPage() {
  usePageTitle("Overview");
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        <HeroSection
          title="Interactive Walkthrough"
          description="We'll highlight the elements on your page to show you exactly where to go."
        />

        <ActiveStepCard
          stepLabel="Step 1 of 4"
          title="Setting up your first automation"
          instruction='Click on the "Settings" gear icon in your main dashboard navigation to begin.'
          actionLabel="Show me"
        />

        <UpcomingSteps steps={upcomingSteps} />

        <HelpIllustration imageUrl="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" />
      </div>

      <OverviewFooter />
    </div>
  );
}
