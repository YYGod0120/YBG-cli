import { compileFile } from "../compile/extractMd";
import { writeFile } from "../create/writeFiles";
import cac from "cac";
import { createEssay } from "../create/createMD";
import { currentDate } from "../utils/time";
import { createImgs } from "../create/createImg";
import { removePage } from "../remove/removePage";
import { writeFileData } from "../create/createFileData";
import { index, init } from "../deploy";
import { translateWord } from "../utils/translate";
const cli = cac();
cli
  .command("compile [project]", "mdToTsx")
  .option("-a, --all", "Compile all projects")
  .action(async (project, options) => {
    const { all } = options;
    const files = all ? await compileFile() : await compileFile(project);

    writeFile(files);
    writeFileData();
  });
cli
  .command("create [project]", "create the new essay")
  .action(async (project) => {
    createEssay(currentDate, project);
    createImgs(project);
  });
cli
  .command("remove [project]", "remove the new essay")
  .action(async (project) => {
    removePage(project);
  });
cli.command("init", "for deploy").action(async () => {
  init();
});
cli.command("deploy", "deploy the new essay").action(async () => {
  index();
});
cli.command("t", "翻译").action(async () => {
  translateWord(`该怎么处理md文档咋办`);
});
cli.parse();
