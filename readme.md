# CLI 命令

## ybg compile [name]

编译 `_posts`下的名字为name的文章(默认为全部文章)

> 适配 NextJS(默认路径是/app/essay/[time]/[name])

## ybg create <name>

创建文章(默认在`_posts`下)及文章图片文件夹(默认在 public/img/[name])

## ybg remove <name>

删除文章并重新生成文章页

## 部署相关

### ybg init 

自定义部署路径仓库以及初始化(需要在根目录下写_deploy配置文件)
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

根据_deploy配置进行默认部署
