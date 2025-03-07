import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import { useState } from 'react';
import axios from "axios"


const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
  },
  local: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

interface BubbleType {
  role: string,
  message: string,
}

const Chat = () => {
  const [content, setContent] = useState('');
  const [bubbles, setBubbles] = useState<BubbleType[]>([])

  const onRequest = (role = 'user', content = '') => {
    // chat request
    axios({
      method: 'get',
      url: `http://127.0.0.1:5000/api/chat?role=${role}&content=${content}`,
    })
      .then(function (response) {
        console.log(response.data)
        addBubbles({role:'ai', message:response.data})
      });
  }
  const addBubbles = (bubble:BubbleType) => {
    setBubbles([...bubbles, {
      role:bubble.role,
      message:bubble.message
    }])
  }

  const afterInput = (msg:string) => {
    addBubbles({role:'local',message:msg})
    onRequest('user', msg);
    setContent('')
  }

  return (
    <Flex vertical gap="middle">
      <Bubble.List
        style={{ maxHeight: 300 }}
        roles={roles}
        items={bubbles.map((item, i) => {
          return { key: i, role: item.role, content: item.message };
        })}
      />
      <Sender
        value={content}
        onChange={setContent}
        onSubmit={(nextContent) => {
          afterInput(nextContent);
        }}
      />
    </Flex>
  );
};

export default Chat;