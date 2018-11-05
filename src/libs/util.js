import Cookies from 'js-cookie'
import $ from 'jquery';
import iView from 'iview';
// cookie保存的天数
import config from '@/config'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'

import axios from '@/libs/api.request'

let util = {};

// export default util;

export const ajax = function (options){
    var _this = this;

    var defaults_options = {
        timeout: 30000,
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url:'',
        method:'get',
    }

    if (options.data == undefined) {
        options.data = {};
    }
    options.data.timeStamp = (new Date()).getTime();

    var token = getToken();
    if (token && token != undefined && token != null && token != 'undefined' && token != '') {
        var token = JSON.parse(token);
        // 带上认证信息
        defaults_options.headers.Authorization = token.token_type + ' ' + token.access_token;
        options.data.refresh = token.refresh_token;
    }


    if (options.method == 'get' && options.params == undefined) {
        options.params = options.data != undefined ? options.data : {};
    }
    $.extend(defaults_options, options);

    axios.request(defaults_options)
        .then(function (response) {
            if (defaults_options.success) {
                // 所有 ajax 如果登录过期，跳转到登录
                // if (typeof(response.data.error) != 'undefined') {
                //     var error = response.data.error;
                //     var path_name = Store.getters.route.name;
                //     if (error == 10002) {
                //         Store.dispatch('logout') // 退出登录
                //         if (path_name != 'login') {  // 必须要登录的路由
                //             iView.Notice.error({title: '提示', desc: "登录已过期，请重新登录"});
                //             router.push({name: 'login'});
                //             return;
                //         }
                //     }
                // }

                defaults_options.success(response.data, response);
            }else {
                iView.Notice.success({ title: '提示', desc: '操作成功' });
            }
        })
        .catch(function (error) {
            if (error.response) {
                if (defaults_options.error) {
                    defaults_options.error(response);
                }else {
                    iView.Notice.error({ title: '提示', desc: '操作失败' });
                }
            } else {
                iView.Notice.error({ title: '提示', desc: error.message });
            }
        });
}


export const extend = function (objFirst, objSecond, mergeArray) {
    if (typeof objSecond === 'object' && !isNaN(objSecond.length)) {    // 如果 第二个对象 是数组对象
        if (mergeArray == undefined || mergeArray == null) {
            objFirst = objSecond;   // 直接覆盖
        }else {
            objFirst = objFirst.concat(objSecond);
        }
    }else {
        for (var s in objSecond) {
            if (objFirst[s] == undefined || (typeof objFirst[s] != 'object' && typeof objSecond[s] === 'object')) { // 如果 objFrist 不存在, 或者类型不一致 ，直接赋值,
                objFirst[s] = objSecond[s];
            } else if (typeof objSecond[s] === 'object' && !isNaN(objSecond[s].length)){    // 如果 是数组对象，直接赋值,默认前面也是数组对象
                if (mergeArray == undefined || mergeArray == null) {      // 不合并数组
                    objFirst[s] = objSecond[s];     // 默认直接赋值
                }else {
                    objFirst[s] = objFirst[s].concat(objSecond[s]);     // 合并
                }
            } else if (typeof objSecond[s] === 'object') {          // 如果是对象
                objFirst[s] = util.extend(objFirst[s], objSecond[s], mergeArray);
            } else {                        // 直接赋值
                objFirst[s] = objSecond[s];
            }
        }
    }

    return objFirst;
}

util.baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
util.apiUrl = function (url, noAuth) {
    var url = util.baseUrl + url;

    if (noAuth) {
        return url;
    } else {
        return url;
        // var auth = util.authToken();
        // return url + "?" + $.param(auth);
    }

}
util.ajax = ajax;
util.extend = extend;

export default util;


export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {expires: config.cookieExpires || 1})
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

// smallews 增加 is_super
const showThisMenuEle = (item, access, is_super) => {
  if (is_super) {
    return true;
  } else {
    if (item.meta && item.meta.access && item.meta.access.length) {
      if (hasOneOf(item.meta.access, access)) return true
      else return false
    } else return true
  }
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 * smallews 增加 is_super
 */
export const getMenuByRouter = (list, access, is_super) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access, is_super)) {
        obj.children = getMenuByRouter(item.children, access, is_super)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access, is_super)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let meta = {...item.meta}
    if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route)
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{...homeItem, to: homeRoute.path}, ...res]
}

export const getRouteTitleHandled = route => {
  let router = {...route}
  let meta = {...route.meta}
  if (meta.title && typeof meta.title === 'function') meta.title = meta.title(router)
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 * smallews 增加 is_super
 */
const hasAccess = (access, route, is_super) => {
  if (is_super) {       // smallnews 增加 is_super
    return true;
  }else {
    if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
    else return true
  }
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @param {*} 增加 is_super smallnews
 * @description 用户是否可跳转到该页
 * smallews 增加 is_super
 */
export const canTurnTo = (name, access, routes, is_super) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item, is_super)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    console.log(route, index, list.length)
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}
