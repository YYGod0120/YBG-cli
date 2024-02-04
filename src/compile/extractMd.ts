import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import { UTCToString } from "../utils/time";
import path from "path";
import { basePath, makeImportPic } from "../constant/content";
import { HtmlToNext } from "./HtmlToNext";
const _postFolder = path.join(basePath, "/_posts");

export type mdFile = {
  mdMatter: matter.GrayMatterFile<string>;
  mdHtml: string;
  other?: {
    picPath: string;
  };
};

export async function compileFile(): Promise<mdFile[]> {
  let compiledFiles: mdFile[] = [];
  const fileList = fs.readdirSync(_postFolder);
  for (const file of fileList) {
    const filePath = path.join(_postFolder, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedFile = matter(fileContent);
    const newMatter = {
      ...parsedFile,
      data: { ...parsedFile.data, date: UTCToString(parsedFile.data.date) },
    };
    const picPath = makeImportPic(await marked(parsedFile.content));
    const htmlText = HtmlToNext(await marked(parsedFile.content));
    compiledFiles.push(
      picPath
        ? {
            mdMatter: newMatter,
            mdHtml: htmlText,
            other: {
              picPath: picPath,
            },
          }
        : { mdMatter: newMatter, mdHtml: htmlText }
    );
  }
  return compiledFiles;
}
