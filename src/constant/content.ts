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

export async function makeEssayPage(file: mdFile) {
  const template = `
    import "../../essay.css";
    import Image from "next/image";
    // @ts-ignore
      import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
    // @ts-ignore
    import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
    export default function Page() {
      return (
        <div className=" mt-8 bg-white w-[60vw] flex flex-col items-start text-lg">
          <span className="text-4xl text-left px-24 pt-12 text-visit-font font-bold">
            ${file.mdMatter.data.title}
          </span>
          <span className=" text-[#86909C] px-24 pt-5 text-xl mb-5">
            Categories: ${file.mdMatter.data.categories} &nbsp; &nbsp; ${file.mdMatter.data.date}
          </span>
          <div className="flex text-start flex-col pb-12 px-24 w-[50vw]">
          ${file.mdHtml}
          </div>
          </div>
        );
      }
    `;
  return template;
}
