import ArcadeCabinetHub from "@/components/ArcadeCabinetHub";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("voxelvaders");

export default function Page() {
  return <DemoPage slug="voxelvaders"><ArcadeCabinetHub initialGame="voxelvaders" /></DemoPage>;
}
