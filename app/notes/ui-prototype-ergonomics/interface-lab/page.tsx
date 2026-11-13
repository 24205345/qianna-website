import type { Metadata } from "next";
import FrontendPromptLab from "./FrontendPromptLab";
import "./frontend-prompt-lab.css";

export const metadata: Metadata = {
  title: "Frontend Prompt Lab · 界面交互实验室",
  description: "通过实时预览认识网页部位，调整布局、视觉与动效，并生成整页提示词。",
  robots: { index: false, follow: false },
};

export default async function InterfaceLabPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  return <FrontendPromptLab initialPromptLanguage={lang === "en" ? "en" : "mixed"} />;
}
