import service from './service'
import {BASE_URL } from './config'

// 获取用户列表
export const getUserList = () => {
  return service.get(`${BASE_URL}/info/user/list`)
}
// 新增用户
export const createNewUser =async (name:string) => {
  return service.post(`${BASE_URL}/info/user/create?user_name=${name}`)
}
// 获取人脸识别图片
export const getImgRes = () => {
  return service.get(`${BASE_URL}/info/user/image`)
}

// 中断流程
export const exitCreate = () => {
  return service.put(`${BASE_URL}/info/user/exit`)
}


// 中断流程
export const delUser = (id:string) => {
  return service.delete(`${BASE_URL}/info/user/del?user_id=${id}`)
}