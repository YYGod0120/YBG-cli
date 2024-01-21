import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";

import { UTCToString } from "../utils/time";
import path from "path";
import { basePath } from "../constant/content";
import { compileHTML } from "./HtmlToNext";
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
    const htmlText = compileHTML(await marked(parsedFile.content));

    console.log(file);

    files.push({ mdMatter: newMatter, mdHtml: htmlText });
  }

  return files;
}
