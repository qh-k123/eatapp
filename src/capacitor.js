/**
 * Capacitor 桥接模块
 * 支持 Web 和原生应用双模式运行
 * 原生环境下动态加载 Capacitor 插件
 */

// 全局 Capacitor 对象（原生环境注入）
const CapacitorGlobal = typeof window !== 'undefined' ? window.Capacitor : undefined;

// 检查是否在原生应用中运行
export const isNativePlatform = () => {
  return CapacitorGlobal?.isNativePlatform?.() || false;
};

// 获取当前平台
export const getPlatform = () => {
  return CapacitorGlobal?.getPlatform?.() || 'web';
};

// 隐藏启动屏
export const hideSplashScreen = async () => {
  try {
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.SplashScreen) {
      await CapacitorGlobal.Plugins.SplashScreen.hide();
    }
  } catch (error) {
    console.log('隐藏启动屏失败:', error);
  }
};

// 显示启动屏
export const showSplashScreen = async () => {
  try {
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.SplashScreen) {
      await CapacitorGlobal.Plugins.SplashScreen.show({
        showDuration: 2000,
        autoHide: true,
      });
    }
  } catch (error) {
    console.log('显示启动屏失败:', error);
  }
};

// 设置状态栏样式
export const setStatusBarStyle = async (style = 'light') => {
  try {
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.StatusBar) {
      const Style = CapacitorGlobal.Plugins.StatusBar.Style || {};
      await CapacitorGlobal.Plugins.StatusBar.setStyle({
        style: style === 'dark' ? Style.Dark : Style.Light,
      });
    }
  } catch (error) {
    console.log('设置状态栏样式失败:', error);
  }
};

// 设置状态栏背景色
export const setStatusBarBackgroundColor = async (color = '#FF6B35') => {
  try {
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.StatusBar) {
      await CapacitorGlobal.Plugins.StatusBar.setBackgroundColor({ color });
    }
  } catch (error) {
    console.log('设置状态栏背景色失败:', error);
  }
};

// 显示原生 Toast
export const showNativeToast = async (message) => {
  try {
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.Toast) {
      await CapacitorGlobal.Plugins.Toast.show({
        text: message,
        duration: 'short',
      });
    } else {
      // Web 端降级处理
      console.log('Toast:', message);
    }
  } catch (error) {
    console.log('显示 Toast 失败:', error);
  }
};

// 系统分享
export const nativeShare = async (title, text, url) => {
  try {
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.Share) {
      await CapacitorGlobal.Plugins.Share.share({ title, text, url });
    } else if (navigator.share) {
      // Web Share API
      await navigator.share({ title, text, url });
    } else if (navigator.clipboard) {
      // 复制到剪贴板
      await navigator.clipboard.writeText(url);
      alert('链接已复制到剪贴板');
    }
  } catch (error) {
    console.log('分享失败:', error);
  }
};

// 本地存储 - 设置
export const setPreference = async (key, value) => {
  try {
    const stringValue = JSON.stringify(value);
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.Preferences) {
      await CapacitorGlobal.Plugins.Preferences.set({
        key,
        value: stringValue,
      });
    } else {
      localStorage.setItem(key, stringValue);
    }
  } catch (error) {
    console.log('设置存储失败:', error);
  }
};

// 本地存储 - 获取
export const getPreference = async (key) => {
  try {
    let value = null;
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.Preferences) {
      const result = await CapacitorGlobal.Plugins.Preferences.get({ key });
      value = result?.value;
    } else {
      value = localStorage.getItem(key);
    }
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.log('获取存储失败:', error);
    return null;
  }
};

// 本地存储 - 删除
export const removePreference = async (key) => {
  try {
    if (isNativePlatform() && CapacitorGlobal?.Plugins?.Preferences) {
      await CapacitorGlobal.Plugins.Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.log('删除存储失败:', error);
  }
};

// 初始化 Capacitor
export const initCapacitor = async () => {
  console.log('平台:', getPlatform());
  console.log('是否原生:', isNativePlatform());

  if (isNativePlatform()) {
    // 设置状态栏
    await setStatusBarStyle('light');
    await setStatusBarBackgroundColor('#FF6B35');

    // 延迟隐藏启动屏
    setTimeout(() => {
      hideSplashScreen();
    }, 1500);
  }
};

export default {
  isNativePlatform,
  getPlatform,
  hideSplashScreen,
  showSplashScreen,
  setStatusBarStyle,
  setStatusBarBackgroundColor,
  showNativeToast,
  nativeShare,
  setPreference,
  getPreference,
  removePreference,
  initCapacitor,
};
