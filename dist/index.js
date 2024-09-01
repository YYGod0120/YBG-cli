// src/compile/extractMd.ts
import fs from "fs";
import matter from "gray-matter";

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
  text-underline-offset: 6px;
}
@media screen and (max-width: 540px) {
  h1 {
    font-size: 1.5em; /* 1.5\u500D\u4E8E\u57FA\u7840\u5B57\u4F53\u5927\u5C0F */
    line-height: 1.5em;
  }

  h2 {
    font-size: 1.35em; /* 1.25\u500D\u4E8E\u57FA\u7840\u5B57\u4F53\u5927\u5C0F */
    line-height: 1.5em;
  }

  h3 {
    font-size: 1.2em; /* \u57FA\u7840\u5B57\u4F53\u5927\u5C0F */
    line-height: 1.5em;
  }
  h4 {
    font-size: 1.05em; /* \u57FA\u7840\u5B57\u4F53\u5927\u5C0F */
    line-height: 1.5em;
  }
  h5 {
    font-size: 1em; /* \u57FA\u7840\u5B57\u4F53\u5927\u5C0F */
    line-height: 1.5em;
  }
  h6 {
    font-size: 1em; /* \u57FA\u7840\u5B57\u4F53\u5927\u5C0F */
    line-height: 1.5em;
  }
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
  const fileImgs = html.match(/<img\s+src="(.*?)"\s+alt="(.*?)"\>/g);
  const importStatements = fileImgs?.map((img, index2) => {
    const [, srcValues] = img.match(/src\s*="(.*?)"/) || [];
    const oneSrc = srcValues.split("/");
    const src = oneSrc[oneSrc.length - 1];
    return `//@ts-ignore
import ${src.slice(0, src.lastIndexOf("."))} from "@/public${srcValues}"`;
  });
  if (importStatements) {
    IMGIMPORT += importStatements.join("\n");
  }
  console.log(IMGIMPORT);
  return IMGIMPORT;
}
function makeEssayPage(file) {
  let TEMPLATE = `
  import Image from "next/image";
import dynamic from "next/dynamic";
  ${file.other ? file.other.picPath : ""}
  // @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "@/app/[language]/essay/essay.css";
import { useTranslation } from "@/app/i18n";

export default async function Page({
  params: { language },
}: {
  params: { language: string };
}) {
  const { t } = await useTranslation(language, "essay-${file.mdMatter.data.title}");
  return (
    <div>
    <div className="mt-8 bg-white flex flex-col items-start text-lg shadow-lg rounded-sm">
    <span className="text-4xl text-left lg:px-20 md:px-[2.5vw] px-4 pt-12 text-visit-font font-bold">
      ${file.mdMatter.data.title}
    </span>
    <span className="text-[#86909C] lg:px-20 pt-5 px-4 text-xl mb-5 md:px-[2.5vw]">
      Categories: ${file.mdMatter.data.categories} &nbsp;  ${file.mdMatter.data.date}
    </span>
    <div className="flex text-start break-words flex-col pb-12 lg:px-20 lg:w-[740px] md:w-[90vw] md:px-[2.5vw] w-[95vw] px-[2.5vw]">
      ${file.mdHtml}
    </div>
    
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
    /<img\s+src="(.*?)"\s+alt="(.*?)"\>/g,
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
        width: "100%",
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

// src/compile/compileByRemark.ts
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { unified } from "unified";
function conpileValue() {
  return (tree) => {
    let i = 0;
    visit(tree, "text", (node, index2) => {
      if (node.value && node.value !== "\n") {
        node.value = `{t("${i}")}`;
        i++;
      }
    });
  };
}
function handleImgSrc() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.properties.src) {
        node.properties.src = decodeURI(node.properties.src);
      }
    });
  };
}
async function compileByRemark(content) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(conpileValue).use(remarkRehype).use(handleImgSrc).use(rehypeStringify);
  const result = await processor.process(content);
  return result.toString();
}

// src/compile/extractMd.ts
var _postFolder = path2.join(basePath, "/_posts");
function simpleHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash += input.charCodeAt(i);
  }
  return JSON.stringify(hash % 1e3);
}
async function compileFile(project) {
  let compiledFiles = [];
  let fileList = fs.readdirSync(_postFolder);
  if (project) {
    fileList = fileList.filter((file) => {
      return file === `${project}.md`;
    });
  }
  for (const file of fileList) {
    const filePath = path2.join(_postFolder, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedFile = matter(fileContent);
    const newMatter = {
      ...parsedFile,
      data: { ...parsedFile.data, date: UTCToString(parsedFile.data.date) }
    };
    const remarkContent = await compileByRemark(parsedFile.content);
    const picPath = makeImportPic(remarkContent);
    const htmlText = HtmlToNext(remarkContent);
    compiledFiles.push(
      picPath ? {
        id: simpleHash(file),
        mdMatter: newMatter,
        mdHtml: htmlText,
        other: {
          picPath
        }
      } : { id: simpleHash(file), mdMatter: newMatter, mdHtml: htmlText }
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
  const filePath = path3.join(basePath, "/app/[language]/essay/essay.css");
  fs2.access(filePath, fs2.constants.F_OK, (err) => {
    if (err) {
      fs2.writeFile(filePath, ESSAYCSS, (writeErr) => {
        if (writeErr) throw writeErr;
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
  files.forEach(async (file) => {
    rimrafSync(`${basePath}/app/[language]/essay/${file.mdMatter.data.date}`, {
      preserveRoot: false
    });
    const foldPath = `${basePath}/app/[language]/essay/${file.mdMatter.data.date}/${file.id}`;
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
    if (error) console.log(error);
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
  let newData = [];
  files.forEach((file, index2) => {
    const { mdMatter, mdHtml, id } = file;
    const { data } = mdMatter;
    const newMatter = {
      ...data,
      id,
      html: mdHtml
    };
    newData.push(newMatter);
  });
  return newData;
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
  const fileDataPath = path7.join(
    `${basePath}/app/[language]/lib/`,
    "fileData.js"
  );
  const fileDataFolderPath = `${basePath}/app/[language]/lib/`;
  fs7.mkdir(fileDataFolderPath, { recursive: true }, async (error) => {
    if (error) {
      console.log(error);
    } else {
      const fileData = sortByDate(transformType(await compileFile()));
      fs7.writeFile(
        fileDataPath,
        `/**
        * @property {string} title - \u6587\u7AE0\u6807\u9898
        * @property {string} date - \u6587\u7AE0\u65E5\u671F
        * @property {string} categories - \u6587\u7AE0\u5206\u7C7B\uFF1AProject,Weekly,Life,Technology
        * @property {string} excerpt - \u6982\u8FF0
        * @property {string} html - \u89E3\u6790\u8FC7\u540E\u7684html
        * @property {string} id - id
        * 
        */
        const DATA = ${JSON.stringify(fileData)} 
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

// src/deploy/index.ts
import fs9 from "fs";
import path9 from "path";
import { spawn } from "child_process";

// src/utils/readConfig.ts
import fs8 from "fs";
import path8 from "path";
function readConfig() {
  const jsonFilePath = path8.join(basePath, "_blog.json");
  return new Promise((resolve, reject) => {
    fs8.readFile(jsonFilePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    });
  });
}

