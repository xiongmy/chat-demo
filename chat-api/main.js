const express = require('express');
const cors = require('cors');
const OpenAI  = require("openai");

const app = express();
// 使用 CORS 中间件，允许所有跨域请求
app.use(cors());

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-f621984d69324e4faa00a1c4dd466925'
});

async function sendReq(role, content) {
    const completion = await openai.chat.completions.create({
        messages: [{ role, content }],
        model: "deepseek-chat",
        stream:false
    });

    return completion.choices[0].message.content
}
app.get('/api/chat', (req, res) => {
    const url = req.url;
    const params = new URLSearchParams(url.split('?')[1])
    const role = params.get('role')
    const content = params.get('content')
    // console.log(role, content)
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'}); 
    sendReq(role, content).then((content) => {
        res.write(content);
        res.end();
    }
    ).catch((err) => {
        // console.log(err)
        res.json(err);
    })
});

app.listen(5000, () => {
    console.log('服务器运行在 http://localhost:5000');
  });