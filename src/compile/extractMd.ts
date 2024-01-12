import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import { UTCToString } from "../utils/time";
import path from "path";
import { processHTML } from "./content";
const basePath = path.join(__dirname, "..");
const _postFolder = path.join(basePath, "/_posts");

export type mdFile = {
  mdMatter: matter.GrayMatterFile<string>;
  mdHtml: string;
};

export async function fileToJSON(): Promise<mdFile[]> {
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
    console.log(`Essay product`);
    files.push({ mdMatter: newMatter, mdHtml: processHTML(htmlText) });
  }

  return files;
}