// src/deploy/index.ts
var currentDir = process.cwd();
var gitFolderPath = path9.join(currentDir, ".git");
function git(...args) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, { cwd: currentDir });
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    child.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve("over");
      } else {
        reject();
      }
    });
  });
}
async function init() {
  const json = await readConfig();
  const { deployCon } = json;
  fs9.rm(gitFolderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("\u5220\u9664 .git \u6587\u4EF6\u5939\u65F6\u51FA\u9519\uFF1A", err);
      return;
    }
    git("init", "-b", `main`).then(() => {
      console.log("init over");
      git(
        "remote",
        "add",
        `${deployCon.remote_store_name}`,
        `${deployCon.remote_store_url}`
      ).then(() => {
        git("add", ".").then(() => {
          git("commit", "-m", "Initial commit").then(() => {
          });
        });
      });
    });
  });
  console.log(getRandomColor("please push to remote rep --force"));
}
async function index() {
  const json = await readConfig();
  const { deployCon } = json;
  git("add", ".").then(() => {
    git("commit", "-m", `${deployCon.commitMessage}`).then(() => {
      git("push", `${deployCon.remote_store_name}`, `${deployCon.branch}`);
    });
  });
}

// src/create/createI18nFile.ts
import fs11 from "fs";
import path11 from "path";

