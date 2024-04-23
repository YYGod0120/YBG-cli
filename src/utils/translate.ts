import crypto from "crypto";
import fetch from "node-fetch";
import "dotenv/config";
console.log(process.env.APPID);

const URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";
const APPID = process.env.APPID;
const SIGN = process.env.SIGN;
const salt = "yy";
function utf8Encode(str: string): string {
  return Buffer.from(str, "utf-8").toString("hex");
}
function md5(appid, q, salt, sign) {
  const str1 = appid + q + salt + sign;
  const md5Hash = crypto.createHash("md5").update(str1).digest("hex");

  return md5Hash;
}
export async function translateWord(q: string) {
  const sign = md5(APPID, q, salt, SIGN);
  const from = "zh";
  const to = "en";
  const searchWord = utf8Encode(q);
  const finallyUrl =
    URL +
    `?q=${searchWord}` +
    `&form=${from}` +
    `&to=${to}` +
    `&appid=${APPID}` +
    `&salt=${salt}` +
    `&sign=${sign}`;
  //   console.log(APPID, SIGN);

  //   const rep = await fetch(finallyUrl);
  //   console.log(await rep.json());
}
