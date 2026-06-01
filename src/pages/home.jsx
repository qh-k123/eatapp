// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { UtensilsCrossed, Ticket, MapPin, Sparkles, Shuffle, ChevronRight, Flame, Star, Clock, Navigation, User, Heart } from 'lucide-react';
// @ts-ignore;
import { Button, Badge, Card, CardContent, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';

// 外卖平台数据
const platforms = [{
  id: 'eleme',
  name: '饿了么',
  color: '#0085FF',
  icon: '🔵',
  coupons: 5
}, {
  id: 'meituan',
  name: '美团外卖',
  color: '#FFD100',
  icon: '🟡',
  coupons: 3
}, {
  id: 'jd',
  name: '京东到家',
  color: '#E4393C',
  icon: '🔴',
  coupons: 2
}, {
  id: 'dada',
  name: '达达快送',
  color: '#00C853',
  icon: '🟢',
  coupons: 1
}];

// 底部导航组件
function TabBar({
  current,
  $w
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: UtensilsCrossed
  }, {
    id: 'shop-list',
    label: '附近',
    icon: Navigation
  }, {
    id: 'random',
    label: '随机',
    icon: Shuffle
  }, {
    id: 'profile',
    label: '我的',
    icon: MapPin
  }];
  const handleTabClick = tabId => {
    if (tabId === current) return;
    $w.utils.navigateTo({
      pageId: tabId,
      params: {}
    });
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 safe-area-bottom">
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
export default function Home(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [location, setLocation] = useState('北京市朝阳区');
  const [currentTime, setCurrentTime] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [hotShops, setHotShops] = useState([]);
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // 检查登录状态并加载数据
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    let greeting = '';
    if (hours < 11) greeting = '早上好';else if (hours < 14) greeting = '中午好';else if (hours < 18) greeting = '下午好';else greeting = '晚上好';
    setCurrentTime(greeting);

    // 检查登录状态
    checkLoginStatus();
    // 加载优惠券和店铺数据
    loadCoupons();
    loadHotShops();
  }, []);
  const checkLoginStatus = async () => {
    try {
      const userInfo = $w?.auth?.currentUser;
      if (userInfo?.userId) {
        setCurrentUser(userInfo);
        setIsLoggedIn(true);
        // 检查是否游客
        const isGuestUser = userInfo.userId?.startsWith('guest_');
        setIsGuest(isGuestUser);
        if (!isGuestUser) {
          // 加载用户详细信息
          await loadUserData(userInfo.userId);
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载用户数据
  const loadUserData = async userId => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
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
      if (queryResult?.result?.data?.records?.length > 0) {
        const userData = queryResult.result.data.records[0];
        setUserInfo(userData);

        // 加载用户收藏的店铺
        if (userData.favorites?.length > 0) {
          await loadFavoriteShops(userData.favorites);
        }
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  };

  // 加载优惠券数据
  const loadCoupons = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'coupon',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          select: {
            $master: true
          },
          pageSize: 10,
          pageNumber: 1
        }
      });
      if (result?.records) {
        const couponList = result.records.map(coupon => ({
          id: coupon._id,
          platform: coupon.platform || '未知平台',
          title: coupon.title || '',
          minSpend: coupon.min_spend || 0,
          discount: coupon.discount || 0,
          type: coupon.type || 'amount',
          expiry: coupon.expiry || '今日到期',
          code: coupon.code || ''
        }));
        setCoupons(couponList);
      }
    } catch (error) {
      console.error('加载优惠券失败:', error);
    }
  };

  // 加载热门店铺
  const loadHotShops = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'shop',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          select: {
            $master: true
          },
          pageSize: 6,
          pageNumber: 1
        }
      });
      if (result?.records) {
        const shopList = result.records.map(shop => ({
          id: shop._id,
          name: shop.name,
          rating: shop.rating || 4.5,
          monthlySales: shop.monthly_sales || 1000,
          deliveryTime: shop.delivery_time || '30分钟',
          deliveryFee: shop.delivery_fee || 0,
          minPrice: shop.min_price || 20,
          tags: shop.tags || ['美食'],
          image: shop.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'
        }));
        setHotShops(shopList);
      }
    } catch (error) {
      console.error('加载店铺失败:', error);
    }
  };

  // 加载用户收藏的店铺
  const loadFavoriteShops = async favoriteIds => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'shop',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              _id: {
                $in: favoriteIds
              }
            }
          },
          select: {
            $master: true
          },
          pageSize: 10,
          pageNumber: 1
        }
      });
      if (result?.records) {
        const shopList = result.records.map(shop => ({
          id: shop._id,
          name: shop.name,
          rating: shop.rating || 4.5,
          monthlySales: shop.monthly_sales || 1000,
          deliveryTime: shop.delivery_time || '30分钟',
          deliveryFee: shop.delivery_fee || 0,
          minPrice: shop.min_price || 20,
          tags: shop.tags || ['美食'],
          image: shop.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'
        }));
        setFavoriteShops(shopList);
      }
    } catch (error) {
      console.error('加载收藏店铺失败:', error);
    }
  };
  const handlePlatformClick = platform => {
    toast({
      title: `打开${platform.name}`,
      description: `正在为您跳转到${platform.name}...`
    });
    // 实际项目中这里会调用外部链接或SDK
  };
  const handleRandomPick = () => {
    $w.utils.navigateTo({
      pageId: 'random',
      params: {}
    });
  };
  const handleShopClick = shop => {
    $w.utils.navigateTo({
      pageId: 'shop-detail',
      params: {
        shopId: shop.id
      }
    });
  };
  const handleViewAllShops = () => {
    $w.utils.navigateTo({
      pageId: 'shop-list',
      params: {}
    });
  };
  const handleViewAllCoupons = () => {
    $w.utils.navigateTo({
      pageId: 'coupons',
      params: {}
    });
  };
  const handleLogin = () => {
    $w.utils.navigateTo({
      pageId: 'profile',
      params: {}
    });
  };

  // 获取用户显示信息
  const getUserDisplayName = () => {
    if (!isLoggedIn) return '未登录';
    if (isGuest) return '游客';
    return userInfo?.nickName || currentUser?.nickName || '用户';
  };
  const getUserAvatar = () => {
    if (isGuest || !isLoggedIn) return '';
    return userInfo?.avatarUrl || currentUser?.avatarUrl || '';
  };
  const getGreeting = () => {
    if (!isLoggedIn) return currentTime;
    if (isGuest) return `${currentTime}，游客`;
    return `${currentTime}，${getUserDisplayName()}`;
  };
  return <div className="min-h-screen bg-[#FFF8F0] pb-20">
      {/* 顶部问候语和定位 */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#F7C59F] px-4 pt-12 pb-8 rounded-b-[32px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm">{getGreeting()}</p>
            <h1 className="text-white text-2xl font-bold mt-1">今天想吃点什么？</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* 用户头像 */}
            {isLoggedIn && !isGuest && <Avatar className="w-10 h-10 border-2 border-white/30">
                <AvatarImage src={getUserAvatar()} />
                <AvatarFallback className="bg-white/20 text-white text-sm">
                  {getUserDisplayName()[0]}
                </AvatarFallback>
              </Avatar>}
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-2">
              <MapPin className="w-4 h-4 text-white mr-1" />
              <span className="text-white text-sm">{location}</span>
            </div>
          </div>
        </div>

        {/* 快捷功能按钮 */}
        <div className="flex gap-3 mt-4">
          <Button onClick={handleRandomPick} className="flex-1 bg-white text-[#FF6B35] hover:bg-white/90 rounded-full h-12 font-semibold shadow-lg">
            <Shuffle className="w-5 h-5 mr-2" />
            随机选餐
          </Button>
          <Button onClick={handleViewAllShops} className="flex-1 bg-[#2EC4B6] text-white hover:bg-[#2EC4B6]/90 rounded-full h-12 font-semibold shadow-lg">
            <Sparkles className="w-5 h-5 mr-2" />
            智能推荐
          </Button>
        </div>
      </div>

      {/* 用户信息提示栏（未登录或游客） */}
      {(!isLoggedIn || isGuest) && <div className="px-4 mt-4">
          <Card className="bg-gradient-to-r from-[#FF6B35]/10 to-[#F7C59F]/10 border-[#FF6B35]/20">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-sm text-gray-600">
                  {isGuest ? '游客模式，登录享受更多权益' : '登录后可领取优惠券、收藏店铺'}
                </p>
              </div>
              <Button size="sm" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full" onClick={handleLogin}>
                去登录
              </Button>
            </CardContent>
          </Card>
        </div>}

      {/* 外卖平台入口 */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#2D3436] flex items-center">
            <UtensilsCrossed className="w-5 h-5 mr-2 text-[#FF6B35]" />
            外卖平台
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {platforms.map(platform => <button key={platform.id} onClick={() => handlePlatformClick(platform)} className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2" style={{
            backgroundColor: `${platform.color}20`
          }}>
                {platform.icon}
              </div>
              <span className="text-xs font-medium text-[#2D3436]">{platform.name}</span>
              {platform.coupons > 0 && <Badge className="mt-1 bg-[#FF6B35] text-white text-[10px] px-2 py-0.5">
                  {platform.coupons}张券
                </Badge>}
            </button>)}
        </div>
      </div>

      {/* 优惠券区域 */}
      {coupons.length > 0 && <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2D3436] flex items-center">
              <Ticket className="w-5 h-5 mr-2 text-[#FF6B35]" />
              今日优惠券
            </h2>
            <button onClick={handleViewAllCoupons} className="text-sm text-[#FF6B35] flex items-center">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {coupons.slice(0, 3).map(coupon => <Card key={coupon.id} className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="bg-gradient-to-br from-[#FF6B35] to-[#F7C59F] px-4 py-4 flex flex-col items-center justify-center min-w-[100px]">
                      <span className="text-white text-2xl font-bold">
                        {coupon.type === 'percent' ? `${Math.round(coupon.discount * 100)}折` : `¥${coupon.discount}`}
                      </span>
                      <span className="text-white/80 text-xs mt-1">{coupon.platform}</span>
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#2D3436]">{coupon.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {coupon.minSpend > 0 ? `满${coupon.minSpend}元可用` : '无门槛'}
                        </p>
                        <p className="text-xs text-[#FF6B35] mt-1">{coupon.expiry}</p>
                      </div>
                      <Button size="sm" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full px-4" onClick={() => toast({
                  title: isGuest ? '请先登录' : '已领取',
                  description: isGuest ? '登录后可领取优惠券' : `${coupon.platform} ${coupon.title}`
                })} disabled={isGuest}>
                        领取
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>}

      {/* 我的收藏（仅登录用户显示） */}
      {isLoggedIn && !isGuest && favoriteShops.length > 0 && <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2D3436] flex items-center">
              <Heart className="w-5 h-5 mr-2 text-[#FF6B35]" />
              我的收藏
            </h2>
            <button onClick={handleViewAllShops} className="text-sm text-[#FF6B35] flex items-center">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {favoriteShops.map(shop => <Card key={shop.id} className="flex-shrink-0 w-64 bg-white border-0 shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleShopClick(shop)}>
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="font-bold text-[#2D3436] text-sm truncate">{shop.name}</h3>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-[#FF6B35] text-[#FF6B35]" />
                        <span>{shop.rating}</span>
                        <span>·</span>
                        <span>{shop.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Badge className="bg-[#2EC4B6] text-white text-[10px]">
                          {shop.deliveryFee === 0 ? '免配送费' : `配送¥${shop.deliveryFee}`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>}

      {/* 热门推荐 */}
      {hotShops.length > 0 && <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2D3436] flex items-center">
              <Flame className="w-5 h-5 mr-2 text-[#FF6B35]" />
              热门推荐
            </h2>
            <button onClick={handleViewAllShops} className="text-sm text-[#FF6B35] flex items-center">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {hotShops.slice(0, 3).map(shop => <Card key={shop.id} className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleShopClick(shop)}>
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-28 h-28 flex-shrink-0">
                      <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#2D3436] text-lg">{shop.name}</h3>
                        <div className="flex items-center text-[#FF6B35]">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          <span className="font-bold">{shop.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>月售{shop.monthlySales}+</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {shop.deliveryTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {shop.tags.map((tag, idx) => <Badge key={idx} variant="secondary" className="bg-[#FFF8F0] text-[#FF6B35] text-xs">
                            {tag}
                          </Badge>)}
                        <Badge className="bg-[#2EC4B6] text-white text-xs">
                          {shop.deliveryFee === 0 ? '免配送费' : `配送¥${shop.deliveryFee}`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>}

      {/* 底部导航 */}
      <TabBar current="home" $w={$w} />
    </div>;
}