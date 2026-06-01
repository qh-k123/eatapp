// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Shuffle, Star, DollarSign, Clock, MapPin, Sparkles, RefreshCw, UtensilsCrossed, Heart, ChevronRight, Flame } from 'lucide-react';
// @ts-ignore;
import { Button, Badge, Card, CardContent, Slider, useToast } from '@/components/ui';

// 模拟店铺数据
const allShops = [{
  id: 1,
  name: '麦当劳',
  rating: 4.8,
  monthlySales: 9999,
  deliveryTime: '30分钟',
  distance: 1.2,
  deliveryFee: 0,
  minPrice: 20,
  tags: ['汉堡', '快餐'],
  image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'
}, {
  id: 2,
  name: '必胜客',
  rating: 4.6,
  monthlySales: 5888,
  deliveryTime: '45分钟',
  distance: 2.1,
  deliveryFee: 5,
  minPrice: 50,
  tags: ['披萨', '意面'],
  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
}, {
  id: 3,
  name: '海底捞',
  rating: 4.9,
  monthlySales: 3888,
  deliveryTime: '60分钟',
  distance: 3.5,
  deliveryFee: 0,
  minPrice: 100,
  tags: ['火锅', '川菜'],
  image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400'
}, {
  id: 4,
  name: '肯德基',
  rating: 4.5,
  monthlySales: 8888,
  deliveryTime: '35分钟',
  distance: 1.5,
  deliveryFee: 3,
  minPrice: 30,
  tags: ['炸鸡', '快餐'],
  image: 'https://images.unsplash.com/photo-1513639776629-7b6115d79f0f?w=400'
}, {
  id: 5,
  name: '喜茶',
  rating: 4.7,
  monthlySales: 6666,
  deliveryTime: '25分钟',
  distance: 0.8,
  deliveryFee: 2,
  minPrice: 15,
  tags: ['奶茶', '饮品'],
  image: 'https://images.unsplash.com/photo-1541658016705-82535e94bc69?w=400'
}, {
  id: 6,
  name: '西贝莜面村',
  rating: 4.6,
  monthlySales: 2888,
  deliveryTime: '50分钟',
  distance: 4.2,
  deliveryFee: 6,
  minPrice: 80,
  tags: ['西北菜', '中式'],
  image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400'
}, {
  id: 7,
  name: '星巴克',
  rating: 4.8,
  monthlySales: 5555,
  deliveryTime: '20分钟',
  distance: 0.5,
  deliveryFee: 0,
  minPrice: 30,
  tags: ['咖啡', '甜品'],
  image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
}, {
  id: 8,
  name: '真功夫',
  rating: 4.3,
  monthlySales: 4444,
  deliveryTime: '40分钟',
  distance: 2.8,
  deliveryFee: 4,
  minPrice: 25,
  tags: ['快餐', '中式'],
  image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400'
}];

// 菜品数据
const allDishes = [{
  id: 1,
  shopId: 1,
  shopName: '麦当劳',
  name: '巨无霸套餐',
  price: 45,
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c66cd?w=400'
}, {
  id: 2,
  shopId: 1,
  shopName: '麦当劳',
  name: '麦辣鸡腿堡套餐',
  price: 42,
  image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=400'
}, {
  id: 3,
  shopId: 2,
  shopName: '必胜客',
  name: '超级至尊披萨',
  price: 89,
  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
}, {
  id: 4,
  shopId: 2,
  shopName: '必胜客',
  name: '意式肉酱面',
  price: 39,
  image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400'
}, {
  id: 5,
  shopId: 3,
  shopName: '海底捞',
  name: '麻辣火锅套餐',
  price: 188,
  image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400'
}, {
  id: 6,
  shopId: 4,
  shopName: '肯德基',
  name: '全家桶',
  price: 99,
  image: 'https://images.unsplash.com/photo-1513639776629-7b6115d79f0f?w=400'
}, {
  id: 7,
  shopId: 5,
  shopName: '喜茶',
  name: '多肉葡萄',
  price: 29,
  image: 'https://images.unsplash.com/photo-1541658016705-82535e94bc69?w=400'
}, {
  id: 8,
  shopId: 7,
  shopName: '星巴克',
  name: '拿铁咖啡',
  price: 33,
  image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
}];

