// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Ticket, Clock, Copy, User, Gift } from 'lucide-react';
// @ts-ignore;
import { Button, Badge, Card, CardContent, useToast, Avatar, AvatarImage, AvatarFallback } from '@/components/ui';

export default function Coupons(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [coupons, setCoupons] = useState([]);
  const [userCoupons, setUserCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 检查登录状态
  const checkLoginStatus = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const auth = tcb.auth();
      if (auth.hasLoginState()) {
        const user = auth.currentUser;
        setIsLoggedIn(true);

        // 查询用户详细信息
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'user_info',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                openid: user.openId
              }
            },
            select: {
              $master: true
            },
            pageSize: 1
          }
        });
        if (result.records && result.records.length > 0) {
          setUserInfo(result.records[0]);
        }

        // 加载用户已领取的优惠券
        loadUserCoupons(user.openId);
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  // 加载用户已领取的优惠券
  const loadUserCoupons = async userId => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_coupon',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              user_id: userId,
              status: 'unused'
            }
          },
          select: {
            $master: true
          },
          pageSize: 100
        }
      });
      setUserCoupons(result.records || []);
    } catch (error) {
      console.error('加载用户优惠券失败:', error);
    }
  };

  // 从数据模型加载所有优惠券
  const loadCoupons = async () => {
    try {
      setLoading(true);
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
          getCount: true,
          pageSize: 100,
          pageNumber: 1
        }
      });

      // 转换数据格式
      const couponList = result.records.map(coupon => ({
        id: coupon._id,
        platform: coupon.platform || '未知平台',
        title: coupon.title || '',
        minSpend: coupon.min_spend || 0,
        discount: coupon.discount || 0,
        type: coupon.type || 'amount',
        expiry: coupon.expiry || '今日到期',
        color: coupon.color || '#FF6B35',
        code: coupon.code || ''
      }));
      setCoupons(couponList);
    } catch (error) {
      console.error('加载优惠券失败:', error);
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
    loadCoupons();
  }, []);

  // 领取优惠券
  const handleReceiveCoupon = async coupon => {
    if (!isLoggedIn) {
      toast({
        title: '请先登录',
        description: '登录后即可领取优惠券',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 检查是否已领取
      const existingCoupon = userCoupons.find(uc => uc.coupon_id === coupon.id);
      if (existingCoupon) {
        toast({
          title: '已领取',
          description: '您已经领取过该优惠券了',
          variant: 'destructive'
        });
        return;
      }

      // 创建用户优惠券记录
      await $w.cloud.callDataSource({
        dataSourceName: 'user_coupon',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            user_id: userInfo._id || userInfo.openid,
            coupon_id: coupon.id,
            platform: coupon.platform,
            title: coupon.title,
            code: coupon.code,
            discount: coupon.discount,
            min_spend: coupon.minSpend,
            color: coupon.color,
            status: 'unused',
            received_at: new Date().toISOString(),
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      });

      // 刷新用户优惠券列表
      await loadUserCoupons(userInfo._id || userInfo.openid);
      toast({
        title: '领取成功',
        description: `${coupon.platform} ${coupon.title} 已添加到您的卡包`
      });
    } catch (error) {
      console.error('领取优惠券失败:', error);
      toast({
        title: '领取失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };

  // 复制优惠码
  const handleCopyCode = coupon => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(coupon.code);
    }
    toast({
      title: '已复制优惠码',
      description: `${coupon.platform} ${coupon.title} - ${coupon.code}`
    });
  };

  // 跳转到登录页
  const handleLogin = () => {
    $w.utils.navigateTo({
      pageId: 'profile',
      params: {}
    });
  };
  const handleBack = () => {
    $w.utils.navigateBack();
  };

  // 检查优惠券是否已领取
  const isCouponReceived = couponId => {
    return userCoupons.some(uc => uc.coupon_id === couponId);
  };
  const filteredCoupons = activeTab === 'all' ? coupons : coupons.filter(c => {
    if (activeTab === 'eleme') return c.platform.includes('饿了么');
    if (activeTab === 'meituan') return c.platform.includes('美团');
    if (activeTab === 'jd') return c.platform.includes('京东');
    return true;
  });
  return <div className="min-h-screen bg-[#FFF8F0]">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#F7C59F] px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">优惠券</h1>
          <div className="w-10" />
        </div>
        
        {/* 用户信息区域 */}
        {isLoggedIn && userInfo ? <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12 border-2 border-white">
              <AvatarImage src={userInfo.avatar_url} />
              <AvatarFallback className="bg-white/20 text-white">
                {userInfo.nickname?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-white font-medium">{userInfo.nickname || '用户'}</p>
              <p className="text-white/70 text-xs">
                已领 {userCoupons.length} 张优惠券
              </p>
            </div>
          </div> : <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">游客</p>
              <p className="text-white/70 text-xs">登录后查看专属优惠券</p>
            </div>
            <Button size="sm" className="bg-white text-[#FF6B35] hover:bg-white/90 rounded-full" onClick={handleLogin}>
              去登录
            </Button>
          </div>}
        
        <div className="text-center">
          <p className="text-white/80 text-sm">
            {isLoggedIn ? '今日可用优惠券' : '可领取优惠券'}
          </p>
          <p className="text-4xl font-bold text-white mt-2">
            {isLoggedIn ? userCoupons.length : coupons.length}张
          </p>
        </div>
      </div>

      {/* 未登录提示 */}
      {!isLoggedIn && <div className="mx-4 -mt-2 mb-4">
          <Card className="bg-white/80 border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <Gift className="w-8 h-8 text-[#FF6B35]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">登录领取专属优惠</p>
                <p className="text-xs text-gray-500">新用户可领多张优惠券</p>
              </div>
              <Button size="sm" className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full" onClick={handleLogin}>
                立即登录
              </Button>
            </CardContent>
          </Card>
        </div>}

      {/* 筛选标签 */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[{
          id: 'all',
          label: '全部'
        }, {
          id: 'eleme',
          label: '饿了么'
        }, {
          id: 'meituan',
          label: '美团'
        }, {
          id: 'jd',
          label: '京东'
        }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-[#FF6B35] text-white' : 'bg-white text-gray-600 shadow-sm'}`}>
              {tab.label}
            </button>)}
        </div>
      </div>

      {/* 优惠券列表 */}
      <div className="px-4 py-4 pb-8 space-y-3">
        {loading ? <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div> : filteredCoupons.map(coupon => {
        const isReceived = isCouponReceived(coupon.id);
        return <Card key={coupon.id} className={`bg-white border-0 shadow-sm rounded-2xl overflow-hidden ${isReceived ? 'opacity-70' : ''}`}>
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="px-4 py-4 flex flex-col items-center justify-center min-w-[100px]" style={{
                backgroundColor: `${coupon.color}20`
              }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2" style={{
                  backgroundColor: coupon.color
                }}>
                        {coupon.platform[0]}
                      </div>
                      <span className="text-xs font-medium" style={{
                  color: coupon.color
                }}>
                        {coupon.platform}
                      </span>
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#2D3436]">{coupon.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {coupon.minSpend > 0 ? `满${coupon.minSpend}元可用` : '无门槛'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-[10px] bg-gray-100">
                            <Clock className="w-3 h-3 mr-1" />
                            {coupon.expiry}
                          </Badge>
                          <span className="text-[10px] text-gray-400">{coupon.code}</span>
                        </div>
                      </div>
                      {isReceived ? <Button size="sm" variant="outline" className="rounded-full px-4 border-gray-300 text-gray-500" onClick={() => handleCopyCode(coupon)}>
                          <Copy className="w-3 h-3 mr-1" />
                          已领
                        </Button> : <Button size="sm" className="rounded-full px-4" style={{
                  backgroundColor: coupon.color
                }} onClick={() => handleReceiveCoupon(coupon)}>
                          <Gift className="w-3 h-3 mr-1" />
                          领取
                        </Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>;
      })}

        {!loading && filteredCoupons.length === 0 && <div className="text-center py-12">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无该平台的优惠券</p>
          </div>}
      </div>

      {/* 底部提示 */}
      <div className="text-center pb-8">
        <p className="text-xs text-gray-400">
          {isLoggedIn ? '优惠券实时更新，以各平台实际为准' : '登录后查看更多专属优惠'}
        </p>
      </div>
    </div>;
}