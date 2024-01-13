import path from "path";
import fs from "fs";
import { basePath } from "../compile/content";

export function createImgs(title: string) {
  const foldPath = `${basePath}/public/imgs/${title}`;
  fs.mkdir(foldPath, { recursive: true }, (error) => {
    if (error) console.log(error);
  });
}
