// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { User, Heart, Clock, Ticket, Settings, ChevronRight, MapPin, Phone, Shield, FileText, HelpCircle, Star, LogOut, Sparkles, Gift, Crown, X, MessageSquare } from 'lucide-react';
// @ts-ignore;
import { Button, Badge, Card, CardContent, Avatar, AvatarFallback, AvatarImage, useToast, Input, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';

// 底部导航组件
function TabBar({
  current,
  $w
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: UtensilsIcon
  }, {
    id: 'shop-list',
    label: '附近',
    icon: MapPin
  }, {
    id: 'random',
    label: '随机',
    icon: ShuffleIcon
  }, {
    id: 'profile',
    label: '我的',
    icon: User
  }];
  const handleTabClick = tabId => {
    if (tabId === current) return;
    $w.utils.navigateTo({
      pageId: tabId,
      params: {}
    });
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 safe-area-bottom z-50">
      <div className="flex justify-around items-center">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = current === tab.id;
        return <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex flex-col items-center py-2 px-4 rounded-xl transition-colors ${isActive ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>;
      })}
      </div>
    </div>;
}

// 图标组件
function UtensilsIcon({
  className
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>;
}
function ShuffleIcon({
  className
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.4-1.6l5.8-7.6c.9-1 2.1-1.6 3.4-1.6H22" />
      <path d="m18 15 3-3-3-3" />
      <path d="M2 6h1.4c1.3 0 2.5.6 3.4 1.6l5.8 7.6c.9 1 2.1 1.6 3.4 1.6H22" />
      <path d="m18 9 3 3-3 3" />
    </svg>;
}

// 登录界面组件
function LoginView({
  onWxLogin,
  onGuestMode,
  isLoggingIn
}) {
  return <div className="min-h-screen bg-gradient-to-br from-[#FF6B35] via-[#FF8A5B] to-[#F7C59F] flex flex-col">
      {/* 顶部装饰 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
        {/* Logo 区域 */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
              <Sparkles className="w-12 h-12 text-[#FF6B35]" />
            </div>
          </div>
          {/* 装饰元素 */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center animate-bounce">
            <Crown className="w-4 h-4 text-yellow-700" />
          </div>
          <div className="absolute -bottom-1 -left-4 w-6 h-6 rounded-full bg-white/40 animate-pulse" />
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-white mb-2 text-center">点外卖助手</h1>
        <p className="text-white/80 text-center mb-12">智能点餐，享受美食每一刻</p>

        {/* 功能亮点 */}
        <div className="w-full max-w-sm space-y-4 mb-12">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <p className="font-semibold">附近店铺</p>
              <p className="text-sm text-white/70">发现周边美食</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <p className="font-semibold">优惠券</p>
              <p className="text-sm text-white/70">省钱又省心</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ShuffleIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <p className="font-semibold">随机选餐</p>
              <p className="text-sm text-white/70">解决选择困难</p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部登录按钮 */}
      <div className="px-6 pb-12 space-y-3">
        {/* 微信一键登录 */}
        <Button onClick={onWxLogin} disabled={isLoggingIn} className="w-full h-14 bg-[#07C160] hover:bg-[#06AD56] text-white rounded-full font-bold text-lg shadow-xl transition-all">
          {isLoggingIn ? <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              登录中...
            </span> : <span className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              微信一键登录
            </span>}
        </Button>

        {/* 游客模式 - 快速体验 */}
        <Button onClick={onGuestMode} disabled={isLoggingIn} className="w-full h-12 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium">
          快速体验（游客模式）
        </Button>

        <p className="text-center text-white/60 text-xs mt-4">
          登录即表示同意《用户协议》和《隐私政策》
        </p>
      </div>
    </div>;
}

// 手机号绑定弹窗
function PhoneBindDialog({
  open,
  onClose,
  onSubmit,
  isSubmitting
}) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const {
    toast
  } = useToast();
  const handleSendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      toast({
        title: '请输入正确的手机号',
        variant: 'destructive'
      });
      return;
    }
    // 这里应该调用发送验证码接口
    toast({
      title: '验证码已发送'
    });
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleSubmit = () => {
    if (!phone || !code) {
      toast({
        title: '请填写完整信息',
        variant: 'destructive'
      });
      return;
    }
    onSubmit({
      phone,
      code
    });
  };
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">绑定手机号</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-sm text-gray-500 text-center">
            为了保障您的账号安全，请绑定手机号
          </p>
          <div className="flex gap-2">
            <Input placeholder="请输入手机号" value={phone} onChange={e => setPhone(e.target.value)} maxLength={11} className="flex-1" />
          </div>
          <div className="flex gap-2">
            <Input placeholder="请输入验证码" value={code} onChange={e => setCode(e.target.value)} maxLength={6} className="flex-1" />
            <Button variant="outline" onClick={handleSendCode} disabled={countdown > 0} className="w-28">
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 bg-gradient-to-r from-[#FF6B35] to-[#F7C59F] text-white rounded-full font-semibold">
            {isSubmitting ? '绑定中...' : '确认绑定'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
}

// 用户信息卡片组件
function UserInfoCard({
  currentUser,
  userInfo,
  isGuest
}) {
  const displayName = isGuest ? '游客' : userInfo?.nickName || currentUser?.nickName || currentUser?.name || '未设置昵称';
  const displayAvatar = isGuest ? '' : userInfo?.avatarUrl || currentUser?.avatarUrl || '';
  const displayPhone = isGuest ? '未登录' : userInfo?.phone || currentUser?.phone || '未绑定手机号';
  const memberLevel = isGuest ? '游客身份' : userInfo?.memberLevel || '普通会员';
  return <div className="px-4 -mt-10">
      <Card className="bg-white border-0 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Avatar className="w-20 h-20 border-4 border-[#FFF8F0]">
              <AvatarImage src={displayAvatar} />
              <AvatarFallback className={`text-white text-2xl ${isGuest ? 'bg-gray-400' : 'bg-gradient-to-br from-[#FF6B35] to-[#F7C59F]'}`}>
                {isGuest ? <User className="w-10 h-10" /> : displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold text-[#2D3436]">
                {displayName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {displayPhone === '未登录' ? displayPhone : displayPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`border-0 ${isGuest ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-400 to-orange-400'} text-white`}>
                  {!isGuest && <Star className="w-3 h-3 mr-1 fill-current" />}
                  {memberLevel}
                </Badge>
                {!isGuest && <span className="text-xs text-gray-500">积分 {userInfo?.memberPoints || 0}</span>}
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </div>;
}

// 统计数据组件
function StatsSection({
  stats,
  onMenuClick
}) {
  return <div className="px-4 mt-4">
      <Card className="bg-white border-0 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex justify-around">
            {stats.map(stat => {
            const Icon = stat.icon;
            return <button key={stat.id} className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors" onClick={() => onMenuClick({
              label: stat.label
            })}>
                  <div className="w-12 h-12 rounded-full bg-[#FFF8F0] flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <span className="text-lg font-bold text-[#2D3436]">{stat.value}</span>
                  <span className="text-xs text-gray-500 mt-1">{stat.label}</span>
                </button>;
          })}
          </div>
        </CardContent>
      </Card>
    </div>;
}

// 菜单列表组件
function MenuSection({
  menuItems,
  onMenuClick
}) {
  return <div className="px-4 mt-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">常用功能</h3>
      <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {menuItems.map((item, index) => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => onMenuClick(item)} className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center mr-3">
                    <Icon className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <span className="font-medium text-[#2D3436]">{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.badge && <Badge className="mr-2 bg-red-500 text-white">{item.badge}</Badge>}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>;
        })}
        </CardContent>
      </Card>
    </div>;
}
export default function Profile(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showPhoneBind, setShowPhoneBind] = useState(false);
  const [isBindingPhone, setIsBindingPhone] = useState(false);

  // 统计数据
  const [stats, setStats] = useState([{
    id: 1,
    label: '收藏店铺',
    value: 0,
    icon: Heart
  }, {
    id: 2,
    label: '历史订单',
    value: 0,
    icon: Clock
  }, {
    id: 3,
    label: '优惠券',
    value: 0,
    icon: Ticket
  }]);

  // 菜单项
  const menuItems = [{
    id: 1,
    label: '我的地址',
    icon: MapPin,
    badge: null
  }, {
    id: 2,
    label: '联系客服',
    icon: Phone,
    badge: null
  }, {
    id: 3,
    label: '隐私设置',
    icon: Shield,
    badge: null
  }, {
    id: 4,
    label: '用户协议',
    icon: FileText,
    badge: null
  }, {
    id: 5,
    label: '帮助中心',
    icon: HelpCircle,
    badge: null
  }];

  // 检查登录状态并加载用户数据
  useEffect(() => {
    checkLoginStatus();
  }, []);
  const checkLoginStatus = async () => {
    try {
      const userInfo = $w?.auth?.currentUser;
      if (userInfo?.userId) {
        setCurrentUser(userInfo);
        setIsLoggedIn(true);
        setIsGuest(false);
        // 加载用户详细信息
        await loadUserData(userInfo.userId, userInfo);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载或创建用户数据
  const loadUserData = async (userId, authUserInfo) => {
    try {
      const tcb = await $w.cloud.getCloudInstance();

      // 1. 查询用户数据
      const queryResult = await tcb.callFunction({
        name: 'wedaGetRecordsV2',
        data: {
          action: 'wedaGetRecordsV2',
          data: {
            collectionName: 'user_info',
            filter: {
              _openid: userId
            },
            pageSize: 1
          }
        }
      });
      let userData;
      if (queryResult?.result?.data?.records && queryResult.result.data.records.length > 0) {
        // 用户已存在，使用已有数据
        userData = queryResult.result.data.records[0];
        setUserInfo(userData);
        updateStats(userData);
      } else {
        // 2. 用户不存在，创建新用户
        const createResult = await tcb.callFunction({
          name: 'wedaCreateV2',
          data: {
            action: 'wedaCreateV2',
            data: {
              collectionName: 'user_info',
              data: {
                _openid: userId,
                nickName: authUserInfo?.nickName || `用户${userId.slice(-6)}`,
                avatarUrl: authUserInfo?.avatarUrl || '',
                phone: authUserInfo?.phone || '',
                isGuest: false,
                favorites: [],
                couponCount: 0,
                memberLevel: '普通会员',
                memberPoints: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
          }
        });
        if (createResult?.result?.data?.id) {
          // 创建成功，重新查询获取完整数据
          const newQueryResult = await tcb.callFunction({
            name: 'wedaGetRecordsV2',
            data: {
              action: 'wedaGetRecordsV2',
              data: {
                collectionName: 'user_info',
                filter: {
                  _openid: userId
                },
                pageSize: 1
              }
            }
          });
          if (newQueryResult?.result?.data?.records?.length > 0) {
            userData = newQueryResult.result.data.records[0];
            setUserInfo(userData);
            updateStats(userData);
          }
        }
      }

      // 检查是否需要绑定手机号
      if (!userData?.phone && !isGuest) {
        setShowPhoneBind(true);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      toast({
        title: '加载用户数据失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };

  // 更新统计数据
  const updateStats = userData => {
    setStats([{
      id: 1,
      label: '收藏店铺',
      value: userData?.favorites?.length || 0,
      icon: Heart
    }, {
      id: 2,
      label: '历史订单',
      value: 0,
      // 可从订单数据模型查询
      icon: Clock
    }, {
      id: 3,
      label: '优惠券',
      value: userData?.couponCount || 0,
      icon: Ticket
    }]);
  };

  // 微信一键登录
  const handleWxLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const tcb = await $w.cloud.getCloudInstance();

      // 先退出当前登录（如果有）
      try {
        await tcb.auth().signOut();
      } catch (e) {
        // 忽略退出失败
      }

      // 微信登录
      let loginResult;
      try {
        loginResult = await tcb.auth().signInWithWx({
          provider: 'weixin'
        });
      } catch (wxError) {
        console.log('微信登录失败，尝试其他方式:', wxError);
        // 使用匿名登录作为备选
        try {
          await tcb.auth().signInAnonymously();
        } catch (anonError) {
          throw new Error('登录失败，请检查登录配置');
        }
      }

      // 刷新用户信息
      const userInfo = await $w.auth.getUserInfo({
        force: true
      });
      setCurrentUser(userInfo);
      setIsLoggedIn(true);
      setIsGuest(false);

      // 加载或创建用户数据
      await loadUserData(userInfo.userId, userInfo);
      toast({
        title: '登录成功',
        description: '欢迎使用点外卖助手！'
      });
    } catch (error) {
      console.error('登录错误:', error);
      toast({
        title: '登录失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 游客模式
  const handleGuestMode = async () => {
    setIsLoggingIn(true);
    try {
      // 设置游客状态
      setIsGuest(true);
      setIsLoggedIn(true);
      setCurrentUser({
        userId: 'guest_' + Date.now(),
        nickName: '游客',
        name: '游客'
      });
      setUserInfo({
        nickName: '游客',
        avatarUrl: '',
        phone: '',
        isGuest: true,
        favorites: [],
        couponCount: 0,
        memberLevel: '游客身份',
        memberPoints: 0
      });
      updateStats({
        favorites: [],
        couponCount: 0
      });
      toast({
        title: '游客模式',
        description: '您正在以游客身份浏览，部分功能受限'
      });
    } catch (error) {
      toast({
        title: '进入游客模式失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 绑定手机号
  const handleBindPhone = async ({
    phone,
    code
  }) => {
    setIsBindingPhone(true);
    try {
      const tcb = await $w.cloud.getCloudInstance();

      // 更新用户手机号
      if (userInfo?._id) {
        await tcb.callFunction({
          name: 'wedaUpdateV2',
          data: {
            action: 'wedaUpdateV2',
            data: {
              collectionName: 'user_info',
              id: userInfo._id,
              data: {
                phone: phone,
                updatedAt: new Date().toISOString()
              }
            }
          }
        });

        // 更新本地状态
        setUserInfo(prev => ({
          ...prev,
          phone
        }));
      }
      setShowPhoneBind(false);
      toast({
        title: '绑定成功',
        description: '手机号绑定成功！'
      });
    } catch (error) {
      toast({
        title: '绑定失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsBindingPhone(false);
    }
  };
  const handleMenuClick = item => {
    if (isGuest) {
      toast({
        title: '功能受限',
        description: '游客模式下无法使用该功能，请登录后使用',
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: item.label,
      description: '功能开发中，敬请期待'
    });
  };
  const handleLogout = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      await tcb.auth().signOut();
      setCurrentUser(null);
      setUserInfo(null);
      setIsLoggedIn(false);
      setIsGuest(false);
      // 重置统计数据
      setStats([{
        id: 1,
        label: '收藏店铺',
        value: 0,
        icon: Heart
      }, {
        id: 2,
        label: '历史订单',
        value: 0,
        icon: Clock
      }, {
        id: 3,
        label: '优惠券',
        value: 0,
        icon: Ticket
      }]);
      toast({
        title: '退出登录',
        description: '您已成功退出登录'
      });
    } catch (error) {
      toast({
        title: '退出失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleNavigate = pageId => {
    $w.utils.navigateTo({
      pageId: pageId,
      params: {}
    });
  };

  // 加载中显示登录界面
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#FF6B35] via-[#FF8A5B] to-[#F7C59F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>;
  }

  // 未登录显示完整登录界面
  if (!isLoggedIn) {
    return <>
        <LoginView onWxLogin={handleWxLogin} onGuestMode={handleGuestMode} isLoggingIn={isLoggingIn} />
      </>;
  }

  // 已登录显示个人中心（包括游客模式）
  return <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* 顶部背景 */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#F7C59F] px-4 pt-12 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">我的</h1>
          {!isGuest && <button onClick={() => handleNavigate('settings')} className="p-2">
              <Settings className="w-6 h-6 text-white" />
            </button>}
        </div>
      </div>

      {/* 用户信息卡片 */}
      <UserInfoCard currentUser={currentUser} userInfo={userInfo} isGuest={isGuest} />

      {/* 统计卡片 */}
      <StatsSection stats={stats} onMenuClick={handleMenuClick} />

      {/* 菜单列表 */}
      <MenuSection menuItems={menuItems} onMenuClick={handleMenuClick} />

      {/* 退出登录 */}
      <div className="px-4 mt-6">
        <Button variant="outline" onClick={handleLogout} className="w-full h-12 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50">
          <LogOut className="w-5 h-5 mr-2" />
          {isGuest ? '结束体验' : '退出登录'}
        </Button>
      </div>

      {/* 版本信息 */}
      <div className="text-center mt-8">
        <p className="text-xs text-gray-400">点外卖助手 v1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">让每一餐都充满惊喜</p>
      </div>

      {/* 底部导航 */}
      <TabBar current="profile" $w={$w} />

      {/* 手机号绑定弹窗 - 仅非游客显示 */}
      {!isGuest && <PhoneBindDialog open={showPhoneBind} onClose={() => setShowPhoneBind(false)} onSubmit={handleBindPhone} isSubmitting={isBindingPhone} />}
    </div>;
}