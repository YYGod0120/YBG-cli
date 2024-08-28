import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { unified } from "unified";
// 自定义插件来查看 HAST
// function inspectAst() {
//   return (tree) => {
//     console.log(JSON.stringify(tree, null, 2));
//   };
// }

//禁止中文自动编码
function handleImgSrc() {
  return (tree: any) => {
    visit(tree, "element", (node) => {
      if (node.properties.src) {
        // 直接保留原始路径，防止任何自动编码
        node.properties.src = decodeURI(node.properties.src);
      }
    });
  };
}
export async function compileByRemark(content: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(handleImgSrc)
    .use(rehypeStringify);
  const result = await processor.process(content);

  return result.toString();
}
