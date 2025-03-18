import { Collapse, Badge } from 'antd';
import { useEffect, useState } from 'react';
import {
  UserOutlined,
  RobotOutlined
} from '@ant-design/icons';
import Title from '../components/Title'
import { getAgentMessage } from "../http"
interface MessageData {
  type: string,
  msg_id: string,
  content: string,
  role: string,
  name: string
  seq: string
}

const EventBox = ({ agent = 'simple-chat' }) => {
  const [messages, setMessages] = useState<MessageData[]>([])
  useEffect(() => {
    getAgentMessage(agent).then(res => {
      const list = res.data.messages.map(
        (msg: MessageData) => (
          {
            key: msg.msg_id,
            type: msg.type,
            label: <p>
              {msg.role === `user` ? <UserOutlined /> : <RobotOutlined />} 
              <span>{msg.content.substring(0, 10)}</span>
            </p>,
            content: msg.content,
            role: msg.role,
            name: msg.name,
            seq: msg.seq,
            children: <p>{msg.content}</p>
          }
        ))
      setMessages([...list])
    })
  }, [])
  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  return (
    <div className='left-bar'>
      <Title text={`事件列表${agent}`} />
      <Collapse items={messages} defaultActiveKey={['1']} onChange={onChange} />
    </div>
  );
};

export default EventBox;