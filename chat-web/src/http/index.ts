import axios from 'axios'
import {BASE_URL, AGENT_ID, AGENT_HUB_URL, DEFAULT_USER_ID} from './config'

// 获取agent
export const getAgent = () => {
  return axios.get(`${BASE_URL}/agents`)
}

// 获取agent的mode
export const getAgentMode = (agent: string) => {
  return axios.get(`${BASE_URL}/agents/${agent}`)
}

// 获取agent 历史消息
export const getAgentMessage = (agent: string) => {
  return axios.get(`${BASE_URL}/agents/${agent}/messages`)
}

// 清空agent历史消息
export const clearAgentMessage = async (agent: string) => {
  const event = {
    messages: []
  };
  return fetch(`${BASE_URL}/agents/${agent}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event })
  });
}

// agent切换模式
export const agentSwitchMode = (agent: string, mode: string) => {
  return axios.put(`${BASE_URL}/agents/${agent}/switch`, { mode })
}

// 发送消息(AI会话)
export const sendMessage = async (content: string, userId = DEFAULT_USER_ID) => {
  const event = {
    id: `evt_${Date.now()}`,  // 事件唯一标识符，格式为 "evt_" 加上毫秒级时间戳
    agent_id: AGENT_ID,       // 接收消息的代理ID
    event_type: "user_input", // 事件类型，用户输入固定为 "user_input"
    data: {
      content,
      user_id: DEFAULT_USER_ID,
    },
    timestamp: new Date().toISOString() // ISO格式的时间戳
  };

  await fetch(`${AGENT_HUB_URL}/agents/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event })
  });
}

// 中断消息
export const interruptMessage = async (agent: string) => {
  const event = {
    id: `evt_interrupt_${Date.now()}`,  // 事件唯一标识符，格式为 "evt_" 加上毫秒级时间戳
    agent_id: agent,       // 接收消息的代理ID
    event_type: "interrupt", // 事件类型 
    data: {},
    timestamp: new Date().toISOString() // ISO格式的时间戳
  };

  await fetch(`${AGENT_HUB_URL}/agents/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event })
  });
}

// 轮询新消息ID
export const pullMessageId = async () => {
  const response = await fetch(`${BASE_URL}/messages/agents/${AGENT_ID}/pop`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  const data = await response.json();
  return data.msg_id; // 新消息的唯一标识符，用于后续获取消息内容
}

// 获取消息内容
export const getMessageContent = async (msgId: string) => {
  let fullContent = "";
  let done = false;

  while (!done) {
    const response = await fetch(`${BASE_URL}/messages/agents/${AGENT_ID}/pull`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg_id: msgId }) // 需要获取内容的消息唯一标识符
    });

    const data = await response.json();
    done = data.done; // 是否已获取完所有消息块，true表示已完成

    if (data.chunk) {
      fullContent += data.chunk.content; // 消息文本内容
      console.log("收到部分回复:", data.chunk.content);
    }

    if (!data.chunk && !done) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return fullContent;
}


// 获取机器人硬件Schema
export const getRobotSchema = () => {
  return axios.get(`${BASE_URL}/body/status/schema`)
}
// 获取机器人硬件状态
export const getRobotData = () => {
  return axios.get(`${BASE_URL}/body/status`)
}