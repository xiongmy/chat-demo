import { Collapse,Typography } from 'antd';
import { useEffect, useState } from 'react';
import {
  UserOutlined,
  RobotOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { BubbleProps } from '@ant-design/x';
import Title from '@/components/Title'
import { getAgentMessage } from "../http"
import markdownit from 'markdown-it';


const AgentInfo = ({ agent = 'simple-chat' }) => {
  const [messages, setMessages] = useState<MessageData[]>([])
  
  return (
    <div className='agent-info'>
      <p>agentinfo</p>
      
    </div>
  );
};

export default AgentInfo;