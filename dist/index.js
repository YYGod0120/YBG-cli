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
var ESSAYCSS = `
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
function makeImportPic(html) {
  let IMGIMPORT = "";
  const fileImgs = html.match(/<img\s+src="(.*?)"\s+alt="(.*?)".*?\/>/g);
  const importStatements = fileImgs?.map((img, index) => {
    const [, srcValues] = img.match(/src\s*="(.*?)"/) || [];
    const oneSrc = srcValues.split("/");
    const src = oneSrc[oneSrc.length - 1];
    return `//@ts-ignore
import ${src.slice(
      0,
      src.lastIndexOf(".")
    )} from "../../../../public${srcValues}"`;
  });
  if (importStatements) {
    IMGIMPORT += importStatements.join("\n");
  }
  return IMGIMPORT;
}
async function makeEssayPage(file) {
  let TEMPLATE = `
  import Image from "next/image";
import dynamic from "next/dynamic";
  ${file.other ? file.other.picPath : ""}
  // @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "@/app/essay/essay.css";
export default function Page() {
  const Comment = dynamic(() => import("@/components/Comment"), {
    ssr: false,
  });
  return (
    <div>
    <div className="mt-8 bg-white flex flex-col items-start text-lg shadow-lg rounded-sm">
    <span className="text-4xl text-left lg:px-20 md:px-[2.5vw] px-4 pt-12 text-visit-font font-bold">
      ${file.mdMatter.data.title}
    </span>
    <span className="text-[#86909C] lg:px-20 pt-5 px-4 text-xl mb-5 md:px-[2.5vw]">
      Categories: ${file.mdMatter.data.categories} &nbsp; &nbsp; ${file.mdMatter.data.date}
    </span>
    <div className="flex text-start flex-col pb-12 lg:px-20 lg:w-[740px] md:w-[90vw] md:px-[2.5vw] w-[95vw] px-[2.5vw]">
      ${file.mdHtml}
    </div>
    
  </div>
  <div className="mt-12 py-8 bg-white px-6">
  <Comment />
</div>
    </div>
  );
}`;
  return TEMPLATE;
}

// src/compile/HtmlToNext.ts
import he from "he";
function ImageRepimg(html) {
  const processedHtml = html.replace(
    /<img\s+src="(.*?)"\s+alt="(.*?)".*?\/>/g,
    function(match, src, alt) {
      const modifiedSrc = src.split("/");
      const newSrc = modifiedSrc[modifiedSrc.length - 1];
      const modifiedAlt = alt;
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
function replaceClassName(html) {
  const processedHtml = html.replace(/class=/g, "className=");
  return processedHtml;
}
function highLightHtml(html) {
  const replacedString1 = html.replace(
    /<pre><code className="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, language, codeContent) => {
      const decodeCode = he.decode(codeContent);
      const codeWithBackslash = decodeCode.replace(/([^\w\s"'])/g, "\\$1");
      return `<SyntaxHighlighter language="${language}" style={oneLight} showLineNumbers>{ \`${codeWithBackslash}\` }</SyntaxHighlighter>`;
    }
  );
  return replacedString1;
}
function HtmlToNext(html) {
  const step1Html = ImageRepimg(html);
  const step2Html = replaceClassName(step1Html);
  const step3Html = highLightHtml(step2Html);
  const step4Html = step3Html.replace(/<hr>/g, "<hr />");
  return step4Html;
}

// src/compile/extractMd.ts
var _postFolder = path2.join(basePath, "/_posts");
async function compileFile() {
  let compiledFiles = [];
  const fileList = fs.readdirSync(_postFolder);
  for (const file of fileList) {
    const filePath = path2.join(_postFolder, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedFile = matter(fileContent);
    const newMatter = {
      ...parsedFile,
      data: { ...parsedFile.data, date: UTCToString(parsedFile.data.date) }
    };
    const picPath = makeImportPic(await marked(parsedFile.content));
    const htmlText = HtmlToNext(await marked(parsedFile.content));
    compiledFiles.push(
      picPath ? {
        mdMatter: newMatter,
        mdHtml: htmlText,
        other: {
          picPath
        }
      } : { mdMatter: newMatter, mdHtml: htmlText }
    );
  }
  return compiledFiles;
}

// src/create/writeFiles.ts
import path4 from "path";
import fs3 from "fs";

// src/create/EssayCss.ts
import path3 from "path";
import fs2 from "fs";
function writeCSS() {
  const filePath = path3.join(basePath, "/app/essay/essay.css");
  fs2.access(filePath, fs2.constants.F_OK, (err) => {
    if (err) {
      fs2.writeFile(filePath, ESSAYCSS, (writeErr) => {
        if (writeErr)
          throw writeErr;
      });
    }
  });
}

// src/create/writeFiles.ts
import { rimrafSync } from "rimraf";

// src/utils/randomColor.ts
import pkg from "picocolors";
var { cyan, yellow, green, red, blue } = pkg;
function getRandomColor(string) {
  const colors = [cyan, yellow, green, red, blue];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex](string);
}

// src/create/writeFiles.ts
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

// src/create/createFileData.ts
import path7 from "path";
import fs7 from "fs";

// src/utils/transformType.ts
function transformType(files) {
  let newDate = [];
  files.forEach((file, index) => {
    const { mdMatter, mdHtml } = file;
    const { data } = mdMatter;
    const newMatter = {
      ...data,
      html: mdHtml,
      id: index + 1 + ""
    };
    newDate.push(newMatter);
  });
  return newDate;
}

// src/utils/sortByDate.ts
function sortByDate(array) {
  array.sort(function(a, b) {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  return array;
}

// src/create/createFileData.ts
function writeFileData() {
  const fileDataPath = path7.join(`${basePath}/app/lib/`, "fileData.js");
  const fileDataFolderPath = `${basePath}/app/lib/`;
  fs7.mkdir(fileDataFolderPath, { recursive: true }, async (error) => {
    if (error) {
      console.log(error);
    } else {
      const fileData = sortByDate(transformType(await compileFile()));
      fs7.writeFile(
        fileDataPath,
        `const DATA = ${JSON.stringify(fileData)} 
        module.exports = {
            DATA,
          };
          `,
        (err) => {
          if (err) {
            console.error("Error creating file:", err);
          }
        }
      );
    }
  });
}

// src/node/cli.ts
var cli = cac();
cli.command("compile", "mdToTsx").action(async () => {
  const files = await compileFile();
  writeFile(files);
  writeFileData();
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