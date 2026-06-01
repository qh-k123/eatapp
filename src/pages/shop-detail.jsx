// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Star, Clock, MapPin, Phone, Share2, Heart, Plus, Minus, ShoppingBag, Flame, TrendingUp, ExternalLink, User, LogIn } from 'lucide-react';
// @ts-ignore;
import { Button, Badge, Card, CardContent, useToast } from '@/components/ui';

// 菜品分类
const categories = [{
  id: 'recommend',
  label: '招牌推荐'
}, {
  id: 'combo',
  label: '超值套餐'
}, {
  id: 'burger',
  label: '汉堡'
}, {
  id: 'snack',
  label: '小食'
}, {
  id: 'drink',
  label: '饮品'
}];

// 平台信息
const platforms = [{
  id: 'eleme',
  name: '饿了么',
  color: '#0085FF',
  coupon: '满30减15',
  url: 'https://www.ele.me'
}, {
  id: 'meituan',
  name: '美团',
  color: '#FFD100',
  coupon: '满50减20',
  url: 'https://waimai.meituan.com'
}, {
  id: 'jd',
  name: '京东',
  color: '#E4393C',
  coupon: '新人8折',
  url: 'https://www.jd.com'
}];
export default function ShopDetail(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [activeCategory, setActiveCategory] = useState('recommend');
  const [cart, setCart] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('eleme');
  const [showPriceCompare, setShowPriceCompare] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userInfoId, setUserInfoId] = useState(null);
  const shopId = $w?.page?.dataset?.params?.shopId;

  // 检查登录状态
  useEffect(() => {
    checkLoginStatus();
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
        setUserInfoId(userData._id);

        // 检查当前店铺是否在收藏列表中
        if (shopId && userData.favorites?.includes(shopId)) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  };

  // 加载店铺详情
  const loadShopDetail = async () => {
    if (!shopId) {
      toast({
        title: '参数错误',
        description: '缺少店铺ID',
        variant: 'destructive'
      });
      return;
    }
    try {
      setLoading(true);
      // 查询店铺详情
      const shopResult = await $w.cloud.callDataSource({
        dataSourceName: 'shop',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: shopId
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (shopResult) {
        setShopData({
          id: shopResult._id,
          name: shopResult.name,
          rating: shopResult.rating || 4.5,
          monthlySales: shopResult.monthly_sales || 1000,
          deliveryTime: shopResult.delivery_time || '30分钟',
          distance: shopResult.distance || 1.0,
          deliveryFee: shopResult.delivery_fee || 0,
          minPrice: shopResult.min_price || 20,
          address: shopResult.address || '',
          phone: shopResult.phone || '',
          tags: shopResult.tags || ['美食'],
          image: shopResult.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600',
          description: shopResult.description || ''
        });
      }

      // 查询店铺菜品
      const dishesResult = await $w.cloud.callDataSource({
        dataSourceName: 'dish',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                shop_id: {
                  $eq: shopId
                }
              }]
            }
          },
          select: {
            $master: true
          },
          pageSize: 100
        }
      });
      if (dishesResult?.records) {
        const dishList = dishesResult.records.map(dish => ({
          id: dish._id,
          category: dish.category || 'recommend',
          name: dish.name,
          description: dish.description || '',
          originalPrice: dish.original_price || 0,
          sales: dish.sales || 0,
          isHot: dish.is_hot || false,
          image: dish.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c66cd?w=400',
          platformPrices: dish.platform_prices || {
            eleme: dish.original_price || 0,
            meituan: dish.original_price || 0,
            jd: dish.original_price || 0
          }
        }));
        setDishes(dishList);
      }
    } catch (error) {
      console.error('加载店铺详情失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadShopDetail();
  }, [shopId]);
  const addToCart = dish => {
    setCart(prev => ({
      ...prev,
      [dish.id]: (prev[dish.id] || 0) + 1
    }));
    toast({
      title: '已加入购物车',
      description: `${dish.name} x1`
    });
  };
  const removeFromCart = dishId => {
    setCart(prev => {
      const newCart = {
        ...prev
      };
      if (newCart[dishId] > 1) {
        newCart[dishId]--;
      } else {
        delete newCart[dishId];
      }
      return newCart;
    });
  };
  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [dishId, count]) => {
      const dish = dishes.find(d => d.id === dishId);
      if (dish) {
        const price = dish.platformPrices[selectedPlatform] || dish.originalPrice;
        return total + price * count;
      }
      return total;
    }, 0);
  };
  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };
  const handleBack = () => {
    $w.utils.navigateBack();
  };

  // 收藏/取消收藏店铺
  const handleFavorite = async () => {
    if (!isLoggedIn || isGuest) {
      toast({
        title: '请先登录',
        description: '登录后可收藏店铺',
        variant: 'destructive'
      });
      return;
    }
    if (!userInfoId) {
      toast({
        title: '用户信息加载中',
        description: '请稍后再试',
        variant: 'destructive'
      });
      return;
    }
    try {
      const tcb = await $w.cloud.getCloudInstance();
      let newFavorites;
      if (isFavorite) {
        // 取消收藏
        newFavorites = (userInfo?.favorites || []).filter(id => id !== shopId);
        await tcb.callFunction({
          name: 'wedaUpdateV2',
          data: {
            action: 'wedaUpdateV2',
            data: {
              collectionName: 'user_info',
              id: userInfoId,
              data: {
                favorites: newFavorites,
                updatedAt: new Date().toISOString()
              }
            }
          }
        });
        setIsFavorite(false);
        toast({
          title: '已取消收藏'
        });
      } else {
        // 添加收藏
        newFavorites = [...(userInfo?.favorites || []), shopId];
        await tcb.callFunction({
          name: 'wedaUpdateV2',
          data: {
            action: 'wedaUpdateV2',
            data: {
              collectionName: 'user_info',
              id: userInfoId,
              data: {
                favorites: newFavorites,
                updatedAt: new Date().toISOString()
              }
            }
          }
        });
        setIsFavorite(true);
        toast({
          title: '已收藏店铺'
        });
      }

      // 更新本地状态
      setUserInfo(prev => ({
        ...prev,
        favorites: newFavorites
      }));
    } catch (error) {
      console.error('收藏操作失败:', error);
      toast({
        title: '操作失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };

  // 一键跳转到外卖平台
  const handleOrder = () => {
    if (getCartCount() === 0) {
      toast({
        title: '购物车为空',
        description: '请先选择菜品',
        variant: 'destructive'
      });
      return;
    }
    const platform = platforms.find(p => p.id === selectedPlatform);

    // 构建订单信息
    const orderInfo = {
      shopName: shopData?.name,
      platform: platform.name,
      items: Object.entries(cart).map(([dishId, count]) => {
        const dish = dishes.find(d => d.id === dishId);
        return {
          name: dish?.name,
          count,
          price: dish?.platformPrices?.[selectedPlatform] || dish?.originalPrice
        };
      }),
      total: getCartTotal().toFixed(2)
    };
    toast({
      title: '准备下单',
      description: `将为您跳转至${platform.name}完成订单`
    });

    // 实际项目中这里会调用外部链接或SDK
    // window.open(platform.url, '_blank');
    console.log('订单信息:', orderInfo);
  };

  // 直接跳转到平台
  const handleGoToPlatform = platformId => {
    const platform = platforms.find(p => p.id === platformId);
    toast({
      title: `跳转至${platform.name}`,
      description: '正在打开外卖平台...'
    });
    // window.open(platform.url, '_blank');
  };
  const handleLogin = () => {
    $w.utils.navigateTo({
      pageId: 'profile',
      params: {}
    });
  };
  const filteredDishes = activeCategory === 'recommend' ? dishes.filter(d => d.isHot) : dishes.filter(d => d.category === activeCategory);
  if (loading) {
    return <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>;
  }
  if (!shopData) {
    return <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">店铺信息加载失败</p>
          <Button className="mt-4 bg-[#FF6B35]" onClick={handleBack}>返回</Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-[#FFF8F0] pb-32">
      {/* 顶部图片 */}
      <div className="relative h-48">
        <img src={shopData.image} alt={shopData.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button onClick={handleBack} className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="absolute top-12 right-4 flex gap-2">
          <button onClick={handleFavorite} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white">{shopData.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-white/90 text-sm">
            <span className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              {shopData.rating}
            </span>
            <span>月售{shopData.monthlySales}+</span>
            <span>{shopData.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* 用户信息提示栏 */}
      {(!isLoggedIn || isGuest) && <div className="px-4 mt-3">
          <Card className="bg-gradient-to-r from-[#FF6B35]/10 to-[#F7C59F]/10 border-[#FF6B35]/20">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-sm text-gray-600">
                  {isGuest ? '游客模式，部分功能受限' : '登录后可收藏店铺、领取优惠券'}
                </p>
              </div>
              <Button size="sm" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full" onClick={handleLogin}>
                <LogIn className="w-3 h-3 mr-1" />
                登录
              </Button>
            </CardContent>
          </Card>
        </div>}

      {/* 店铺信息卡片 */}
      <div className="px-4 -mt-4 relative z-10">
        <Card className="bg-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {shopData.tags.map((tag, idx) => <Badge key={idx} variant="secondary" className="bg-[#FFF8F0] text-[#FF6B35]">
                    {tag}
                  </Badge>)}
              </div>
              <div className="text-sm text-gray-500">
                起送¥{shopData.minPrice} · {shopData.deliveryFee === 0 ? '免配送费' : `配送¥${shopData.deliveryFee}`}
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600 flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              {shopData.address}
            </div>
            <div className="mt-2 text-sm text-gray-600 flex items-center">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              {shopData.phone}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 平台价格对比 */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#2D3436] flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#FF6B35]" />
            平台比价
          </h2>
          <button onClick={() => setShowPriceCompare(!showPriceCompare)} className="text-sm text-[#FF6B35]">
            {showPriceCompare ? '收起' : '展开'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {platforms.map(platform => <button key={platform.id} onClick={() => setSelectedPlatform(platform.id)} className={`p-3 rounded-xl text-center transition-colors ${selectedPlatform === platform.id ? 'bg-white shadow-md border-2 border-[#FF6B35]' : 'bg-white/50'}`}>
              <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold" style={{
            backgroundColor: platform.color
          }}>
                {platform.name[0]}
              </div>
              <p className="text-xs font-medium text-[#2D3436]">{platform.name}</p>
              <Badge className="mt-1 text-[10px] bg-[#FF6B35]/10 text-[#FF6B35] border-0">
                {platform.coupon}
              </Badge>
            </button>)}
        </div>
        
        {/* 一键跳转平台按钮 */}
        <div className="mt-3 flex gap-2">
          {platforms.map(platform => <button key={platform.id} onClick={() => handleGoToPlatform(platform.id)} className="flex-1 py-2 px-3 rounded-xl bg-white shadow-sm flex items-center justify-center gap-1 text-xs font-medium" style={{
          color: platform.color
        }}>
              <ExternalLink className="w-3 h-3" />
              打开{platform.name}
            </button>)}
        </div>
      </div>

      {/* 招牌菜推荐区域 */}
      {dishes.filter(d => d.isHot).length > 0 && <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#2D3436] flex items-center">
              <Flame className="w-5 h-5 mr-2 text-red-500" />
              招牌推荐
            </h2>
            <Badge className="bg-red-500 text-white border-0">必点</Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dishes.filter(d => d.isHot).slice(0, 5).map(dish => <Card key={dish.id} className="flex-shrink-0 w-40 bg-white border-0 shadow-sm rounded-xl overflow-hidden">
                <div className="h-24 overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-bold text-sm text-[#2D3436] truncate">{dish.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">月售{dish.sales}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#FF6B35] font-bold">¥{dish.platformPrices[selectedPlatform]}</span>
                    <button onClick={() => addToCart(dish)} className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>}

      {/* 菜品分类和内容 */}
      <div className="mt-6">
        <div className="px-4 mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-[#FF6B35] text-white' : 'bg-white text-gray-600'}`}>
                {cat.label}
              </button>)}
          </div>
        </div>

        <div className="px-4 space-y-4">
          {filteredDishes.length === 0 ? <div className="text-center py-8">
              <p className="text-gray-500">暂无该分类菜品</p>
            </div> : filteredDishes.map(dish => <Card key={dish.id} className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex p-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-[#2D3436]">{dish.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">{dish.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {dish.isHot && <Badge className="bg-red-500 text-white text-[10px]">
                                <Flame className="w-3 h-3 mr-1" />
                                热销
                              </Badge>}
                            <span className="text-xs text-gray-400">月售{dish.sales}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 价格对比 */}
                      {showPriceCompare ? <div className="mt-3 grid grid-cols-3 gap-2">
                          {platforms.map(platform => {
                    const price = dish.platformPrices[platform.id];
                    const isSelected = selectedPlatform === platform.id;
                    return <div key={platform.id} className={`text-center p-2 rounded-lg ${isSelected ? 'bg-[#FF6B35]/10' : 'bg-gray-50'}`}>
                                <p className="text-[10px] text-gray-500">{platform.name}</p>
                                <p className={`text-sm font-bold ${isSelected ? 'text-[#FF6B35]' : 'text-gray-700'}`}>
                                  ¥{price}
                                </p>
                              </div>;
                  })}
                        </div> : <div className="flex items-center justify-between mt-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#FF6B35]">
                              ¥{dish.platformPrices[selectedPlatform]}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ¥{dish.originalPrice}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {cart[dish.id] ? <div className="flex items-center gap-2">
                                <button onClick={() => removeFromCart(dish.id)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="font-medium w-6 text-center">{cart[dish.id]}</span>
                              </div> : null}
                            <button onClick={() => addToCart(dish)} className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center">
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>}
                    </div>
                  </div>
                </CardContent>
              </Card>)}
        </div>
      </div>

      {/* 底部购物车栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-[#2D3436] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              {getCartCount() > 0 && <Badge className="absolute -top-1 -right-1 bg-[#FF6B35] text-white w-5 h-5 p-0 flex items-center justify-center text-xs">
                  {getCartCount()}
                </Badge>}
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2D3436]">¥{getCartTotal().toFixed(2)}</p>
              <p className="text-xs text-gray-500">已选{getCartCount()}件商品</p>
            </div>
          </div>
          <Button onClick={handleOrder} disabled={getCartCount() === 0} className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full px-8 h-12 font-semibold disabled:opacity-50">
            去下单
          </Button>
        </div>
      </div>
    </div>;
}