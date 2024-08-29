import path from "path";
import { mdFile } from "../../types/files";
export const basePath = path.join(process.cwd(), "./");
export const ESSAYCSS = `
blockquote {
  margin-left: 0;
  border-left: 4px solid #bac2cb;
  padding-left: 12px;
  color: #4e5969;
}
ul {
  margin: 0;
  padding-left: 30px;
}
a {
  text-decoration: none; /* 移除下划线 */
  color: #1d9bf0; /* 使用继承的颜色 */
  cursor: pointer; /* 修改鼠标样式为指针 */
  outline: none; /* 移除默认的焦点边框 */
}
p {
  margin-top: 18px;
  margin-bottom: 18px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 30px;
  margin-bottom: 10px;
  text-decoration: underline;
  text-underline-offset: 6px;
}
@media screen and (max-width: 540px) {
  h1 {
    font-size: 1.5em; /* 1.5倍于基础字体大小 */
    line-height: 1.5em;
  }

  h2 {
    font-size: 1.35em; /* 1.25倍于基础字体大小 */
    line-height: 1.5em;
  }

  h3 {
    font-size: 1.2em; /* 基础字体大小 */
    line-height: 1.5em;
  }
  h4 {
    font-size: 1.05em; /* 基础字体大小 */
    line-height: 1.5em;
  }
  h5 {
    font-size: 1em; /* 基础字体大小 */
    line-height: 1.5em;
  }
  h6 {
    font-size: 1em; /* 基础字体大小 */
    line-height: 1.5em;
  }
}
a:hover{
  color:#0c7ad8
}
`;

export function makeEssay(title: string, date: string) {
  const content = `---
title: ${title}
date: ${date}
categories: 
excerpt: 
---
    `;
  return content;
}
export function makeImportPic(html: string) {
  let IMGIMPORT = "";
  const fileImgs = html.match(/<img\s+src="(.*?)"\s+alt="(.*?)"\>/g);

  const importStatements = fileImgs?.map((img, index) => {
    const [, srcValues] = img.match(/src\s*="(.*?)"/) || [];
    const oneSrc = srcValues.split("/");
    const src = oneSrc[oneSrc.length - 1];
    return (
      `//@ts-ignore` +
      "\n" +
      `import ${src.slice(0, src.lastIndexOf("."))} from "@/public${srcValues}"`
    );
  });

  if (importStatements) {
    IMGIMPORT += importStatements.join("\n");
  }
  console.log(IMGIMPORT);
  return IMGIMPORT;
}
export function makeEssayPage(file: mdFile) {
  let TEMPLATE = `
  import Image from "next/image";
import dynamic from "next/dynamic";
  ${file.other ? file.other.picPath : ""}
  // @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "@/app/[language]/essay/essay.css";
import { useTranslation } from "@/app/i18n";
export default async function Page({
  params: { language },
}: {
  params: { language: string };
}) {
  const Comment = dynamic(() => import("@/app/[language]/components/Comment"), {
    ssr: false,
  });
  const { t } = await useTranslation(language, "essay-${
    file.mdMatter.data.title
  }");
  return (
    <div>
    <div className="mt-8 bg-white flex flex-col items-start text-lg shadow-lg rounded-sm">
    <span className="text-4xl text-left lg:px-20 md:px-[2.5vw] px-4 pt-12 text-visit-font font-bold">
      ${file.mdMatter.data.title}
    </span>
    <span className="text-[#86909C] lg:px-20 pt-5 px-4 text-xl mb-5 md:px-[2.5vw]">
      Categories: ${file.mdMatter.data.categories} &nbsp;  ${
    file.mdMatter.data.date
  }
    </span>
    <div className="flex text-start break-words flex-col pb-12 lg:px-20 lg:w-[740px] md:w-[90vw] md:px-[2.5vw] w-[95vw] px-[2.5vw]">
      ${file.mdHtml}
    </div>
    
  </div>
  <div className="mt-12 py-8 bg-white px-6">
  <Comment />
</div>
    </div>
  );
}`;

  return TEMPLATE;
}
