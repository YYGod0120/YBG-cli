import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import { UTCToString } from "./time";
import path from "path";
// import chalk from "chalk";
import { makeEssayPage, processHTML } from "./essayContent";
const _postFolder = path.join("D:/YBG-cli/_posts");

export type mdFile = {
  mdMatter: matter.GrayMatterFile<string>;
  mdHtml: string;
};

export async function readFile(): Promise<mdFile[]> {
  let files: mdFile[] = [];

  const fileList = fs.readdirSync(_postFolder);

  for (const file of fileList) {
    const filePath = path.join(_postFolder, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedFile = matter(fileContent);

    const newMatter = {
      ...parsedFile,
      data: { ...parsedFile.data, date: UTCToString(parsedFile.data.date) },
    };
    const htmlText = await marked(parsedFile.content);
    console.log(`Essay  product`);
    files.push({ mdMatter: newMatter, mdHtml: processHTML(htmlText) });
  }

  return files;
}

export function writeFile(files: mdFile[]) {
  files.forEach(async (file) => {
    const foldPath = `D:/YBG-cli/app/essay/${file.mdMatter.data.date}`;
    const filePath = path.join(foldPath, "page.tsx");
    const content = await makeEssayPage(file);
    fs.mkdir(foldPath, { recursive: true }, (error) => {
      if (error) {
        console.log(error);
      } else {
        fs.writeFile(filePath, content, (err) => {
          if (err) {
            console.error("Error creating file:", err);
          } else {
            console.log("File created successfully.");
          }
        });
      }
    });
  });
}
