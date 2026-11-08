import ArcadeCabinetHub from "@/components/ArcadeCabinetHub";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("cyber-tarot");

export default function Page() {
  return <DemoPage slug="cyber-tarot"><ArcadeCabinetHub initialGame="tarot" /></DemoPage>;
}
