import { RouteAppGuide } from "@/components/RouteAppGuide";
import DemoShell from "@/components/ui/DemoShell";

export default function DemosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DemoShell><RouteAppGuide />{children}</DemoShell>;
}
