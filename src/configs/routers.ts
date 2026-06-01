import HOME from '../pages/home.jsx';
import SHOP_LIST from '../pages/shop-list.jsx';
import SHOP_DETAIL from '../pages/shop-detail.jsx';
import RANDOM from '../pages/random.jsx';
import PROFILE from '../pages/profile.jsx';
import COUPONS from '../pages/coupons.jsx';
export const routers = [{
  id: "home",
  component: HOME
}, {
  id: "shop-list",
  component: SHOP_LIST
}, {
  id: "shop-detail",
  component: SHOP_DETAIL
}, {
  id: "random",
  component: RANDOM
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "coupons",
  component: COUPONS
}]