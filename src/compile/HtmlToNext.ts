function ImageRepimg(html: string) {
  const processedHtml = html.replace(
    /<img\s+src="(.*?)"\s+alt="(.*?)".*?\/>/g,
    '<Image src="$1" alt="$2" width="700" height="450" />'
  );
  return processedHtml;
}
function replaceClassName(html: string) {
  const processedHtml = html.replace(/class=/g, "className=");
  return processedHtml;
}
function highLightHtml(html: string) {
  const replacedString1 = html.replace(/&quot;/g, '"');
  // 在代码块内的特殊字符前加上 \
  const replacedString2 = replacedString1.replace(
    /<pre><code className="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, language, codeContent) => {
      const codeWithBackslash = codeContent.replace(/([^\w\s"'])/g, "\\$1");
      return `<SyntaxHighlighter language="${language}" style={oneLight} showLineNumbers>{ \`${codeWithBackslash}\` }</SyntaxHighlighter>`;
    }
  );

  return replacedString2;
}
export function compileHTML(html: string) {
  //替换img标签
  const step1Html = ImageRepimg(html);

  //替换class为className
  const step2Html = replaceClassName(step1Html);
  //高亮代码
  const step3Html = highLightHtml(step2Html);
  console.log(1);

  return step3Html;
}
