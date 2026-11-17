import CreativeExperience from "@/components/home/CreativeExperience";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Identidade Visual e Design para Empresas | NexuSync",
  description:
    "Apresente sua marca com identidade visual, peças digitais e interfaces coerentes. Conheça os serviços de design da NexuSync.",
  path: "/design",
});

export default function Page() {
  return <CreativeExperience kind="design" />;
}
