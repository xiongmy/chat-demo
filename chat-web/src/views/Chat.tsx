import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import { Layout, type GetProp, Typography } from 'antd';
import { useState } from 'react';
import markdownit from 'markdown-it';
import axios from "axios"
const { Header } = Layout;
const md = markdownit({ html: true, breaks: true });

interface BubbleType {
  role: string,
  content: string,
  loading?: boolean
}
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

const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography>
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

const Chat = () => {
  const [content, setContent] = useState('');
  const [bubbles, setBubbles] = useState<BubbleType[]>([])

  const onRequest = (role = 'user', content = '') => {
    let startTime = new Date().getTime();
    // chat request
    axios({
      method: 'get',
      url: `http://127.0.0.1:5000/api/chat?role=${role}&content=${content}`,
    })
      .then(function (response) {
        let endTime = new Date().getTime();
        console.log('思考时间：' + Math.floor((endTime - startTime) / 1000) + ' s')
        setBubbles(bubbles => [...bubbles.slice(0, bubbles.length - 1), { role: 'ai', content: response.data }])
      });
  }


  const afterInput = (msg: string) => {
    setBubbles([...bubbles, { role: 'local', content: msg }, { role: 'ai', content: '...', loading: true }])
    onRequest('user', msg);
    setContent('')
  }
  const bubbleEle = () => {
    const elements = bubbles.map((bubble, i) =>
      <Bubble
        typing
        key={i}
        loading={bubble.loading}
        placement={bubble.role === 'ai' ? 'start' : 'end'}
        content={bubble.content}
        messageRender={renderMarkdown}
        avatar={{ icon: bubble.role === 'ai' ? <RobotOutlined /> : <UserOutlined /> }}
        style={{ marginBottom: '10px', minWidth: '600px' }}
      />
    );

    return elements
  }

  return (
    <div className='w-full h-full relative'>
      <Header style={{ background: '#666', color: '#FFF', fontSize: '18px', textAlign: 'center' }}>AI会话{bubbles[bubbles.length]?.loading}</Header>
      <div
        className='bg-gray-100 m-4 rounded-sm p-2 overflow-y-scroll'
        style={{ height: '700px' }}

      >{bubbleEle()}</div>
      <div
        className='w-full absolute bottom-0 mb-4'
      >
        <Sender
          className='w-4/5 m-auto  '
          style={{ maxWidth: '500px', maxHeight: '100px' }}
          value={content}
          allowSpeech
          loading={bubbles[bubbles.length-1]?.loading}
          onChange={setContent}
          onSubmit={(nextContent) => {
            afterInput(nextContent);
          }}
        />
        <h3 className='text-center '>
          {new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate()}
        </h3>
      </div>
    </div>
  );
};

export default Chat;