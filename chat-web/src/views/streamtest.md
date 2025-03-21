```
// const startStream = async (role = 'user', content = '') => {
  //   let startTime = new Date().getTime();
  //   const data = {
  //     model: 'deepseek-chat',
  //     stream: true,
  //     messages: [{
  //       content,
  //       role,
  //       name: 'user'
  //     }]
  //   }
  //   let newContent = ''
  //   await fetchEventSource('/llms/openai/chat/completions', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //     onmessage(event) {
  //       // 接收服务器发送的每条事件
  //       const res = event.data
  //       newContent += JSON.parse(res).choices[0].delta.content
  //       setBubbles(bubbles => [...bubbles.slice(0, bubbles.length - 1), { role: 'ai', content: newContent, }])
  //       if (messageRef.current != null) {
  //         messageRef.current.scrollTop = messageRef.current.scrollHeight
  //       }
  //     },
  //     onclose() {
  //       let endTime = new Date().getTime();
  //       console.log('思考时间：' + Math.floor((endTime - startTime) / 1000) + ' s')
  //     },
  //     onerror(err) {
  //       // 错误处理（默认会抛出异常并自动重试）
  //       console.error('错误:', err);
  //       throw err; // 抛出错误会触发重试机制
  //     }
  //   });
  // }
  ```