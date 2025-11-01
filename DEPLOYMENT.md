# Vercel 部署指南

## 方式1：GitHub集成（推荐，30秒完成）

1. 访问 https://vercel.com/new
2. 用GitHub账号登录
3. 点击 "Import Git Repository"
4. 选择 `JasonRobertDestiny/icebreak`
5. **重要：配置环境变量**（点击 "Environment Variables"）：
   ```
   Name: DEEPSEEK_API_KEY
   Value: sk-UtNKyzSjxh7kmcDejDGtGSFsOhzsUqpVnc5y9at5OEgMns4W
   Environment: Production, Preview, Development (全选)
   ```
6. 点击 "Deploy"

**完成后你会得到**:
- 生产环境: `icebreak.vercel.app`
- 自动部署: 每次push到main分支自动更新
- 免费HTTPS + CDN

---

## 方式2：CLI部署

```bash
# 登录Vercel（会打开浏览器）
vercel login

# 部署到生产环境
vercel --prod

# 添加环境变量
vercel env add DEEPSEEK_API_KEY production
# 输入: sk-UtNKyzSjxh7kmcDejDGtGSFsOhzsUqpVnc5y9at5OEgMns4W
```

---

## 部署后检查

访问 `https://icebreak.vercel.app/generate` 测试话题生成功能
