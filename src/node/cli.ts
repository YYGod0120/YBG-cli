import { fileToJSON } from "../compile/extractMd";
import { writeFile } from "../create/createPage";
import cac from "cac";
import { createEssay } from "../create/createMD";
import { currentDate } from "../utils/time";
import { createImgs } from "../create/createImg";
import { removePage } from "../remove/removePage";
const cli = cac();
cli.command("compile", "mdToTsx").action(async () => {
  const files = await fileToJSON();
  writeFile(files);
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
