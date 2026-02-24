# ZUFEComp Agent Guidelines

## 项目结构
- `apps/web`: Vue3 + Vite + TS 前端
- `apps/api`: Express + TS 后端
- `data/db.json`: lowdb 数据文件
- `docs`: 项目文档与答辩材料
- `uploads`: 上传目录

## 常用命令
- 安装依赖：`pnpm install`
- 开发启动：`pnpm dev`
- 构建：`pnpm build`
- 代码检查：`pnpm lint`
- 测试：`pnpm test`

## 编码规范
- 全仓库 TypeScript 优先，避免 any
- 接口返回结构统一：`{ success, data?, message?, meta? }`
- 后端路由按模块拆分，鉴权与权限用中间件
- 前端页面需处理 loading / error / empty 三态
- 表单必须加校验，状态字段统一用枚举值

## 提交标准
- 提交前必须运行 lint 与 test（或 healthcheck）
- 文档改动需同步更新 `docs/` 下相关说明
- 功能需保证本地离线可运行
