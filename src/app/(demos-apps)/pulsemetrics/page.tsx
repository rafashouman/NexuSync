import PulseMetricsDashboard from "@/components/PulseMetricsDashboard";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("pulsemetrics");

export default function Page() {
  return <DemoPage slug="pulsemetrics"><PulseMetricsDashboard /></DemoPage>;
}
