import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWA } from "@/components/FloatingWA";
import DemoShell from "@/components/ui/DemoShell";
import { ScrollProgress } from "@/components/ui/MotionKit";

export const metadata: Metadata = {
  title: "Nexusync | Marketing Digital, Sites e Automações",
  description: "Sites, tráfego pago, gestão de redes sociais e automações para pequenos e médios negócios. Conheça os serviços e pacotes da Nexusync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DemoShell>
      <ScrollProgress />
      <Navbar />
      <main id="conteudo" className="relative flex min-h-screen flex-col overflow-hidden">
        {children}
      </main>
      <Footer />
      <FloatingWA />
    </DemoShell>
  );
}