// 随机历史
const randomHistory = [{
  id: 1,
  type: 'shop',
  name: '麦当劳',
  time: '2小时前',
  image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200'
}, {
  id: 2,
  type: 'dish',
  name: '巨无霸套餐',
  shopName: '麦当劳',
  time: '昨天',
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c66cd?w=200'
}, {
  id: 3,
  type: 'shop',
  name: '喜茶',
  time: '3天前',
  image: 'https://images.unsplash.com/photo-1541658016705-82535e94bc69?w=200'
}];
// 辅助图标组件
function SlidersIcon({
  className
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>;
}

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
    icon: MapPin
  }, {
    id: 'random',
    label: '随机',
    icon: Shuffle
  }, {
    id: 'profile',
    label: '我的',
    icon: Heart
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
export default function Random(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [randomType, setRandomType] = useState('shop'); // shop, dish

  // 筛选条件
  const [minRating, setMinRating] = useState(4.0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [maxDistance, setMaxDistance] = useState(5);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleRandom = () => {
    setIsSpinning(true);
    setResult(null);

    // 筛选符合条件的店铺或菜品
    let candidates = randomType === 'shop' ? [...allShops] : [...allDishes];
    if (randomType === 'shop') {
      candidates = candidates.filter(shop => shop.rating >= minRating && shop.minPrice <= maxPrice && shop.distance <= maxDistance && (!onlyFreeDelivery || shop.deliveryFee === 0));
    } else {
      candidates = candidates.filter(dish => dish.price <= maxPrice);
    }
    if (candidates.length === 0) {
      setTimeout(() => {
        setIsSpinning(false);
        toast({
          title: '没有符合条件的选项',
          description: '请放宽筛选条件再试',
          variant: 'destructive'
        });
      }, 1000);
      return;
    }

    // 模拟随机过程
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setResult(candidates[randomIndex]);
      count++;
      if (count >= 15) {
        clearInterval(interval);
        setIsSpinning(false);
        const finalResult = candidates[Math.floor(Math.random() * candidates.length)];
        setResult(finalResult);
        toast({
          title: '🎉 随机结果出炉！',
          description: `为您推荐${randomType === 'shop' ? '店铺' : '菜品'}：${finalResult.name}`
        });
      }
    }, 100);
  };
  const handleShopClick = () => {
    if (result && randomType === 'shop') {
      $w.utils.navigateTo({
        pageId: 'shop-detail',
        params: {
          shopId: result.id
        }
      });
    } else if (result && randomType === 'dish') {
      $w.utils.navigateTo({
        pageId: 'shop-detail',
        params: {
          shopId: result.shopId
        }
      });
    }
  };
  const handleGoHome = () => {
    $w.utils.navigateTo({
      pageId: 'home',
      params: {}
    });
  };
  return <div className="min-h-screen bg-[#FFF8F0] pb-20">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#F7C59F] px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">随机选餐</h1>
          <div className="w-10" />
        </div>
        <p className="text-white/80 text-center text-sm">让选择困难症不再困难</p>
      </div>

      {/* 随机类型选择 */}
      <div className="px-4 -mt-4">
        <Card className="bg-white border-0 shadow-lg rounded-2xl">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <button onClick={() => setRandomType('shop')} className={`flex-1 py-4 rounded-xl flex flex-col items-center transition-colors ${randomType === 'shop' ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'}`}>
                <UtensilsCrossed className="w-8 h-8 mb-2" />
                <span className="font-medium">随机店铺</span>
              </button>
              <button onClick={() => setRandomType('dish')} className={`flex-1 py-4 rounded-xl flex flex-col items-center transition-colors ${randomType === 'dish' ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Sparkles className="w-8 h-8 mb-2" />
                <span className="font-medium">随机菜品</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选条件 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-[#2D3436] mb-4 flex items-center">
          <SlidersIcon className="w-5 h-5 mr-2 text-[#FF6B35]" />
          筛选条件
        </h2>
        
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4 space-y-6">
            {/* 最低评分 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[#2D3436] flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  最低评分
                </label>
                <span className="text-sm text-[#FF6B35] font-bold">{minRating.toFixed(1)}分</span>
              </div>
              <Slider value={[minRating]} onValueChange={value => setMinRating(value[0])} max={5} min={3} step={0.1} className="w-full" />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>3.0分</span>
                <span>5.0分</span>
              </div>
            </div>

            {/* 最高价格 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[#2D3436] flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                  最高价格
                </label>
                <span className="text-sm text-[#FF6B35] font-bold">¥{maxPrice}</span>
              </div>
              <Slider value={[maxPrice]} onValueChange={value => setMaxPrice(value[0])} max={200} min={20} step={10} className="w-full" />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>¥20</span>
                <span>¥200</span>
              </div>
            </div>

            {/* 最远距离 */}
            {randomType === 'shop' && <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#2D3436] flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    最远距离
                  </label>
                  <span className="text-sm text-[#FF6B35] font-bold">{maxDistance}km</span>
                </div>
                <Slider value={[maxDistance]} onValueChange={value => setMaxDistance(value[0])} max={10} min={1} step={0.5} className="w-full" />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>1km</span>
                  <span>10km</span>
                </div>
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* 随机按钮 */}
      <div className="px-4 mt-6">
        <Button onClick={handleRandom} disabled={isSpinning} className="w-full h-16 bg-gradient-to-r from-[#FF6B35] to-[#F7C59F] hover:from-[#FF6B35]/90 hover:to-[#F7C59F]/90 text-white rounded-2xl text-xl font-bold shadow-lg disabled:opacity-70">
          {isSpinning ? <RefreshCw className="w-8 h-8 mr-3 animate-spin" /> : <Shuffle className="w-8 h-8 mr-3" />}
          {isSpinning ? '随机中...' : '开始随机'}
        </Button>
      </div>

      {/* 随机结果 */}
      {result && <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-[#2D3436] mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-[#FF6B35]" />
            为您推荐
          </h2>
          <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden cursor-pointer" onClick={handleShopClick}>
            <CardContent className="p-0">
              <div className="relative h-40">
                <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">{result.name}</h3>
                  {randomType === 'dish' && <p className="text-white/80 text-sm mt-1">{result.shopName}</p>}
                </div>
                <Badge className="absolute top-4 right-4 bg-[#FF6B35] text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  精选推荐
                </Badge>
              </div>
              <div className="p-4">
                {randomType === 'shop' ? <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-[#FF6B35]">
                        <Star className="w-5 h-5 fill-current mr-1" />
                        <span className="font-bold">{result.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {result.deliveryTime}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {result.distance}km
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div> : <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#FF6B35]">¥{result.price}</span>
                    <Button size="sm" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full">
                      去下单
                    </Button>
                  </div>}
              </div>
            </CardContent>
          </Card>
        </div>}

      {/* 随机历史 */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-[#2D3436] mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-[#FF6B35]" />
          随机历史
        </h2>
        <div className="space-y-3">
          {randomHistory.map(item => <Card key={item.id} className="bg-white border-0 shadow-sm rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[#2D3436]">{item.name}</h4>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.type === 'shop' ? '店铺' : '菜品'}
                      </Badge>
                    </div>
                    {item.shopName && <p className="text-xs text-gray-500 mt-1">{item.shopName}</p>}
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                  <Heart className="w-5 h-5 text-gray-300" />
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* 底部导航 */}
      <TabBar current="random" $w={$w} />
    </div>;
}