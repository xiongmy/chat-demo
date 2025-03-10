
import React from 'react';
import { Layout, theme } from 'antd';
import Chat from './views/Chat.tsx'
import LeftBar from './views/LeftBar.tsx'
import './App.css'
const { Header, Sider } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className={'bg-blue-500'}>
      <Sider
        theme='light'
        breakpoint="lg"
        collapsedWidth="0"
        defaultCollapsed={true}
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed) => {
          var winWidth = document.body.clientWidth;
          console.log(collapsed);
          const width = collapsed ? winWidth + 'px' : (winWidth - 200) + 'px'
          console.log(width)
          document.getElementById('content')?.setAttribute('width', width)
        }}
      >
        <div className="logo">LOGO</div>
        <LeftBar />
      </Sider>
      <Layout id='content'>
        <Header style={{ background: '#666', color: '#FFF', fontSize: '18px', textAlign: 'center' }}>AI会话</Header>
        <Chat />
      </Layout>
    </Layout>
  );
};


export default App;