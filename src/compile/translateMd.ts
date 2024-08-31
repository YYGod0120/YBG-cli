import { unified } from "unified";
import fs from "fs";
import stringify from "remark-stringify";
import markdown from "remark-parse";
import { translateWord } from "../utils/translate";
import { visit } from "unist-util-visit";
import path from "path";
import { basePath } from "../constant/content";
import frontmatter from "remark-frontmatter";
import { Translation } from "../../types/translate";
const _postFolder = path.join(basePath, "/_posts");

// // 自定义插件来查看 HAST
// function inspectAst() {
//   return (tree) => {
//     console.log(JSON.stringify(tree, null, 2));
//   };
// }

function translateNode(translation: Translation) {
  return async (tree: any) => {
    visit(tree, "text", (node) => {
      if (node.value) {
        console.log(node);
        translation.push({ src: node.value.replace(/\n/g, ""), dst_en: "" });
      }
    });
    // 翻译
    for (const item of translation) {
      const dst = await translateWord(item.src);
      item.dst_en = dst;
    }
    return tree;
  };
}
export async function translateMd(file: string) {
  const translation: Translation = [];
  //查询文件
  const filePath = path.join(_postFolder, `${file}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  // 创建处理器
  const processor = unified()
    .use(markdown)
    .use(frontmatter)
    .use(stringify)
    .use(translateNode, translation);
  await processor.process(fileContent);
  return translation;
}
