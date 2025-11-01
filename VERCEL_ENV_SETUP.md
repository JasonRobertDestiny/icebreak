# ⚠️ Vercel部署前必读

## 环境变量配置（构建前必须完成）

Vercel部署失败的原因：**缺少必需的环境变量**

### 解决方案

**在Vercel项目设置中添加环境变量**：

1. 打开你的Vercel项目页面
2. 点击 **Settings** → **Environment Variables**
3. 添加以下变量：

| Name | Value | Environment |
|------|-------|-------------|
| `DEEPSEEK_API_KEY` | `sk-UtNKyzSjxh7kmcDejDGtGSFsOhzsUqpVnc5y9at5OEgMns4W` | Production ✓ Preview ✓ Development ✓ |

4. 点击 **Save**
5. 返回 **Deployments** → 点击右上角 **Redeploy** → 选择 **Use existing Build Cache** → **Redeploy**

### 为什么需要这个环境变量？

`DEEPSEEK_API_KEY` 用于调用DeepSeek AI生成破冰话题。没有这个key，API路由在构建时会报错：

```
Error: Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable.
```

（提示OpenAI是因为我们使用OpenAI SDK兼容层）

---

## 快速访问链接

- 环境变量设置：https://vercel.com/[your-project]/settings/environment-variables
- 重新部署：https://vercel.com/[your-project]/deployments

