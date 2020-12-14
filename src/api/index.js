/*
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-08-20 09:58:30
 */
import request from '@/utils/request2'
// 请求
// 登录
export function userLogin(query) {
  return request({
    url: '/admin-api/login',
    method: 'post',
    data: query
  })
}
// 退出登录
export function userLoginOut(query) {
  return request({
    url: '/admin-api/logOut',
    method: 'put',
    data: query
  })
}
// 鉴权
export function MenuNav(query) {
  return request({
    url: '/admin-api/sys/menu/nav',
    method: 'get',
    params: query
  })
}
// 登录验证码
export function loginCaptcha(query) {
  return request({
    url: '/admin-api/login/captcha',
    method: 'get',
    params: query
  })
}
// 提现列表
export function AccountList(query) {
  return request({
    url: '/admin-api/user/withdraw/account/list',
    method: 'get',
    params: query
  })
}
export function AllAccountList(query) {
  return request({
    url: '/admin-api/user/withdraw/account/all_list',
    method: 'get',
    params: query
  })
}
// 订单列表
export function orderList(query) {
  return request({
    url: '/admin-api/user/order/list',
    method: 'get',
    params: query
  })
}
// 订单明细
export function orderItem(query) {
  return request({
    url: `/admin-api/user/order/item/${query.orderId}`,
    method: 'get',
    params: query
  })
}
// 用户返利
export function userAccountList(query) {
  return request({
    url: '/admin-api/user/account/detail/list',
    method: 'get',
    params: query
  })
}
// 用户返利汇总
export function userAllAccountList(query) {
  return request({
    url: '/admin-api/user/account/list',
    method: 'get',
    params: query
  })
}
export function WithdrawsList(query) {
  return request({
    url: '/admin-api/user/withdraws/record/list',
    method: 'get',
    params: query
  })
}
// 用户返利表格信息下载
export function WithdrawsListDownload(query) {
  return request({
    url: '/admin-api/user/account/detail/all',
    method: 'get',
    params: query
  })
}
export function WithdrawsListSum(query) {
  return request({
    url: '/admin-api/user/withdraws/list',
    method: 'get',
    params: query
  })
}

export function DownloadWithdraws(query) {
  return request({
    url: '/admin-api/user/withdraws/record',
    method: 'post',
    params: query
  })
}

export function ConfigSelectable(query) {
  return request({
    url: '/admin-api/sys/config/selectable',
    method: 'get',
    params: query
  })
}

export function ConfigList(query) {
  return request({
    url: '/admin-api/sys/config/listAll',
    method: 'get',
    params: query
  })
}

export function ListSubDictByCode(query) {
  return request({
    url: '/admin-api/sys/dict/listSubDictByCode',
    method: 'get',
    params: query
  })
}

export function SaveConfig(query) {
  return request({
    url: '/admin-api/sys/config',
    method: 'post',
    params: query
  })
}

export function DelConfig(id) {
  return request({
    url: `/admin-api/sys/config/${id}`,
    method: 'delete',
    params: { id: id }
  })
}
// 权限菜单
export function PermissMenu() {
  return request({
    url: `/admin-api/sys/menu/list`,
    method: 'get',
    params: { }
  })
}
// 选择得菜单
export function SelectMenu() {
  return request({
    url: `/admin-api/sys/menu/select`,
    method: 'get',
    params: { }
  })
}

//红利
//添加
export function addBonusOrder(query) {
  return request({
    url: `/admin-api/bonus/order`,
    method: 'post',
    data: query
  })
}
// 修改
export function updateBonusOrder(query) {
  return request({
    url: `/admin-api/bonus/order`,
    method: 'put',
    data: query
  })
}
// 查询
export function bonusOrderList(query) {
  return request({
    url: `/admin-api/bonus/order/list`,
    method: 'get',
    params: query
  })
}

// 删除
export function deleteBonus(query) {
  return request({
    url: `/admin-api/bonus/order/${query.id}`,
    method: 'delete',
    params: query.id
  })
}

/**
 * 权限
 */
export function GetPermissionesList() {
  return request({
    url: `/admin-api/sys/perms`,
    method: 'get'
  })
}

