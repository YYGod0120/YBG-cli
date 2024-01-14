import path from "path";
import fs from "fs";
import { rimraf } from "rimraf";
import { basePath } from "../locale/content";

export function removePage(file: string) {
  //   const PagePath = `${basePath}/app/essay/${file.mdMatter.data.date}`;
  const MdPath = path.join(basePath, `/_posts/${file}.md`);
  fs.unlink(MdPath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`File-${file} deleted successfully`);
    }
  });
  const foldPath = `${basePath}/public/imgs/${file}`;
  rimraf(foldPath, { preserveRoot: false });
}
