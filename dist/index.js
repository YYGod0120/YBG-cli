var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/compile/extractMd.ts
var import_fs = __toESM(require("fs"));
var import_gray_matter = __toESM(require("gray-matter"));
var import_marked = require("marked");

// src/utils/time.ts
var import_dayjs = __toESM(require("dayjs"));
function UTCToString(date) {
  return (0, import_dayjs.default)(date).format("YYYY-MM-DD");
}
var currentDate = (0, import_dayjs.default)().format("YYYY-MM-DD");

// src/compile/extractMd.ts
var import_path = __toESM(require("path"));

// src/compile/content.ts
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
  display: inline-block;
  position: relative;
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
a::after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: #4e5969;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

a:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
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
    import "../essay.css";
    import Image from "next/image";
    
    export default function Page() {
      return (
        <div className=" mt-8 bg-white w-[60vw] flex flex-col items-start text-lg">
          <span className="text-4xl text-left px-24 pt-12 text-visit-font font-bold">
            ${file.mdMatter.data.title}
          </span>
          <span className=" text-[#86909C] px-24 pt-5 text-xl">
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
function processHTML(html) {
  const replacedText = html.replace(
    /<img([^>]*)src="(\.\.\/public\/[^"]+)"([^>]*)>/g,
    '<Image$1src="$2"$3 />'
  );
  const finalText = replacedText.replace(/\.\.\/public\//g, "/");
  return finalText;
}

// src/compile/extractMd.ts
var basePath = import_path.default.join(__dirname, "..");
var _postFolder = import_path.default.join(basePath, "/_posts");
async function fileToJSON() {
  let files = [];
  const fileList = import_fs.default.readdirSync(_postFolder);
  for (const file of fileList) {
    const filePath = import_path.default.join(_postFolder, file);
    const fileContent = import_fs.default.readFileSync(filePath, "utf-8");
    const parsedFile = (0, import_gray_matter.default)(fileContent);
    const newMatter = {
      ...parsedFile,
      data: { ...parsedFile.data, date: UTCToString(parsedFile.data.date) }
    };
    const htmlText = await (0, import_marked.marked)(parsedFile.content);
    console.log(`Essay product`);
    files.push({ mdMatter: newMatter, mdHtml: processHTML(htmlText) });
  }
  return files;
}

// src/create/createPage.ts
var import_path3 = __toESM(require("path"));
var import_fs3 = __toESM(require("fs"));

// src/create/EssayCss.ts
var import_path2 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));
var basePath2 = import_path2.default.join(__dirname, "..");
function writeCSS() {
  const filePath = import_path2.default.join(basePath2, "/app/essay/essay.css");
  import_fs2.default.access(filePath, import_fs2.default.constants.F_OK, (err) => {
    if (err) {
      import_fs2.default.writeFile(filePath, essayCss, (writeErr) => {
        if (writeErr)
          throw writeErr;
      });
    }
  });
}

// src/create/createPage.ts
var import_rimraf = require("rimraf");

// src/utils/randomColor.ts
var import_picocolors = require("picocolors");
function getRandomColor(string) {
  const colors = [import_picocolors.cyan, import_picocolors.yellow, import_picocolors.green, import_picocolors.blue, import_picocolors.red];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex](string);
}

// src/create/createPage.ts
var basePath3 = import_path3.default.join(__dirname, "..");
function writeFile(files) {
  files.forEach(async (file) => {
    const foldPath = `${basePath3}/app/essay/${file.mdMatter.data.date}/${file.mdMatter.data.title}`;
    const filePath = import_path3.default.join(foldPath, "page.tsx");
    const content = await makeEssayPage(file);
    (0, import_rimraf.rimrafSync)(`${basePath3}/app/essay/`, {
      preserveRoot: false
    });
    import_fs3.default.mkdir(foldPath, { recursive: true }, (error) => {
      if (error) {
        console.log(error);
      } else {
        writeCSS();
        import_fs3.default.writeFile(filePath, content, (err) => {
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
var import_cac = __toESM(require("cac"));

// src/create/createMD.ts
var import_path4 = __toESM(require("path"));
var import_fs4 = __toESM(require("fs"));
function createEssay(date, title) {
  const basePath6 = import_path4.default.join(__dirname, "..");
  const _postsPath = import_path4.default.join(basePath6, "/_posts");
  const filePath = import_path4.default.join(_postsPath, `${title}.md`);
  const mdFile = makeEssay(title, date);
  import_fs4.default.mkdir(_postsPath, { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    } else {
      import_fs4.default.writeFile(filePath, mdFile, (err) => {
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
var import_path5 = __toESM(require("path"));
var import_fs5 = __toESM(require("fs"));
var basePath4 = import_path5.default.join(__dirname, "..");
function createImgs(title) {
  const foldPath = `${basePath4}/public/imgs/${title}`;
  import_fs5.default.mkdir(foldPath, { recursive: true }, (error) => {
    if (error)
      console.log(error);
  });
}

// src/remove/removePage.ts
var import_path6 = __toESM(require("path"));
var import_fs6 = __toESM(require("fs"));
var import_rimraf2 = require("rimraf");
var basePath5 = import_path6.default.join(__dirname, "..");
function removePage(file) {
  const MdPath = import_path6.default.join(basePath5, `/_posts/${file}.md`);
  import_fs6.default.unlink(MdPath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`File-${file} deleted successfully`);
    }
  });
  const foldPath = `${basePath5}/public/imgs/${file}`;
  (0, import_rimraf2.rimraf)(foldPath, { preserveRoot: false });
}

// src/node/cli.ts
var cli = (0, import_cac.default)();
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
