angular.module('starter.config', [])
//获取访问路径
  .factory('pathService', pathServ)
  //持久化信息
  .factory('basicConfig', basicConfig);

/**
 * <p>方法描述:获取访问路径 </p>
 * @param pathName 链接名称
 * @returns 链接地址
 */
function pathServ() {

  /**
   * server config
   */
  var ip = "http://192.168.1.6:8101";
  var baseUrl = 'http://'+ip+'/zhelaigou_mgmt/app/mobile/';
  var wwwSource = 'http://192.168.1.6/sandbox';
  var fileUrlPrefix = 'http://'+ip+'/zhelaigou_mgmt';
  var suffix = '?jsonp=JSON_CALLBACK';
  var timeOut = 15000;



  var paths = [
    {
      pathName: 'searchLuceneByCondition',
      pathLink: 'goodsShow/searchLuceneByCondition'
    },
    {
      pathName: 'validateMobile',
      pathLink: 'user/validateMobile'
    },
    {
      pathName: 'login',
      pathLink: 'user/login'
    },
    {
      pathName: 'userInfoUrl',
      pathLink: 'user/getUserInfo'
    },
    {
      pathName: 'updateUserInfoUrl',
      pathLink: 'user/updateUserInfo'
    },
    {
      pathName: 'uploadHeadUrl',
      pathLink: 'user/uploadHead'
    },
    {
      pathName: 'updatePasswordUrl',
      pathLink: 'user/updateUserPassword'
    },
    {
      pathName: 'group',
      pathLink: 'goodsShow/group'
    },
    {
      pathName: 'label',
      pathLink: 'goodsShow/label'
    },
    {
      pathName: 'getGoodsListByGroup',
      pathLink: 'goodsShow/getGoodsListByGroup'
    },
    {
      pathName: 'getHomeData',
      pathLink: 'goodsShow/home'
    },
    {
      pathName: 'resetPassword',
      pathLink: 'user/resetPassword'
    },
    {
      pathName: 'getCodeMaker',
      pathLink: 'user/getCodeMaker'
    },
    {
      pathName: 'goodsDetailShare',
      pathLink: 'goodsShow/addGoodsShareRecord'
    },
    {
      pathName: 'getGoodsListByLable',
      pathLink: 'goodsShow/getGoodsListByLable'
    },
    {
      pathName: 'addGetCoupon',
      pathLink: 'goodsShow/addGetCoupon'
    },
    {
      pathName: 'register',
      pathLink: 'user/register'
    },
    {
      pathName: 'sendCode',
      pathLink: 'user/sendCode'
    },
    {
      pathName: 'currentTask',
      pathLink: 'user/getTask'
    },
    {
      pathName: 'validateMobileCode',
      pathLink: 'user/validateMobileCode'
    },
    {
      pathName: 'goodsDetailUrl',
      pathLink: 'goodsShow/getGoodsDetails'
    },
    {
      pathName: 'firstOrderUrl',//首单绑定
      pathLink: 'user/firstOrder'
    },
    {
    	pathName: 'getSharedGoodsList',//二级分享
    	pathLink: 'goodsShow/getSharedGoodsList'
    },
    {
    	pathName: 'getSharedGoodsDetails',//二级分享商品详情
    	pathLink: 'goodsShow/getSharedGoodsDetails'
    },
    {
      pathName:'getShareAppScore',
      pathLink:'user/addShare'
    },
    {
      pathName:'getSubordinate',
      pathLink:'user/contributeScore'
    },
    {
      pathName:'getAllAward',//获得积分查询
      pathLink:'user/ScoreDetail'
    },
    {
      pathName:'getDescendant',
      pathLink:'user/getDescendant'
    },
    {
      pathName: 'searchExposureGoods',
      pathLink: 'exposure/searchExposureGoods'
    },
    {
      pathName: 'searchAllExposureGoods',
      pathLink: 'exposure/searchAllExposureGoods'
    },
    {
      pathName: 'exposureGoods',
      pathLink: 'exposure/exposureGoods'
    },
    {
      pathName: 'iLike',
      pathLink: 'exposure/iLike'
    },
    {
      pathName:'getFutureScore',//即将获取积分查询
      pathLink:'user/FutureScore'
    },
    {
      pathName: 'getOrderRecord',//我的订单
      pathLink: 'orderShow/getOrderRecord'
    },
    {
      pathName:'addOrdersException',//申述
      pathLink:'exposure/addOrdersException'
    },
    {
    	pathName:'signIn',//签到
    	pathLink:'goodsShow/signIn'
    },
    {
    	pathName:'findOrdersException',//签到
    	pathLink:'exposure/findOrdersException'
    },
    {
    	pathName:'isExposure',//已经晒单
    	pathLink:'exposure/isExposure'
    },
    {
    	pathName:'validateException',//已经申诉
    	pathLink:'exposure/validateException'
    },
    {
      pathName:'boundOrder',//首单绑定
      pathLink:'orderShow/orderMatching'
    },
    {
      pathName:'orderGuide',//判断是否需要提示用户手动绑定订单号
      pathLink:'orderShow/queryMultiUserOrder'
    },
    {
      pathName:'queryOnlineConsult',//查询在线咨询
      pathLink:'user/query'
    },
    {
      pathName:'addConsult',//储存在线咨询
      pathLink:'user/addConsumerConsults'
    },
    {
    	pathName:'messageList',//站内信列表
    	pathLink:'notice/list'
    },
    {
    	pathName:'messageIsReady',//站内信已读
    	pathLink:'notice/isReady'
    },
    {
    	pathName:'messageDelete',//站内信删除
    	pathLink:'notice/delete'
    },
    {
      pathName:'advGoodsList',
      pathLink:'goodsShow/getCustomModelGoods'
    },
    {
      pathName:'scoreRank',//积分排名
      pathLink:'userScore/getUserScoreRank'
    },
    {
      pathName:'selfRank',//自己的排名
      pathLink:'userScore/getSelfScoreRank'
    },
    {
      pathName:'concatInfo',//联系方式
      pathLink:'orderShow/getConcatInfo'
    },
    {
    	pathName:'toScoreConvertPage',//获取积分兑换信息
    	pathLink:'user/toScoreConvertPage'
    },
    {
    	pathName:'scoreConvert',//兑换积分
    	pathLink:'user/scoreConvert'
    },
    {
    	pathName:'validateConvert',//验证用户是否绑定支付宝
    	pathLink:'user/validateConvert'
    }

  ];
  return {
    getPath: function (pathName) {
      for (var i = 0; i < paths.length; i++) {
        if (paths[i].pathName == pathName) {
          var url = baseUrl+paths[i].pathLink+suffix;
          return url;
        }
      }
    },
    getFilePath: function () {
      return fileUrlPrefix;
    },
    get3wSource: function(){
      return wwwSource;
    },
    getTimeout: function () {
      return timeOut;
    }

  }
};
/**
 *
 * <p>方法描述:持久化数据 </p>
 * <p>创建人: wangjian</p>
 * <p>创建时间: 下午5:42:27</p>
 * <p>修改人: </p>
 * <p>修改时间: </p>
 * <p>修改备注: </p>
 * @param key 存储的键名
 * @param object 对象名称
 */
function basicConfig() {
  return {
    //创建对象
    setObject: function (key, object) {
      //对象转化成json
      var _object = angular.toJson(object);
      //保存json对象
      localStorage.setItem(key, _object);
    },
    //获取对象
    getObject: function (key) {
      //返回json转化后的对象
      return angular.fromJson(localStorage.getItem(key));
    },
    //删除对象
    removeObject: function (key) {
      localStorage.removeItem(key);
    }
  }
};
/*
 * key
 * searchHistory : 用户搜索商品历史（最多10条）
 */
/*
 * key
 * time : 过去验证码倒计时
 * date ： 最后获取验证码时间
 */

/**
 * key firstGoodsDetail
 * booleanFirstGet :是否是第一次进入商品详情页面
 */
/*
 * key
 * user:用户信息
 * key
 * shareUrlChain:分享链接
 *
 */
