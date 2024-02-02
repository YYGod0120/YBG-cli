import { fileToJSON } from "../compile/extractMd";
import { writeFile } from "../create/mdToPage";
import cac from "cac";
import { createEssay } from "../create/createMD";
import { currentDate } from "../utils/time";
import { createImgs } from "../create/createImg";
import { removePage } from "../remove/removePage";
import { writeFileData } from "../create/createFileData";
const cli = cac();
cli.command("compile", "mdToTsx").action(async () => {
  const files = await fileToJSON();
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

cli.parse();
