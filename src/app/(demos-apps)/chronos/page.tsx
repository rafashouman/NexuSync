import ChronosBooking from "@/components/ChronosBooking";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("chronos");

export default function Page() {
  return <DemoPage slug="chronos"><ChronosBooking /></DemoPage>;
}
