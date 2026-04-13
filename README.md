# 批量火脸主扫报备技能 (hlbrecord)

支持多商户 ID 批量报备，切换到主扫 H5 模式，401 自动刷新 Token

---

## 📦 技能信息

| 项目 | 值 |
|------|-----|
| **技能 ID** | `batchshopreport` |
| **技能名称** | 批量 hlb 主扫报备 |
| **技能目录名** | `hlbrecord` |
| **版本** | v1.0.0 |
| **作者** | duheng |
| **更新日期** | 2026-04-13 |
| **GitHub** | https://github.com/duheng-ai/hlbrecord |
| **位置** | `~/.openclaw/skills/hlbrecord/` |

---

## 🚀 功能特性

- ✅ **批量报备** - 支持多商户 ID 同时报备
- ✅ **401 自动刷新 token** - Token 失效时自动重新登录
- ✅ **单个失败不影响其他** - 批量处理，独立容错
- ✅ **固定参数配置** - alipayOpenType/wechatOpenType 自动设置

---

## 📥 快速安装

### Windows (PowerShell)

**一条命令安装（推荐）：**
```powershell
powershell -Command "iwr -useb https://raw.githubusercontent.com/duheng-ai/hlbrecord/main/install.ps1 | iex"
```

**或分步执行：**
```powershell
# 下载安装脚本
iwr -useb https://raw.githubusercontent.com/duheng-ai/hlbrecord/main/install.ps1 -OutFile install.ps1

# 运行安装
powershell -ExecutionPolicy Bypass -File install.ps1
```

### Linux / macOS (Bash)

```bash
curl -fsSL https://raw.githubusercontent.com/duheng-ai/hlbrecord/main/install.sh | bash
```

### 手动安装

```bash
# 1. 克隆仓库
git clone https://github.com/duheng-ai/hlbrecord.git ~/.openclaw/workspace/skills/hlbrecord

# 2. 安装依赖
cd ~/.openclaw/workspace/skills/hlbrecord
npm install

# 3. 配置账号密码
# 编辑 index.js，修改 CONFIG 中的 phone 和 password

# 4. 重启网关
openclaw gateway restart
```

---

## 📝 使用示例

### 单个商户报备

**输入：**
```
104890 报备
```

**输出：**
```
📋 批量报备完成（共 1 个）：

✅ 104890 → 主扫 H5 切换成功
```

### 多个商户批量报备

**输入：**
```
104890 104888 103084 报备
```

**输出：**
```
📋 批量报备完成（共 3 个）：

✅ 104890 → 主扫 H5 切换成功
✅ 104888 → 主扫 H5 切换成功
✅ 103084 → 主扫 H5 切换成功
```

### 部分失败场景

**输入：**
```
104890 999999 报备
```

**输出：**
```
📋 批量报备完成（共 2 个）：

✅ 104890 → 主扫 H5 切换成功
❌ 999999 → 主扫 H5 切换失败：商户不存在
```

---

## ⚙️ 配置说明

### 火脸账号配置

编辑 `index.js`，修改顶部配置区域：

```javascript
const CONFIG = {
  // 火脸运营后台账号配置
  LOGIN: {
    phone: "17681828467",    // ⚠️ 请修改为您的手机号
    password: "DH123456",    // ⚠️ 请修改为您的密码
    system: "operation",
    type: "password"
  },
  // API 配置
  API: {
    baseUrl: "https://api.lianok.com",
    loginEndpoint: "/common/v1/user/login",
    modifyEndpoint: "/operation/v1/shopqrcode/modify"
  },
  // 固定请求参数
  FIX_PARAMS: {
    alipayOpenType: 1,
    wechatOpenType: 1
  },
  // 初始 Token
  initialToken: "ca83f4d3812f42688d6052bc4fba5d35"
};
```

> ⚠️ **重要**: 
> - 必须修改 `phone` 和 `password` 为您自己的火脸运营后台账号
> - 默认配置仅用于演示，不修改将导致报备失败

---

## 🧪 测试方法

### 方法 1：运行测试脚本

```bash
cd ~/.openclaw/skills/hlbrecord
node run.js "104890 104888 报备"
```

### 方法 2：在 OpenClaw 中调用

发送消息：
```
104890 104888 报备
```

---

## 📁 文件结构

```
hlbrecord/
├── README.md              # 本文件（使用说明）
├── CHANGELOG.md           # 更新日志
├── SKILL.md               # OpenClaw 技能描述文件
├── 更新报告-v1.0.0.md     # 用户版更新报告
├── index.js               # 技能主程序
├── run.js                 # 测试运行脚本
├── install.ps1            # Windows 安装脚本
├── install.sh             # Linux/macOS 安装脚本
├── package.json           # 依赖配置
└── package-lock.json      # 依赖锁定
```

---

## 🔧 API 接口

| 接口 | 路径 | 说明 |
|------|------|------|
| 登录 | `POST /common/v1/user/login` | 获取 accessToken |
| 报备 | `POST /operation/v1/shopqrcode/modify` | 切换主扫 H5 |

### 报备请求参数

```json
{
  "shopNo": "104890",
  "alipayOpenType": 1,
  "wechatOpenType": 1
}
```

---

## 🐛 常见问题

### Token 失效

**现象：** 报备失败，提示未授权

**解决：** 技能会自动刷新 token，无需手动处理

### 商户 ID 无效

**现象：** 返回"商户不存在"

**解决：** 检查商户 ID 是否正确

---

## 📞 技术支持

| 项目 | 信息 |
|------|------|
| **作者** | duheng |
| **技能版本** | v1.0.0 |
| **最后更新** | 2026-04-13 |
| **GitHub** | https://github.com/duheng-ai/hlbrecord |
| **技能位置** | `~/.openclaw/skills/hlbrecord/` |

---

## 📄 许可证

MIT License
