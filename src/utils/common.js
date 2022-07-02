// 获取路由URL参数
function urlSearch(parmas) {
  let href = window.location.href
  let query = href.substring(href.indexOf('?')+1);
  let vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if(pair[0] == parmas){
      return pair[1];
    }
  }
}

// 深拷贝
function deepClone(obj){
  let objClone = Array.isArray(obj)?[]:{};
  if(obj && typeof obj === "object"){
    for(key in obj){
      if(obj.hasOwnProperty(key)){
          // 判断ojb子元素是否为对象，如果是，递归复制
        if(obj[key] && typeof obj[key] === "object"){
          objClone[key] = deepClone(obj[key]);
        }else{
          // 如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}  

// 防抖
function _debounce(fn, delay = 300) {
  var timer = null;
  return function () {
    var _this = this;
    var args = arguments;
    if (timer) clearTimeout(timer); 
    timer = setTimeout(function () {
      fn.apply(_this, args);
    }, delay);
  };
}

// 节流
function _throttle(fn,delay = 1000){
  var lastTime, timer, delay;
  return function(){
    var _this = this;
    var args = arguments;
    var nowTime = Date.now(); 
    if(lastTime && nowTime - lastTime < delay){
      if (timer) clearTimeout(timer); 
      timer = setTimeout(function(){
        lastTime = nowTime;
        fn.apply(_this,args);
      },delay)
    }else{
      lastTime = nowTime;
      fn.apply(_this,args);
    } 
  }
}

/*
* 下划线转换驼峰
*/ 
function underlineToHump(str) {
  // 如果首字母是_，执行 replace 时会多一个_，这里需要去掉
  if(str.slice(0,1) === '_'){ 
    str = str.slice(1);
  }
  return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
    return $1 + $2.toUpperCase();
  });
}

/*
* 驼峰转换下划线
*/ 
function humpToUnderline(str) {
  let temp = str.replace(/[A-Z]/g, function (match) { 
      return "_" + match.toLowerCase();
    });
  // 如果首字母是大写，执行replace时会多一个_，这里需要去掉
  if(temp.slice(0,1) === '_'){ 
    temp = temp.slice(1);
  }
  return temp;
}





export{
  urlSearch,
  deepClone,
  _debounce,
  _throttle,
  underlineToHump,
  humpToUnderline,
}
