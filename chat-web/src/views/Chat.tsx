import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, Welcome } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import { Layout, type GetProp, Typography } from 'antd';
import { useState, useEffect } from 'react';
import markdownit from 'markdown-it';
import axios from "axios"
import { BubbleType, HistoryType } from './propsType'
import { fetchEventSource } from '@microsoft/fetch-event-source';


const { Header } = Layout;
const md = markdownit({ html: true, breaks: true });
const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography>
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

const Chat = () => {
  const [content, setContent] = useState('');
  const [bubbles, setBubbles] = useState<BubbleType[]>([])
  const [history, setHistory] = useState<HistoryType[]>([])

  const onRequest = (role = 'user', content = '') => {
    let startTime = new Date().getTime();
    let newBubble: BubbleType = {}
    // axios.post('/llms/openai/chat/completions', {
    //   model: 'deepseek-chat',
    //   stream: true,
    //   messages: [{
    //     content,
    //     role,
    //     name: 'user'
    //   }]
    //   },
    //   {
    //     headers: {
    //       'responseType': 'stream'
    //     }
    //   })
    axios({
      method: 'post',
      url: '/llms/openai/chat/completions',
      responseType: 'stream',
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        model: 'deepseek-chat',
        stream: true,
        messages: [{
          content,
          role,
          name: 'user'
        }]
      }
    })
      .then(async function (response: any) {
        // let endTime = new Date().getTime();
        // console.log('思考时间：' + Math.floor((endTime - startTime) / 1000) + ' s')
        // newBubble = { role: 'ai', content: response.data }
        // console.log
        response.data.on("data", (chunk: any) => {
          console.log(chunk, "data");
          // 处理每个数据块，例如写入文件或进行其他操作
        });

        response.data.on("end", (end: any) => {
          console.log(end, "end");
          // 数据接收完毕的处理逻辑
        });

        response.data.on("error", () => {
          // 流处理过程中发生错误的处理逻辑
          console.log('err')
        });

        // setBubbles(bubbles => [...bubbles.slice(0, bubbles.length - 1), { role: 'ai', content: response.data }])
      }).catch((err) => {
        console.log(err)
        // setBubbles(bubbles => [...bubbles.slice(0, bubbles.length - 1), { role: 'ai', content: 'catch error', }])
        newBubble = { role: 'ai', content: 'catch error', }

      }).finally(() => {
        setBubbles(bubbles => [...bubbles.slice(0, bubbles.length - 1), newBubble])
      })
  }
  const getStream = async (role = 'user', content = '') => {
    const data = {
      model: 'deepseek-chat',
      stream: true,
      messages: [{
        content,
        role,
        name: 'user'
      }]
    }
    const res: any = await fetch('/llms/openai/chat/completions', {
      method: 'POST',
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(res)
    // 获取 reader
    const reader = res.body.getReader();

    // 读取数据
    return reader.read().then(function process({ done, value }) {
      if (done) {
        console.log('Stream finished');
        return;
      }

      console.log('Received data chunk', value);

      // 读取下一段数据
      return reader.read().then(process);
    });
    // const reader = res.body.getReader();
    // const decoder = new TextDecoder();
    // while (1) {
    //   // 读取数据流的第一块数据，done表示数据流是否完成，value表示当前的数
    //   const { done, value } = await reader.read();
    //   if (done) break;
    //   console.log(JSON.stringify(value))
    //   const text: any = decoder.decode(value);
    //   console.log(text)
    //   // 打印第一块的文本内容
    //   console.log(typeof text, done);
    // }
  }

  const afterInput = (msg: string) => {
    setBubbles([...bubbles, { role: 'local', content: msg }, { role: 'ai', content: '...', loading: true }])
    getStream('user', msg);
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
        avatar={{ icon: bubble.role === 'ai' ? <RobotOutlined /> : <UserOutlined />, style: { background: bubble.role === 'ai' ? '#fde3cf' : '#87d068' } }}
        style={{ marginBottom: '10px', }}
      />
    );

    return elements
  }

  return (
    <div className='w-full h-full relative'>
      <Header style={{ background: '#666', color: '#FFF', fontSize: '18px', textAlign: 'center' }}>AI会话</Header>
      {bubbles.length ? <div
        className='bg-gray-100 m-4 rounded-sm p-2 overflow-y-auto'
        style={{ maxHeight: '80%' }}

      >{bubbleEle()}</div> : <div className='w-3/5 m-auto my-2'>

        <Welcome
          icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
          title="你好"
          description="欢迎开启美好的一天，希望能帮助你"
        />
      </div>
      }
      <div
        className='w-full absolute bottom-0'
      >
        <Sender
          className='w-4/5 m-auto  '
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