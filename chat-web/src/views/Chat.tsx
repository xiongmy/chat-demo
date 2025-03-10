import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import { Col, Flex, Layout, type GetProp } from 'antd';
import { useState } from 'react';
import axios from "axios"
const { Footer } = Layout;


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
        addBubbles({ role: 'ai', message: response.data })
      });
  }
  const addBubbles = (bubble: BubbleType) => {
    setBubbles([...bubbles, {
      role: bubble.role,
      message: bubble.message
    }])
  }

  const afterInput = (msg: string) => {
    addBubbles({ role: 'local', message: msg })
    onRequest('user', msg);
    setContent('')
  }

  return (
    <div style={{width:'100%'}}>
      <Bubble.List
        roles={roles}
        items={bubbles.map((item, i) => {
          return { key: i, role: item.role, content: item.message };
        })}
      />
      <div
        style={{width:'100%' }}
      >
        <Sender
        style={{width:'80%',maxWidth:'500px',margin:'0 auto'}}
          value={content}
          onChange={setContent}
          onSubmit={(nextContent) => {
            afterInput(nextContent);
          }}
        />
        <Footer style={{ textAlign: 'center' }}>
          {new Date().getFullYear() + '.' + (new Date().getMonth()+1) + '.' + new Date().getDate()}
        </Footer>
      </div>

    </div>
  );
};

export default Chat;