// src/compile/translateMd.ts
import { unified as unified2 } from "unified";
import fs10 from "fs";
import stringify from "remark-stringify";
import markdown from "remark-parse";

// src/utils/translate.ts
import crypto from "crypto";
import fetch from "node-fetch";
import "dotenv/config";
var URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";
var APPID = process.env.APPID;
var SIGN = process.env.SIGN;
var salt = "1435660288";
console.log(`APPID: ${APPID}, SIGN: ${SIGN}`);
function utf8Encode(str) {
  return Buffer.from(
    //该死的加号
    encodeURIComponent(str),
    "utf-8"
  ).toString();
}
function generateSignature(appid, q, salt2, secretKey) {
  const str1 = `${appid}${q}${salt2}${secretKey}`;
  const sign = crypto.createHash("md5").update(str1, "utf8").digest("hex");
  return sign;
}
async function translateWord(q) {
  if (!APPID || !SIGN) {
    throw new Error("no APPID or no SIGN");
  } else {
    const sign = generateSignature(APPID, q, salt, SIGN);
    const from = "zh";
    const to = "en";
    const finallyUrl = URL + `?q=${utf8Encode(q)}&from=${from}&to=${to}&appid=${APPID}&salt=${salt}&sign=${sign}`;
    try {
      const rep = await fetch(finallyUrl);
      const data = await rep.json();
      console.log("data:", data);
      const result = data.trans_result;
      return result[0].dst;
    } catch (e) {
      console.error(e);
      return "error";
    }
  }
}

// src/compile/translateMd.ts
import { visit as visit2 } from "unist-util-visit";
import path10 from "path";
import frontmatter from "remark-frontmatter";
var _postFolder2 = path10.join(basePath, "/_posts");
function translateNode(translation) {
  return async (tree) => {
    visit2(tree, "text", (node) => {
      if (node.value) {
        console.log(node);
        translation.push({ src: node.value.replace(/\n/g, ""), dst_en: "" });
      }
    });
    for (const item of translation) {
      const dst = await translateWord(item.src);
      item.dst_en = dst;
    }
    return tree;
  };
}
async function translateMd(file) {
  const translation = [];
  const filePath = path10.join(_postFolder2, `${file}.md`);
  const fileContent = fs10.readFileSync(filePath, "utf-8");
  const processor = unified2().use(markdown).use(frontmatter).use(stringify).use(translateNode, translation);
  await processor.process(fileContent);
  return translation;
}

// src/create/createI18nFile.ts
var i18nFolder = path11.join(basePath, "/app/i18n/locales");
async function createI18nFile(file) {
  const zh = {};
  const en = {};
  const tanslation = await translateMd(file);
  tanslation.forEach((item, index2) => {
    zh[index2] = item.src;
    en[index2] = item.dst_en;
  });
  fs11.writeFileSync(
    path11.join(i18nFolder, "zh-CN", `essay-${file}.json`),
    JSON.stringify(zh, null, 2)
  );
  fs11.writeFileSync(
    path11.join(i18nFolder, "en-US", `essay-${file}.json`),
    JSON.stringify(en, null, 2)
  );
}

// src/node/cli.ts
var cli = cac();
cli.command("compile [project]", "mdToTsx").option("-a, --all", "Compile all projects").action(async (project, options) => {
  const { all } = options;
  const files = all ? await compileFile() : await compileFile(project);
  writeFile(files);
  writeFileData();
});
cli.command("create [project]", "create the new essay").action((project) => {
  createEssay(currentDate, project);
  createImgs(project);
});
cli.command("remove [project]", "remove the new essay").action((project) => {
  removePage(project);
});
cli.command("init", "for deploy").action(() => {
  init();
});
cli.command("deploy", "deploy the new essay").action(() => {
  index();
});
cli.command("t", "\u6D4B\u8BD5").action(() => {
  console.log(`\u5F00\u53D1 \u26A1\uFE0F\u26A1\uFE0F\u26A1\uFE0F`);
});
cli.command("translate [file]", "translate the file").action(async (file) => {
  await createI18nFile(file);
});
cli.parse();
//# sourceMappingURL=index.js.map