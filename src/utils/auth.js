const localStorage = window.localStorage
const USER_KEY = 'user_info'

// export 也用来导出，它支持导出多个成员
// 它的方式有个好处就是：支持按需加载，需要谁才加载谁，打包(npm run build) 的时候，对于没有使用的时候不会打包到结果中

// 获取
export function getUser () {
  // JSON.parse 转换成对象
  return JSON.parse(localStorage.getItem(USER_KEY))
}

// 保存
export function saveUser (data) {
  // 把 data 转换成 JSON 格式
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}

// 删除
export function removeUser () {
  localStorage.removeItem(USER_KEY)
}
