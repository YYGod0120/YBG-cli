import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { readConfig } from "../utils/readConfig";
import { getRandomColor } from "../utils/randomColor";
const currentDir = process.cwd();
const gitFolderPath = path.join(currentDir, ".git");
function git(...args) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, { cwd: currentDir });
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    child.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve("over");
      } else {
        reject();
      }
    });
  });
}
// * 自定义部署路径仓库以及初始化
export async function init() {
  const json = await readConfig();
  const { deployCon } = json;
  // 删除 .git 文件夹
  fs.rm(gitFolderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("删除 .git 文件夹时出错：", err);
      return;
    }
    git("init", "-b", `main`).then(() => {
      console.log("init over");
      git(
        "remote",
        "add",
        `${deployCon.remote_store_name}`,
        `${deployCon.remote_store_url}`
      ).then(() => {
        git("add", ".").then(() => {
          git("commit", "-m", "Initial commit").then(() => {});
        });
      });
    });
  });
  console.log(getRandomColor("please push to remote rep --force"));
}

export async function index() {
  const json = await readConfig();
  const { deployCon } = json;
  git("add", ".").then(() => {
    git("commit", "-m", `${deployCon.commitMessage}`).then(() => {
      git("push", `${deployCon.remote_store_name}`, `${deployCon.branch}`);
    });
  });
}
