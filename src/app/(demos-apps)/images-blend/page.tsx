import { ImageBlendPlayground } from "@/components/ImageBlendPlayground";
import { DemoPage, demoMetadata } from "@/components/DemoPage";

export const metadata = demoMetadata("images-blend");

export default function Page() {
  return <DemoPage slug="images-blend"><ImageBlendPlayground /></DemoPage>;
}
