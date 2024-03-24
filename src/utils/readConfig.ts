import fs from "fs";
import os from "os";
import path from "path";
import { basePath } from "../constant/content";
import { Config } from "../../types/config";

// JSON 文件路径

export function readConfig(): Promise<Config> {
  const jsonFilePath = path.join(basePath, "_blog.json");
  return new Promise((resolve, reject) => {
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    });
  });
}
