---
name: hlbrecord
description: 批量火脸主扫报备技能。支持多商户 ID 批量报备，切换到主扫 H5 模式，401 自动刷新 Token。
---

# 批量火脸主扫报备技能

## 概述

本技能提供火脸主扫报备功能，支持批量商户 ID 报备，切换到主扫 H5 模式。

## 可用脚本

### index.js - 批量主扫报备

**触发词：** `商户 ID1 商户 ID2 ... 报备`

**功能：**
- 批量报备多个商户 ID
- 切换到主扫 H5 模式
- 自动刷新 token（401 时自动重新登录）
- 单个失败不影响其他商户

**输入格式：**
```
104890 104888 103084 报备
```

**输出格式：**
```
📋 批量报备完成（共 X 个）：

✅ 104890 → 主扫 H5 切换成功
✅ 104888 → 主扫 H5 切换成功
❌ 103084 → 主扫 H5 切换失败：xxx
```

**固定参数：**
- `alipayOpenType: 1`
- `wechatOpenType: 1`

**参考文档：**
- `references/api-docs.md` - 火脸 API 接口说明
- `references/record-api.md` - 报备接口文档

## 资源文件

- `scripts/` - 可执行脚本
- `references/` - 文档和配置说明
- `assets/` - 配置模板

## 使用方法

按需加载参考文档：
- 查询 API 细节 → 读 `references/api-docs.md`
- 了解报备接口 → 读 `references/record-api.md`

---

## 技术支持

| 项目 | 信息 |
|------|------|
| **作者** | duheng |
| **技能版本** | v1.0.0 |
| **最后更新** | 2026-04-13 |
| **技能位置** | `~/.openclaw/skills/hlbrecord/` |
