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

//编译
function conpileValue() {
  return (tree: any) => {
    let i = 0;
    visit(tree, "text", (node, index) => {
      if (node.value && node.value !== "\n") {
        node.value = `{t("${i}")}`;
        i++;
      }
    });
  };
}
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
// ol标签错误
function fixOlBug() {
  return (tree: any) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "ol") {
        // 直接保留原始路径，防止任何自动编码
        node.properties = {};
      }
    });
  };
}
export async function compileByRemark(content: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(conpileValue)
    .use(remarkRehype)
    .use(handleImgSrc)
    .use(fixOlBug)
    // .use(inspectAst)
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
}
