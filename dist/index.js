// src/compile/extractMd.ts
import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";

// src/utils/time.ts
import dayjs from "dayjs";
function UTCToString(date) {
  return dayjs(date).format("YYYY-MM-DD");
}
var currentDate = dayjs().format("YYYY-MM-DD");

// src/compile/extractMd.ts
import path2 from "path";

// src/constant/content.ts
import path from "path";
var basePath = path.join(process.cwd(), "./");
var essayCss = `
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
  text-decoration: none; /* \u79FB\u9664\u4E0B\u5212\u7EBF */
  color: #1d9bf0; /* \u4F7F\u7528\u7EE7\u627F\u7684\u989C\u8272 */
  cursor: pointer; /* \u4FEE\u6539\u9F20\u6807\u6837\u5F0F\u4E3A\u6307\u9488 */
  outline: none; /* \u79FB\u9664\u9ED8\u8BA4\u7684\u7126\u70B9\u8FB9\u6846 */
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
a:hover{
  color:#0c7ad8
}
`;
function makeEssay(title, date) {
  const content = `---
title: ${title}
date: ${date}
categories: 
excerpt: 
---
    `;
  return content;
}
async function makeEssayPage(file) {
  const template = `
    import "../../essay.css";
    import Image from "next/image";
    // @ts-ignore
      import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
    // @ts-ignore
    import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
    export default function Page() {
      return (
        <div className=" mt-8 bg-white w-[60vw] flex flex-col items-start text-lg">
          <span className="text-4xl text-left px-24 pt-12 text-visit-font font-bold">
            ${file.mdMatter.data.title}
          </span>
          <span className=" text-[#86909C] px-24 pt-5 text-xl mb-5">
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

// src/compile/HtmlToNext.ts
function ImageRepimg(html) {
  const processedHtml = html.replace(
    /<img\s+src="(.*?)"\s+alt="(.*?)".*?\/>/g,
    '<Image src="$1" alt="$2" width="700" height="450" />'
  );
  return processedHtml;
}
function replaceClassName(html) {
  const processedHtml = html.replace(/class=/g, "className=");
  return processedHtml;
}
function highLightHtml(html) {
  const replacedString1 = html.replace(/&quot;/g, '"');
  const replacedString2 = replacedString1.replace(
    /<pre><code className="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, language, codeContent) => {
      const codeWithBackslash = codeContent.replace(/([^\w\s"'])/g, "\\$1");
      return `<SyntaxHighlighter language="${language}" style={oneLight} showLineNumbers>{ \`${codeWithBackslash}\` }</SyntaxHighlighter>`;
    }
  );
  return replacedString2;
}
function compileHTML(html) {
  const step1Html = ImageRepimg(html);
  const step2Html = replaceClassName(step1Html);
  const step3Html = highLightHtml(step2Html);
  console.log(1);
  return step3Html;
}

// src/compile/extractMd.ts
var _postFolder = path2.join(basePath, "/_posts");
async function fileToJSON() {
  let files = [];
  const fileList = fs.readdirSync(_postFolder);
  for (const file of fileList) {
    const filePath = path2.join(_postFolder, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedFile = matter(fileContent);
    const newMatter = {
      ...parsedFile,
      data: { ...parsedFile.data, date: UTCToString(parsedFile.data.date) }
    };
    const htmlText = compileHTML(await marked(parsedFile.content));
    console.log(file);
    files.push({ mdMatter: newMatter, mdHtml: htmlText });
  }
  return files;
}

// src/create/mdToPage.ts
import path4 from "path";
import fs3 from "fs";

// src/create/EssayCss.ts
import path3 from "path";
import fs2 from "fs";
function writeCSS() {
  const filePath = path3.join(basePath, "/app/essay/essay.css");
  fs2.access(filePath, fs2.constants.F_OK, (err) => {
    if (err) {
      fs2.writeFile(filePath, essayCss, (writeErr) => {
        if (writeErr)
          throw writeErr;
      });
    }
  });
}

// src/create/mdToPage.ts
import { rimrafSync } from "rimraf";

// src/utils/randomColor.ts
import pkg from "picocolors";
var { cyan, yellow, green, red, blue } = pkg;
function getRandomColor(string) {
  const colors = [cyan, yellow, green, red, blue];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex](string);
}

// src/create/mdToPage.ts
function writeFile(files) {
  rimrafSync(`${basePath}/app/essay`, {
    preserveRoot: false
  });
  files.forEach(async (file, index) => {
    const foldPath = `${basePath}/app/essay/${file.mdMatter.data.date}/${index + 1}`;
    const filePath = path4.join(foldPath, "page.tsx");
    const content = await makeEssayPage(file);
    fs3.mkdir(foldPath, { recursive: true }, (error) => {
      if (error) {
        console.log(error);
      } else {
        writeCSS();
        fs3.writeFile(filePath, content, (err) => {
          if (err) {
            console.error("Error creating file:", err);
          } else {
            console.log(
              `Page-${getRandomColor(
                file.mdMatter.data.title
              )} created successfully.`
            );
          }
        });
      }
    });
  });
}

// src/node/cli.ts
import cac from "cac";

// src/create/createMD.ts
import path5 from "path";
import fs4 from "fs";
function createEssay(date, title) {
  const _postsPath = path5.join(basePath, "/_posts");
  const filePath = path5.join(_postsPath, `${title}.md`);
  const mdFile = makeEssay(title, date);
  fs4.mkdir(_postsPath, { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    } else {
      fs4.writeFile(filePath, mdFile, (err) => {
        if (err) {
          console.error("Error creating file:", err);
        } else {
          console.log(`Essay ${getRandomColor(title)} created successfully.`);
        }
      });
    }
  });
}

// src/create/createImg.ts
import fs5 from "fs";
function createImgs(title) {
  const foldPath = `${basePath}/public/imgs/${title}`;
  fs5.mkdir(foldPath, { recursive: true }, (error) => {
    if (error)
      console.log(error);
  });
}

// src/remove/removePage.ts
import path6 from "path";
import fs6 from "fs";
import { rimraf } from "rimraf";
function removePage(file) {
  const MdPath = path6.join(basePath, `/_posts/${file}.md`);
  fs6.unlink(MdPath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`File-${file} deleted successfully`);
    }
  });
  const foldPath = `${basePath}/public/imgs/${file}`;
  rimraf(foldPath, { preserveRoot: false });
}

// src/node/cli.ts
var cli = cac();
cli.command("compile", "mdToTsx").action(async () => {
  const files = await fileToJSON();
  writeFile(files);
});
cli.command("create [project]", "create the new essay").action(async (project) => {
  createEssay(currentDate, project);
  createImgs(project);
});
cli.command("remove [project]", "remove the new essay").action(async (project) => {
  removePage(project);
});
cli.parse();
//# sourceMappingURL=index.js.map