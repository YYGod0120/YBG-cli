import crypto from "crypto";
import fetch from "node-fetch";
import "dotenv/config";

const URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";
const APPID = process.env.APPID;
const SIGN = process.env.SIGN;
const salt = "1435660288";

console.log(`APPID: ${APPID}, SIGN: ${SIGN}`);
interface TranslateRep {
  to: string;
  from: string;
  trans_result: { src: string; dst: string }[];
}
function utf8Encode(str: string): string {
  return Buffer.from(
    //该死的加号
    encodeURIComponent(str),
    "utf-8"
  ).toString();
}

function generateSignature(
  appid: string,
  q: string,
  salt: string,
  secretKey: string
): string {
  // 拼接字符串1
  const str1 = `${appid}${q}${salt}${secretKey}`;
  // 计算签名（MD5加密）
  const sign = crypto.createHash("md5").update(str1, "utf8").digest("hex");
  return sign;
}
export async function translateWord(q: string): Promise<string> {
  if (!APPID || !SIGN) {
    throw new Error("no APPID or no SIGN");
  } else {
    const sign = generateSignature(APPID, q, salt, SIGN);
    const from = "zh";
    const to = "en";
    const finallyUrl =
      URL +
      `?q=${utf8Encode(q)}` +
      `&from=${from}` +
      `&to=${to}` +
      `&appid=${APPID}` +
      `&salt=${salt}` +
      `&sign=${sign}`;
    try {
      const rep = await fetch(finallyUrl);
      const data: TranslateRep = (await rep.json()) as TranslateRep;
      console.log("data:", data);
      const result = data.trans_result;
      return result[0].dst;
    } catch (e) {
      console.error(e);
      return "error";
    }
  }
}
