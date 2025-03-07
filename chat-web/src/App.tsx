
import React from 'react';
import { Layout, theme } from 'antd';
import Chat from './views/Chat.tsx'
import LeftBar from './views/LeftBar.tsx'
import './App.css'
const { Header, Footer, Sider } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{height:'100vh'}}>
      <Sider
       theme='light'
        breakpoint="lg"
        collapsedWidth="0"
        defaultCollapsed={true}
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo">LOGO</div>
        <LeftBar/>
      </Sider>
      <Layout>
        <Header style={{ background: '#666', color:'#FFF', fontSize:'18px', textAlign:'center' }}>AI会话</Header>
        <Chat/>
        <Footer style={{ textAlign: 'center' }}>
          {new Date().getFullYear() + '.' + (new Date().getMonth()+1) + '.' + new Date().getDate()}
        </Footer>
      </Layout>
    </Layout>
  );
};


export default App;