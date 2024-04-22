import path from "path";
import fs from "fs";
import { basePath } from "../constant/content";
import { compileFile } from "../compile/extractMd";
import { transformType } from "../utils/transformType";
import { sortByDate } from "../utils/sortByDate";
export function writeFileData() {
  const fileDataPath = path.join(
    `${basePath}/app/[language]/lib/`,
    "fileData.js"
  );
  const fileDataFolderPath = `${basePath}/app/[language]/lib/`;
  fs.mkdir(fileDataFolderPath, { recursive: true }, async (error) => {
    if (error) {
      console.log(error);
    } else {
      const fileData = sortByDate(transformType(await compileFile()));
      fs.writeFile(
        fileDataPath,
        `/**
        * @property {string} title - 文章标题
        * @property {string} date - 文章日期
        * @property {string} categories - 文章分类：Project,Weekly,Life,Technology
        * @property {string} excerpt - 概述
        * @property {string} html - 解析过后的html
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
