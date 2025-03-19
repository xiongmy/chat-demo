import { Collapse,Typography } from 'antd';
import { useEffect, useState } from 'react';
import {
  UserOutlined,
  RobotOutlined
} from '@ant-design/icons';
import type { BubbleProps } from '@ant-design/x';
import Title from '../components/Title'
import { getAgentMessage } from "../http"
import markdownit from 'markdown-it';
import './EventBox.css'
const md = markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography>
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);
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
            children: renderMarkdown(msg.content)
          }
        ))
      setMessages([...list])
    })
  }, [])
  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  return (
    <div className='message-box'>
      <Title text={`消息列表${agent}`} />
      <Collapse items={messages} defaultActiveKey={['1']} onChange={onChange} />
    </div>
  );
};

export default EventBox;