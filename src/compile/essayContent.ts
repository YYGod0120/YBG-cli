import { mdFile } from "./extractMd";
export async function makeEssayPage(file: mdFile) {
  const template = `
    import "././../essay.css";
    import Image from "next/image";
    
    export default function Page() {
      return (
        <div className=" mt-8 bg-white w-[60vw] flex flex-col items-start text-lg">
          <span className="text-4xl text-left px-24 pt-12 text-visit-font font-bold">
            ${file.mdMatter.data.title}
          </span>
          <span className=" text-[#86909C] px-24 pt-5 text-xl">
            Categories: ${file.mdMatter.data.title} &nbsp; &nbsp; ${file.mdMatter.data.date}
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
