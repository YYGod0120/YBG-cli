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
  const replacedString = html.replace(
    /<pre><code className="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    '<SyntaxHighlighter language="$1" style={oneLight} showLineNumbers>{` $2 `}</SyntaxHighlighter>'
  );
  return replacedString;
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
