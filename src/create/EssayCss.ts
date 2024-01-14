import path from "path";
import fs from "fs";
import { basePath, essayCss } from "../locale/content";
export function writeCSS() {
  const filePath = path.join(basePath, "/app/essay/essay.css");
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在，写入文件
      fs.writeFile(filePath, essayCss, (writeErr) => {
        if (writeErr) throw writeErr;
      });
    }
  });
}
