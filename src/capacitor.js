import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Toast } from '@capacitor/toast'
import { Share } from '@capacitor/share'
import { Preferences } from '@capacitor/preferences'

// 检查是否在原生应用中运行
export const isNativePlatform = () => {
  return Capacitor.isNativePlatform()
}

// 获取当前平台
export const getPlatform = () => {
  return Capacitor.getPlatform()
}

// 隐藏启动屏
export const hideSplashScreen = async () => {
  try {
    if (isNativePlatform()) {
      await SplashScreen.hide()
    }
  } catch (error) {
    console.log('隐藏启动屏失败:', error)
  }
}

// 显示启动屏
export const showSplashScreen = async () => {
  try {
    if (isNativePlatform()) {
      await SplashScreen.show({
        showDuration: 2000,
        autoHide: true,
      })
    }
  } catch (error) {
    console.log('显示启动屏失败:', error)
  }
}

// 设置状态栏样式
export const setStatusBarStyle = async (style = 'light') => {
  try {
    if (isNativePlatform()) {
      await StatusBar.setStyle({
        style: style === 'dark' ? Style.Dark : Style.Light,
      })
    }
  } catch (error) {
    console.log('设置状态栏样式失败:', error)
  }
}

// 设置状态栏背景色
export const setStatusBarBackgroundColor = async (color = '#FF6B35') => {
  try {
    if (isNativePlatform()) {
      await StatusBar.setBackgroundColor({ color })
    }
  } catch (error) {
    console.log('设置状态栏背景色失败:', error)
  }
}

// 显示原生 Toast
export const showNativeToast = async (message) => {
  try {
    if (isNativePlatform()) {
      await Toast.show({
        text: message,
        duration: 'short',
      })
    } else {
      // Web 端使用浏览器 Toast
      console.log('Toast:', message)
    }
  } catch (error) {
    console.log('显示 Toast 失败:', error)
  }
}

// 系统分享
export const nativeShare = async (title, text, url) => {
  try {
    if (isNativePlatform()) {
      await Share.share({
        title,
        text,
        url,
      })
    } else {
      // Web 端使用 Web Share API
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        // 复制到剪贴板
        await navigator.clipboard.writeText(url)
        alert('链接已复制到剪贴板')
      }
    }
  } catch (error) {
    console.log('分享失败:', error)
  }
}

// 本地存储 - 设置
export const setPreference = async (key, value) => {
  try {
    if (isNativePlatform()) {
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      })
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.log('设置存储失败:', error)
  }
}

// 本地存储 - 获取
export const getPreference = async (key) => {
  try {
    if (isNativePlatform()) {
      const { value } = await Preferences.get({ key })
      return value ? JSON.parse(value) : null
    } else {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    }
  } catch (error) {
    console.log('获取存储失败:', error)
    return null
  }
}

// 本地存储 - 删除
export const removePreference = async (key) => {
  try {
    if (isNativePlatform()) {
      await Preferences.remove({ key })
    } else {
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.log('删除存储失败:', error)
  }
}

// 初始化 Capacitor
export const initCapacitor = async () => {
  console.log('平台:', getPlatform())
  console.log('是否原生:', isNativePlatform())

  if (isNativePlatform()) {
    // 设置状态栏
    await setStatusBarStyle('light')
    await setStatusBarBackgroundColor('#FF6B35')

    // 延迟隐藏启动屏
    setTimeout(() => {
      hideSplashScreen()
    }, 1500)
  }
}

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
}
