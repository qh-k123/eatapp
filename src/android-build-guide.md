# 小象探店 Android APK 打包指南

## 环境准备

### 1. 安装 Node.js 依赖
```bash
npm install
```

### 2. 安装 Android 开发环境

#### Windows/macOS
1. 安装 Android Studio：https://developer.android.com/studio
2. 打开 Android Studio，安装以下组件：
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
   - Android SDK Build-Tools

#### 配置环境变量
```bash
# Windows
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"

# macOS/Linux
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 3. 安装 Capacitor CLI
```bash
npm install -g @capacitor/cli
```

## 项目初始化

### 1. 构建 Web 项目
```bash
npm run build
```

### 2. 初始化 Capacitor（首次执行）
```bash
npx cap init
```

### 3. 添加 Android 平台
```bash
npx cap add android
```

### 4. 同步代码到 Android 项目
```bash
npx cap sync android
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run build` | 构建 Web 项目 |
| `npx cap sync android` | 同步代码到 Android 项目 |
| `npx cap open android` | 打开 Android Studio |
| `npm run android` | 一键构建并打开 Android Studio |

## 打包 APK

### 开发调试版本
```bash
# 1. 构建并同步
npm run build
npx cap sync android

# 2. 打开 Android Studio
npx cap open android

# 3. 在 Android Studio 中
# - 选择 Build > Build Bundle(s) / APK(s) > Build APK(s)
# - 或使用快捷键 Ctrl+Shift+F9 (Windows) / Cmd+Shift+F9 (Mac)
```

### 发布版本（签名 APK）

#### 1. 生成签名密钥
```bash
keytool -genkey -v -keystore xiaoxiang-shop.keystore -alias xiaoxiang -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. 配置签名信息
编辑 `capacitor.config.json`：
```json
{
  "android": {
    "buildOptions": {
      "keystorePath": "./xiaoxiang-shop.keystore",
      "keystoreAlias": "xiaoxiang",
      "keystorePassword": "你的密码",
      "keystoreAliasPassword": "你的密码"
    }
  }
}
```

#### 3. 构建发布版本
在 Android Studio 中：
- Build > Generate Signed Bundle / APK
- 选择 APK
- 选择你的密钥库文件
- 选择 release 构建类型

## 插件功能说明

本项目已集成以下 Capacitor 插件：

| 插件 | 功能 |
|------|------|
| `@capacitor/splash-screen` | 启动屏 |
| `@capacitor/status-bar` | 状态栏样式 |
| `@capacitor/toast` | 原生 Toast 提示 |
| `@capacitor/share` | 系统分享功能 |
| `@capacitor/preferences` | 本地存储 |

## 注意事项

1. **网络权限**：如需访问网络，已在 `android/app/src/main/AndroidManifest.xml` 中自动配置
2. **存储权限**：如需访问相册/相机，需额外申请权限
3. **返回键处理**：已配置 Android 返回键行为
4. **状态栏**：已配置为橙色主题，与 App 主题一致

## 常见问题

### Q1: 同步失败
```bash
# 删除 android 文件夹重新添加
rm -rf android
npx cap add android
npx cap sync android
```

### Q2: 构建失败
- 确保 Android SDK 版本兼容（推荐 API 33+）
- 检查 Gradle 版本

### Q3: 白屏问题
- 确保 `webDir` 配置正确指向构建输出目录
- 检查路由配置是否支持 file:// 协议

## 发布到应用商店

### Google Play 商店
1. 注册 Google Play 开发者账号（$25 一次性费用）
2. 创建应用并上传签名后的 AAB 文件
3. 填写应用信息、截图、隐私政策等
4. 提交审核

### 国内应用商店
- 华为应用市场
- 小米应用商店
- OPPO/vivo 应用商店
- 应用宝

每个商店需要单独注册开发者账号并提交审核。
