import ArcadeCabinetHub from "@/components/ArcadeCabinetHub";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("pulse-arkanoid");

export default function Page() {
  return <DemoPage slug="pulse-arkanoid"><ArcadeCabinetHub initialGame="arkanoid" /></DemoPage>;
}
