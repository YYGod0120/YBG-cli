import { unified } from "unified";
import fs from "fs";
import stringify from "remark-stringify";
import markdown from "remark-parse";
import { translateWord } from "../utils/translate";
import { visit } from "unist-util-visit";
import path from "path";
import { basePath } from "../constant/content";
import frontmatter from "remark-frontmatter";
const _postFolder = path.join(basePath, "/_posts");

export async function astOfMd(file: string) {
  //查询文件
  const filePath = path.join(_postFolder, `${file}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const tanslation: Array<Record<"src" | "dst", string>> = [];
  // 创建处理器
  const processor = await unified()
    .use(markdown)
    .use(frontmatter, ["yaml"])
    .use(stringify);
  const ast = processor.parse(fileContent);

  // 使用 unist-util-visit 遍历AST
  visit(ast, "text", (node) => {
    if (node.value) {
      tanslation.push({ src: node.value.replace(/\n/g, ""), dst: "" });
    }
  });
  console.log(tanslation);
  // // 翻译
  for (const item of tanslation) {
    // item.dst = await translateWord(item.src);
    console.log(item);
  }
  return tanslation;
}
