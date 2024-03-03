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
