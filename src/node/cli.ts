import { readFile, writeFile } from "../compile/extractMd";

async function compile() {
  const files = await readFile();
  writeFile(files);
}
compile();
