import axios from 'axios'
import {BASE_URL, AGENT_ID, AGENT_HUB_URL, DEFAULT_USER_ID} from './config'


// 获取用户列表
export const getUserList = () => {
  return axios.get(`${BASE_URL}/info/user/list`)
}
// 新增用户
export const createNewUser =async (name:string) => {
  return axios.post(`${BASE_URL}/info/user/create?user_name=${name}`)
}
// 获取人脸识别图片
export const getImgRes = () => {
  return axios.get(`${BASE_URL}/info/user/image`)
}

// 中断流程
export const exitCreate = () => {
  return axios.put(`${BASE_URL}/info/user/exit`)
}


// 中断流程
export const delUser = (id:string) => {
  return axios.delete(`${BASE_URL}/info/user/del?user_id=${id}`)
}