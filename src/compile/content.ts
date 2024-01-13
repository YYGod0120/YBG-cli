import path from "path";
import { mdFile } from "./extractMd";
export const basePath = path.join(__dirname, "../../");
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
  display: inline-block;
  position: relative;
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
a::after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: #4e5969;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

a:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
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
    import "../essay.css";
    import Image from "next/image";
    
    export default function Page() {
      return (
        <div className=" mt-8 bg-white w-[60vw] flex flex-col items-start text-lg">
          <span className="text-4xl text-left px-24 pt-12 text-visit-font font-bold">
            ${file.mdMatter.data.title}
          </span>
          <span className=" text-[#86909C] px-24 pt-5 text-xl">
            Categories: ${file.mdMatter.data.categories} &nbsp; &nbsp; ${file.mdMatter.data.date}
          </span>
          <div className="flex text-start flex-col pb-12 px-24">
          ${file.mdHtml}
          </div>
          </div>
        );
      }
    `;
  return template;
}

export function processHTML(html: string) {
  const replacedText = html.replace(
    /<img([^>]*)src="(\.\.\/public\/[^"]+)"([^>]*)>/g,
    '<Image$1src="$2"$3 />'
  );
  // 移除路径中的 ../public
  const finalText = replacedText.replace(/\.\.\/public\//g, "/");
  return finalText;
}
