import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import { UTCToString } from "../utils/time";
import path from "path";
import { basePath, makeImportPic } from "../constant/content";
import { HtmlToNext } from "./HtmlToNext";
import { translateWord } from "../utils/translate";
const _postFolder = path.join(basePath, "/_posts");

export type mdFile = {
  id: string;
  mdMatter: matter.GrayMatterFile<string>;
  mdHtml: string;
  mdEnHtml?: string;
  other?: {
    picPath: string;
  };
};
// * hash唯一化
function simpleHash(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash += input.charCodeAt(i);
  }
  return JSON.stringify(hash % 1000); // 取模以确保哈希值在一定范围内
}
export async function compileFile(project?: string): Promise<mdFile[]> {
  let compiledFiles: mdFile[] = [];
  let fileList = fs.readdirSync(_postFolder);

  if (project) {
    fileList = fileList.filter((file) => {
      return file === `${project}.md`;
    });
  }
  for (const file of fileList) {
    const filePath = path.join(_postFolder, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedFile = matter(fileContent);
    // const enText = await translateWord(parsedFile.content);
    const newMatter = {
      ...parsedFile,
      data: { ...parsedFile.data, date: UTCToString(parsedFile.data.date) },
    };
    const picPath = makeImportPic(await marked(parsedFile.content));
    const htmlText = HtmlToNext(await marked(parsedFile.content));
    // const enHtmlText = HtmlToNext(await marked(enText));

    //新增翻译
    compiledFiles.push(
      picPath
        ? {
            id: simpleHash(file),
            mdMatter: newMatter,
            mdHtml: htmlText,
            other: {
              picPath: picPath,
            },
          }
        : { id: simpleHash(file), mdMatter: newMatter, mdHtml: htmlText }
    );
  }

  return compiledFiles;
}
