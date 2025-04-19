import service from './service'
import {BASE_URL } from './config'

// 获取用户列表
export const getUserList = () => {
  return service.get(`${BASE_URL}/users`)
}
// 新增用户
export const createNewUser =async (userData:object) => {
  return service.post(`${BASE_URL}/users`,userData)
}

// 获取人脸识别图片
export const getImgRes = (id) => {
  return service.put(`${BASE_URL}/users/${id}/image`)
}

// 中断流程
export const exitCreate = () => {
  return service.put(`${BASE_URL}/info/user/exit`)
}

// 删除用户
export const delUser = (id:string) => {
  return service.delete(`${BASE_URL}/users/${id}`)
}

// 获取用户信息
export const getUserInfo = (id:string) => {
  return service.get(`${BASE_URL}/users/${id}`)
}
// 更新用户信息
// 导出一个函数，用于更新用户信息
export const updateUser = (id:string, params:object) => {
  return service.put(`${BASE_URL}/users/${id}`, {user:params})
}

// 获取用户信息
export const getUserSchema = () => {
  return service.get(`${BASE_URL}/users-schema`)
}