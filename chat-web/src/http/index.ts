import axios from 'axios'
// const BASE_URL = 'http://10.168.1.117:20770'
const BASE_URL = '/api'
export const getAgent = () => {
    return axios.get(`${BASE_URL}/agents`)
}

export  const getAgentMode = (agent:string)=>{
    return axios.get(`${BASE_URL}/agents/${agent}`)
}

export  const getAgentMessage = (agent:string)=>{
    return axios.get(`${BASE_URL}/agents/${agent}/messages`)
}
