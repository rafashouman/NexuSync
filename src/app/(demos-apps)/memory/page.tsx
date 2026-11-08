import MemoryMatrix from "@/components/games/MemoryMatrix";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("memory");

export default function Page() {
  return <DemoPage slug="memory"><MemoryMatrix /></DemoPage>;
}
