import path from "path";
import fs from "fs";
import { basePath, makeEssayPage } from "../constant/content";
import { mdFile } from "../compile/extractMd";
import { writeCSS } from "./EssayCss";
import { rimrafSync } from "rimraf";
import { getRandomColor } from "../utils/randomColor";

export function writeFile(files: mdFile[]) {
  rimrafSync(`${basePath}/app/essay`, {
    preserveRoot: false,
  });
  files.forEach(async (file, index) => {
    const foldPath = `${basePath}/app/[language]/essay/${
      file.mdMatter.data.date
    }/${index + 1}`;
    const filePath = path.join(foldPath, "page.tsx");
    const content = await makeEssayPage(file);

    fs.mkdir(foldPath, { recursive: true }, (error) => {
      if (error) {
        console.log(error);
      } else {
        writeCSS();
        fs.writeFile(filePath, content, (err) => {
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
