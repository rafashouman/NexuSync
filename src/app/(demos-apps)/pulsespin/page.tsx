import SpinToWin from "@/components/games/SpinToWin";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("pulsespin");

export default function Page() {
  return <DemoPage slug="pulsespin"><SpinToWin /></DemoPage>;
}
