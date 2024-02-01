import he from "he";
function ImageRepimg(html: string) {
  const processedHtml = html.replace(
    /<img\s+src="(.*?)"\s+alt="(.*?)".*?\/>/g,
    function (match, src, alt) {
      const modifiedSrc = src.split("/");
      const newSrc = modifiedSrc[modifiedSrc.length - 1]; // Your modification logic for src
      const modifiedAlt = alt; // Your modification logic for alt

      return `<Image src={${newSrc.slice(
        0,
        newSrc.lastIndexOf(".")
      )}} alt="${modifiedAlt}" 
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }} />`;
    }
  );
  return processedHtml;
}
function replaceClassName(html: string) {
  const processedHtml = html.replace(/class=/g, "className=");
  return processedHtml;
}
function highLightHtml(html: string) {
  // 在代码块内的特殊字符前加上 \
  const replacedString1 = html.replace(
    /<pre><code className="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, language, codeContent) => {
      //转义符删除
      const decodeCode = he.decode(codeContent);
      const codeWithBackslash = decodeCode.replace(/([^\w\s"'])/g, "\\$1");
      return `<SyntaxHighlighter language="${language}" style={oneLight} showLineNumbers>{ \`${codeWithBackslash}\` }</SyntaxHighlighter>`;
    }
  );

  return replacedString1;
}
export function compileHTML(html: string) {
  //替换img标签
  const step1Html = ImageRepimg(html);

  //替换class为className
  const step2Html = replaceClassName(step1Html);
  //高亮代码
  const step3Html = highLightHtml(step2Html);
  //闭合分割线
  const step4Html = step3Html.replace(/<hr>/g, "<hr />");

  return step4Html;
}
