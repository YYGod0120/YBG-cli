import { unified } from "unified";
import remarkParse from "remark-parse";
import markdown from "remark-parse";
import remarkHtml from "remark-html";
const file = `
# Hello World
**TEST**
`;
export async function test() {
  //   const rep = await unified().use(remarkParse).use(remarkHtml).process(file);
  //   return rep;
  // 创建处理器
  const processor = unified().use(markdown);
  const ast = processor.parse(file);
  console.log(JSON.stringify(ast, null, 2));
}
