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
  mdMatter: matter.GrayMatterFile<string>;
  mdHtml: string;
  mdEnHtml?: string;
  other?: {
    picPath: string;
  };
};

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
