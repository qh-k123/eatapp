// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Search, SlidersHorizontal, Star, Clock, MapPin, Flame, TrendingUp, Filter } from 'lucide-react';
// @ts-ignore;
import { Button, Badge, Card, CardContent, Input, useToast } from '@/components/ui';

// 筛选选项
const filterOptions = [{
  id: 'all',
  label: '全部'
}, {
  id: 'highRating',
  label: '高评分',
  icon: Star
}, {
  id: 'fast',
  label: '速度快',
  icon: Clock
}, {
  id: 'nearby',
  label: '距离近',
  icon: MapPin
}, {
  id: 'hot',
  label: '热销',
  icon: Flame
}];

// 分类标签
const categories = [{
  id: 'all',
  label: '全部'
}, {
  id: 'fastfood',
  label: '快餐'
}, {
  id: 'chinese',
  label: '中餐'
}, {
  id: 'western',
  label: '西餐'
}, {
  id: 'drink',
  label: '饮品'
}, {
  id: 'dessert',
  label: '甜品'
}, {
  id: 'noodles',
  label: '面食'
}, {
  id: 'bbq',
  label: '烧烤'
}];
export default function ShopList(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [minRating, setMinRating] = useState(0);

  // 从数据模型加载店铺数据
  const loadShops = async () => {
    try {
      setLoading(true);
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
          getCount: true,
          pageSize: 100,
          pageNumber: 1
        }
      });

      // 转换数据格式
      const shopList = result.records.map(shop => ({
        id: shop._id,
        name: shop.name,
        rating: shop.rating || 4.5,
        monthlySales: shop.monthly_sales || 1000,
        deliveryTime: shop.delivery_time || '30分钟',
        distance: shop.distance || 1.0,
        deliveryFee: shop.delivery_fee || 0,
        minPrice: shop.min_price || 20,
        tags: shop.tags || ['美食'],
        image: shop.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        address: shop.address || '',
        phone: shop.phone || ''
      }));
      setShops(shopList);
    } catch (error) {
      console.error('加载店铺失败:', error);
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
    loadShops();
  }, []);

  // 筛选店铺
  useEffect(() => {
    if (shops.length === 0) return;
    let filtered = [...shops];

    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(shop => shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || shop.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    }

    // 分类筛选
    if (activeCategory !== 'all') {
      const categoryMap = {
        fastfood: '快餐',
        chinese: '中式',
        western: '西式',
        drink: '饮品',
        dessert: '甜品',
        noodles: '面食',
        bbq: '烧烤'
      };
      filtered = filtered.filter(shop => shop.tags.includes(categoryMap[activeCategory]));
    }

    // 排序筛选
    switch (activeFilter) {
      case 'highRating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'fast':
        filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        break;
      case 'nearby':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'hot':
        filtered.sort((a, b) => b.monthlySales - a.monthlySales);
        break;
      default:
        break;
    }

    // 高级筛选
    filtered = filtered.filter(shop => shop.rating >= minRating && shop.minPrice >= priceRange[0] && shop.minPrice <= priceRange[1]);
    setShops(filtered);
  }, [searchQuery, activeFilter, activeCategory, priceRange, minRating]);
  const handleShopClick = shop => {
    $w.utils.navigateTo({
      pageId: 'shop-detail',
      params: {
        shopId: shop.id
      }
    });
  };
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const clearFilters = () => {
    setActiveFilter('all');
    setActiveCategory('all');
    setPriceRange([0, 200]);
    setMinRating(0);
    setShowFilterPanel(false);
    loadShops(); // 重新加载数据
    toast({
      title: '筛选已重置'
    });
  };
  return <div className="min-h-screen bg-[#FFF8F0]">
      {/* 顶部搜索栏 */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="搜索店铺或菜品" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 h-11 bg-gray-100 border-0 rounded-full text-sm" />
          </div>
          <button onClick={() => setShowFilterPanel(!showFilterPanel)} className={`p-2 rounded-full ${showFilterPanel ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'}`}>
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'}`}>
              {cat.label}
            </button>)}
        </div>

        {/* 筛选选项 */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {filterOptions.map(filter => {
          const Icon = filter.icon;
          return <button key={filter.id} onClick={() => setActiveFilter(filter.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeFilter === filter.id ? 'bg-[#2EC4B6] text-white' : 'bg-gray-100 text-gray-600'}`}>
                {Icon && <Icon className="w-3 h-3" />}
                {filter.label}
              </button>;
        })}
        </div>
      </div>

      {/* 高级筛选面板 */}
      {showFilterPanel && <div className="bg-white px-4 py-4 border-b border-gray-100">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#2D3436] mb-2 block">最低评分</label>
              <div className="flex gap-2">
                {[0, 4.0, 4.5, 4.8].map(rating => <button key={rating} onClick={() => setMinRating(rating)} className={`px-4 py-2 rounded-full text-sm ${minRating === rating ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {rating === 0 ? '不限' : `${rating}分+`}
                  </button>)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#2D3436] mb-2 block">
                起送价: ¥{priceRange[0]} - ¥{priceRange[1]}
              </label>
              <div className="flex gap-2">
                <button onClick={() => setPriceRange([0, 30])} className={`px-4 py-2 rounded-full text-sm ${priceRange[1] === 30 ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  ¥30以下
                </button>
                <button onClick={() => setPriceRange([0, 50])} className={`px-4 py-2 rounded-full text-sm ${priceRange[1] === 50 ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  ¥50以下
                </button>
                <button onClick={() => setPriceRange([0, 100])} className={`px-4 py-2 rounded-full text-sm ${priceRange[1] === 100 ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  ¥100以下
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-full" onClick={clearFilters}>
                重置
              </Button>
              <Button className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full" onClick={() => setShowFilterPanel(false)}>
                确定
              </Button>
            </div>
          </div>
        </div>}

      {/* 店铺列表 */}
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">找到 {shops.length} 家店铺</span>
          {activeFilter !== 'all' && <Badge variant="secondary" className="bg-[#FFF8F0] text-[#FF6B35]">
              <Filter className="w-3 h-3 mr-1" />
              已筛选
            </Badge>}
        </div>
        
        {loading ? <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div> : <div className="space-y-4">
            {shops.map(shop => <Card key={shop.id} className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleShopClick(shop)}>
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-28 h-28 flex-shrink-0 relative">
                      <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                      {shop.rating >= 4.8 && <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded-full">
                          推荐
                        </div>}
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
                        <span className="flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          月售{shop.monthlySales}+
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {shop.deliveryTime}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {shop.distance}km
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          {shop.tags.slice(0, 2).map((tag, idx) => <Badge key={idx} variant="secondary" className="bg-[#FFF8F0] text-[#FF6B35] text-xs">
                              {tag}
                            </Badge>)}
                        </div>
                        <div className="text-xs text-gray-500">
                          起送¥{shop.minPrice} · {shop.deliveryFee === 0 ? '免配送费' : `配送¥${shop.deliveryFee}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>}

        {!loading && shops.length === 0 && <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500">没有找到符合条件的店铺</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={clearFilters}>
              清除筛选条件
            </Button>
          </div>}
      </div>
    </div>;
}