import fs from "fs";
import path from "path";
import { basePath } from "../constant/content";
import { translateMd } from "../compile/translateMd";
const i18nFolder = path.join(basePath, "/app/i18n/locales");

export async function createI18nFile(file: string) {
  const zh = {};
  const en = {};
  const tanslation = await translateMd(file);
  tanslation.forEach((item, index) => {
    zh[index] = item.src;
    en[index] = item.dst_en;
  });
  fs.writeFileSync(
    path.join(i18nFolder, "zh-CN", `essay-${file}.json`),
    JSON.stringify(zh, null, 2)
  );
  fs.writeFileSync(
    path.join(i18nFolder, "en-US", `essay-${file}.json`),
    JSON.stringify(en, null, 2)
  );
}
