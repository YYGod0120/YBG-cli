# 开发指南

`pnpm start`：进行 TS 编译，实时热更新
`pnpm link -g`: 全局链接 CLI
`ybg t`: 测试是否链接成功

`npm publish`：最后发版

**注意：记得改版本！！！**
**注意：记得编译完测试完再发版！！！**

# CLI 命令

## ybg compile [name]

编译 `_posts`下的名字为 name 的文章(默认为全部文章)

> 适配 NextJS(默认路径是/app/essay/[time]/[name])

## ybg create <name>

创建文章(默认在`_posts`下)及文章图片文件夹(默认在 public/img/[name])

## ybg remove <name>

删除文章并重新生成文章页

## ybg translate <name>

对指定文章进行英文翻译（暂时只支持翻译中译英）

> 注意翻译通过百度 API 进行翻译，需要在博客根目录下`.env`文件中写入自己的 APPID 和 SIGN。

## 部署相关

### ybg init

自定义部署路径仓库以及初始化(需要在根目录下写\_deploy 配置文件)

```json
{
  "deployCon": {
    "commitMessage": "docs: new essay",
    "remote_store_url": "https://github.com/YYGod0120/yyblog.git",
    "remote_store_name": "origin",
    "branch": "main"
  }
}
```

### ybg deploy

根据\_deploy 配置进行默认部署
