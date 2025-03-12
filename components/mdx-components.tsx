import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";
import dynamic from "next/dynamic";

const DynamicUploadWrapper = dynamic(
  () => import("./DynamicUploadWrapper"),
  { ssr: false }
);

const components = {
  Image,
  UploadForm: DynamicUploadWrapper,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return <Component components={components} />;
}
