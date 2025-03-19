import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, Welcome } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import { Typography } from 'antd';
import { useState, useRef } from 'react';
import markdownit from 'markdown-it';
import Title from './../components/Title';
import { BubbleType } from './../props'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { sendMessage, pullMessageId, getMessageContent } from './../http'
import './Chat.css'
import welcomePng from './../assets/welcome.png'


const md = markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography>
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

const Chat = ({ agent }) => {
  const [content, setContent] = useState('');
  const [bubbles, setBubbles] = useState<BubbleType[]>([])
  const messageRef: HTMLDivElement = useRef<any>(null)

  const startStream = async (role = 'user', content = '') => {
    let startTime = new Date().getTime();
    const data = {
      model: 'deepseek-chat',
      stream: true,
      messages: [{
        content,
        role,
        name: 'user'
      }]
    }
    let newContent = ''
    await fetchEventSource('/llms/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      onmessage(event) {
        // 接收服务器发送的每条事件
        const res = event.data
        newContent += JSON.parse(res).choices[0].delta.content
        setBubbles(bubbles => [...bubbles.slice(0, bubbles.length - 1), { role: 'ai', content: newContent, }])
        messageRef.current.scrollTop = messageRef.current.scrollHeight
      },
      onclose() {
        let endTime = new Date().getTime();
        console.log('思考时间：' + Math.floor((endTime - startTime) / 1000) + ' s')
      },
      onerror(err) {
        // 错误处理（默认会抛出异常并自动重试）
        console.error('错误:', err);
        throw err; // 抛出错误会触发重试机制
      }
    });
  }
  const sendAndReceiveMsg = async (content: string) => {
    await sendMessage(content, '')
    let msgId = null;
    while (!msgId) {
      msgId = await pullMessageId();
      if (!msgId) await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. 获取消息内容
    const reply = await getMessageContent(msgId);
    console.log("完整回复:", reply);
    setBubbles(bubbles => [...bubbles.slice(0, bubbles.length - 1), { role: 'ai', content: reply, }])
        messageRef.current.scrollTop = messageRef.current.scrollHeight
  }

  const afterInput = (msg: string) => {
    setBubbles([...bubbles, { role: 'local', content: msg }, { role: 'ai', content: '...', loading: true }])
    setContent('')
    // startStream('user', msg);
    sendAndReceiveMsg(msg)
  }
  const bubbleEle = () => {
    const elements = bubbles.map((bubble, i) =>
      <Bubble
        key={i}
        loading={bubble.loading}
        placement={bubble.role === 'ai' ? 'start' : 'end'}
        content={bubble.content}
        messageRender={renderMarkdown}
        avatar={{ icon: bubble.role === 'ai' ? <RobotOutlined /> : <UserOutlined />, style: { background: bubble.role === 'ai' ? '#fde3cf' : '#87d068' } }}
        style={{ marginBottom: '10px', }}
      />
    );

    return elements
  }

  return (
    <div className='w-full h-full relative'>
      <Title text={`桌面助手${agent}`} />
      {bubbles.length ?
        <div
          ref={messageRef}
          className='m-4 rounded-sm p-2 overflow-y-auto'
          style={{ maxHeight: '80%' }}
        >{bubbleEle()}</div> : <div className='w-3/5 m-auto my-2'>
          <Welcome
            icon={<img src={welcomePng}/>}
            title="你好"
            description="欢迎开启美好的一天，希望能帮助你"
          />
        </div>
      }
      <div
        className='w-full absolute bottom-0'
      >
        <Sender
          className='w-4/5 m-auto'
          style={{ maxWidth: '500px', maxHeight: '100px' }}
          value={content}
          allowSpeech
          loading={bubbles[bubbles.length - 1]?.loading}
          onChange={setContent}
          onSubmit={(nextContent) => {
            afterInput(nextContent);
          }}
        />
        <p className='text-center '>
          {new Date().getFullYear() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate()}
        </p>
      </div>
    </div>
  );
};

export default Chat;