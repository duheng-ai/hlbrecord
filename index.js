// ===================== OpenClaw 标准技能 =====================
const axios = require('axios');

// ========================
// ⚙️ 配置区域（使用前请核对）
// ========================
const CONFIG = {
  // 火脸运营后台账号配置
  LOGIN: {
    phone: "17681828467",
    password: "DH123456",
    system: "operation",
    type: "password"
  },
  // API 配置
  API: {
    baseUrl: "https://api.lianok.com",
    loginEndpoint: "/common/v1/user/login",        // 登录接口
    modifyEndpoint: "/operation/v1/shopqrcode/modify" // 报备接口
  },
  // 固定请求参数
  FIX_PARAMS: {
    alipayOpenType: 1,
    wechatOpenType: 1
  },
  // 初始 Token
  initialToken: "ca83f4d3812f42688d6052bc4fba5d35"
};

module.exports = {
  meta: {
    id: "batchshopreport",
    name: "批量hlb主扫报备",
    description: "支持多商户ID批量报备，401自动刷新Token，输入：shopNo1 shopNo2 ... 报备",
    version: "1.0.0",
    author: "openclaw"
  },

  // 触发规则：匹配 【多商户ID + 报备】
  triggers: {
    patterns: [/.+\s+报备$/]
  },
  // ========================
  // 自动登录获取新 token
  // ========================
  async getNewToken() {
    try {
      const res = await axios.post(`${CONFIG.API.baseUrl}${CONFIG.API.loginEndpoint}`, {
        password: CONFIG.LOGIN.password,
        phone: CONFIG.LOGIN.phone,
        system: CONFIG.LOGIN.system,
        type: CONFIG.LOGIN.type
      });
      return res.data?.data?.accessToken || null;
    } catch (err) {
      console.error("Token 刷新失败:", err.message);
      return null;
    }
  },

  // ========================
  // 统一请求封装 + 401 自动刷新 + 重试
  // ========================
  async request(url, data, accessToken) {
    try {
      return await axios({
        method: 'post',
        url: url,
        data: data,
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json',
          'client': 'WEB'
        }
      });
    } catch (err) {
      // 401 自动刷新token并重试
      if (err.response?.status === 401) {
        const newToken = await this.getNewToken();
        if (!newToken) throw new Error('登录已失效，自动刷新token失败');
        
        // 重试请求
        return axios({
          method: 'post',
          url: url,
          data: data,
          headers: {
            'accessToken': newToken,
            'Content-Type': 'application/json',
            'client': 'WEB'
          }
        });
      }
      throw err;
    }
  },

  // ========================
  // 核心执行入口：批量报备
  // ========================
  async execute(context) {
    const { userMessage } = context;
    const userMsg = userMessage.trim();
    const API_URL = `${CONFIG.API.baseUrl}${CONFIG.API.modifyEndpoint}`;
    let accessToken = CONFIG.initialToken;

    try {
      // 1. 格式校验 + 提取所有店铺编号（支持空格/换行分隔 批量输入）
      const reg = /^(.+?)\s+报备$/s;
      const match = userMsg.match(reg);
      if (!match) {
        return { text: "❌ 格式错误！\n请输入：商户ID1 商户ID2 ... 报备" };
      }

      // 提取并分割批量shopNo（支持空格、换行、多空格分隔）
      const shopNoList = match[1].trim().split(/\s+/).filter(item => item);
      if (shopNoList.length === 0) {
        return { text: "❌ 未提取到有效商户ID" };
      }

      // 2. 批量执行报备（单个失败不影响其他）
      const resultList = [];
      for (const shopNo of shopNoList) {
        try {
          const requestData = {
            ...CONFIG.FIX_PARAMS,
            shopNo: shopNo
          };

          // 发送请求（自带Token刷新）
          await this.request(API_URL, requestData, accessToken);
          resultList.push(`✅ ${shopNo} → 主扫H5切换成功`);
        } catch (err) {
          resultList.push(`❌ ${shopNo} → 主扫H5切换失败：${err.message.slice(0, 30)}`);
        }
      }

      // 3. 汇总返回结果
      return {
        text: `📋 批量报备完成（共${shopNoList.length}个）：\n\n` + resultList.join('\n')
      };

    } catch (err) {
      return { text: `❌ 脚本执行异常：${err.message}` };
    }
  }
};
