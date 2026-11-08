import { ArknoidGame } from "@/components/games/ArknoidGame";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("arknoid");

export default function Page() {
  return <DemoPage slug="arknoid"><ArknoidGame /></DemoPage>;
}
