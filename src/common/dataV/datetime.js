/**
 * 时间日期相关操作
 */

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format (datetime) {
  return formatWithSeperator(datetime, '/', ':')
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator (datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime)
    const year = dateMat.getFullYear()
    const month = dateMat.getMonth() + 1
    const day = dateMat.getDate()
    const hh = dateMat.getHours()
    const mm = dateMat.getMinutes()
    const ss = dateMat.getSeconds()
    const timeFormat = year + dateSeprator + month + dateSeprator + day + ' ' + hh + timeSeprator + mm + timeSeprator +
			ss
    return timeFormat
  }
}
// 格式化年月日
export function getTime () {
  var d = new Date()
  var curr_date = d.getDate()
  var curr_month = d.getMonth() + 1
  var curr_year = d.getFullYear()
  String(curr_month).length < 2 ? (curr_month = '0' + curr_month) : curr_month
  String(curr_date).length < 2 ? (curr_date = '0' + curr_date) : curr_date
  var yyyyMMdd = curr_year + '-' + curr_month + '-' + curr_date
  return yyyyMMdd
}
// 获取时分秒
export function getDate () {
  var d = new Date()
  var curr_hour = d.getHours()
  var curr_min = d.getMinutes()
  var curr_sec = d.getSeconds()
  String(curr_hour).length < 2 ? (curr_hour = '0' + curr_hour) : curr_hour
  String(curr_min).length < 2 ? (curr_min = '0' + curr_min) : curr_min
  String(curr_sec).length < 2 ? (curr_sec = '0' + curr_sec) : curr_sec
  var currentTime = curr_hour + ':' + curr_min + ':' + curr_sec
  return currentTime
}
// 获取当前星期几
export function getWeekDate () {
  var day = new Date().getDay()
  var weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')
  var week = weeks[day]
  return week
}
// 一维数组转二维数组
export function arrTrans (num, arr) {
  const newArr = []
  while (arr.length > 0) {
    newArr.push(arr.splice(0, num))
  }
  return newArr
}
