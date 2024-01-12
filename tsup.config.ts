import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/node/cli.ts",
  },
  // 产物格式，cjs 格式
  format: ["cjs"],
  // 目标语法
  target: "es2020",
});
