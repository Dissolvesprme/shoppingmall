// 公共方法
// 防抖操作
export function debounce(func, delay) {
  let timer = null 

  return function (...args) {
    if (timer) clearTimeout(...args)

   timer = setTimeout(() => {
     func.apply(this, args)
   }, delay);
  }
}



// 封装格式化时间正则函数  (时间, '格式化') 
export function formatDate(date, fmt) {
  // 获取年份
  // 2021
  if(/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  // 2.获取
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

// 如果传过来是个单数,前面加个0
function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}