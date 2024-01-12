import path from "path";
import fs from "fs";
import { makeEssay } from "../compile/content";
import { getRandomColor } from "../utils/randomColor";

export function createEssay(date: string, title: string) {
  const basePath = path.join(__dirname, "..");
  const _postsPath = path.join(basePath, "/_posts");
  const filePath = path.join(_postsPath, `${title}.md`);
  const mdFile = makeEssay(title, date);
  fs.mkdir(_postsPath, { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    } else {
      fs.writeFile(filePath, mdFile, (err) => {
        if (err) {
          console.error("Error creating file:", err);
        } else {
          console.log(`Essay ${getRandomColor(title)} created successfully.`);
        }
      });
    }
  });
}
