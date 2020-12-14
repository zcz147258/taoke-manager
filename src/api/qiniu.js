/*
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-19 10:56:52
 */
import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
