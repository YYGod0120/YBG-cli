import { compileFile } from "../compile/extractMd";
import { writeFile } from "../create/writeFiles";
import cac from "cac";
import { createEssay } from "../create/createMD";
import { currentDate } from "../utils/time";
import { createImgs } from "../create/createImg";
import { removePage } from "../remove/removePage";
import { writeFileData } from "../create/createFileData";
import { index, init } from "../deploy";
import { createI18nFile } from "../create/createI18nFile";
const cli = cac();
cli
  .command("compile [project]", "mdToTsx")
  .option("-a, --all", "Compile all projects")
  .action(async (project, options) => {
    const { all } = options;
    const files = all ? await compileFile() : await compileFile(project);
    writeFile(files);
    // writeFileData();
  });
cli.command("create [project]", "create the new essay").action((project) => {
  createEssay(currentDate, project);
  createImgs(project);
});
cli.command("remove [project]", "remove the new essay").action((project) => {
  removePage(project);
});
cli.command("init", "for deploy").action(() => {
  init();
});
cli.command("deploy", "deploy the new essay").action(() => {
  index();
});
cli.command("t", "测试").action(() => {
  console.log(`开发 ⚡️⚡️⚡️`);
});

cli.command("translate [file]", "translate the file").action(async (file) => {
  await createI18nFile(file);
});
cli.parse();
