import { Collapse,Typography } from 'antd';
import { useEffect, useState } from 'react';
import {
  UserOutlined,
  RobotOutlined,
  ReloadOutlined
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
    getList()
  }, [])
  // const onChange = (key: string | string[]) => {
  //   console.log(key);
  // };
  const getList = ()=>{
    getAgentMessage(agent).then(({data})=> {
      const list = data.messages.reverse().map(
        (msg: MessageData) => (
          {
            key: msg.msg_id,
            type: msg.type,
            label: (<p className={'ellipsis-text'}>
              {msg.role === `user` ? <UserOutlined className={'mr-1'} /> : <RobotOutlined className={'mr-1'} />} 
              {msg.content}
            </p>),
            content: msg.content,
            role: msg.role,
            name: msg.name,
            seq: msg.seq,
            children: renderMarkdown(msg.content)
          }
        ))
      setMessages([...list])
    })
  }
  return (
    <div className='message-box relative'>
      <Title text={`消息列表`} />
      <div className='absolute top-1 right-20 cursor-pointer text-blue-500' onClick={getList}><ReloadOutlined className='text-xl' /></div>
      <div className='message-list relative'>
        <Collapse items={messages} defaultActiveKey={['1']}  />
      </div>
    </div>
  );
};

export default EventBox;