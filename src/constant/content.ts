import path from "path";
import { mdFile } from "../compile/extractMd";
export const basePath = path.join(process.cwd(), "./");
export const essayCss = `
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
  text-underline-offset: 4px;
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
  let imgImport = "";
  const fileImgs = html.match(/<img\s+src="(.*?)"\s+alt="(.*?)".*?\/>/g);
  const importStatements = fileImgs?.map((img, index) => {
    const [, srcValues] = img.match(/src\s*="(.*?)"/) || [];
    const oneSrc = srcValues.split("/");
    const src = oneSrc[oneSrc.length - 1];
    return (
      `//@ts-ignore` +
      "\n" +
      `import ${src.slice(
        0,
        src.lastIndexOf(".")
      )} from "../../../../public${srcValues}"`
    );
  });

  if (importStatements) {
    imgImport += importStatements.join("\n");
  }
  return imgImport;
}
export async function makeEssayPage(file: mdFile) {
  let template = `
  ${file.other ? file.other.picPath : ""}
import "../../essay.css";
import Image from "next/image";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
export default function Page() {
  return (
    <div className="mt-8 bg-white flex flex-col items-start text-lg shadow-lg rounded-sm">
      <span className="text-4xl text-left lg:px-20 md:px-[2.5vw] px-4 pt-12 text-visit-font font-bold">
        ${file.mdMatter.data.title}
      </span>
      <span className="text-[#86909C] lg:px-20 pt-5 px-4 text-xl mb-5 md:px-[2.5vw]">
        Categories: ${file.mdMatter.data.categories} &nbsp; &nbsp; ${
    file.mdMatter.data.date
  }
      </span>
      <div className="flex text-start flex-col pb-12 lg:px-20 lg:w-[740px] md:w-[90vw] md:px-[2.5vw] w-[95vw] px-[2.5vw]">
        ${file.mdHtml}
      </div>
    </div>
  );
}`;

  return template;
}
