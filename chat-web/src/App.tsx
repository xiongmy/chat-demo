
import React from 'react';
import { Layout } from 'antd';
import {RobotOutlined} from '@ant-design/icons'
import Chat from './views/Chat.tsx'
import LeftBar from './views/LeftBar.tsx'
import './App.css'
const { Sider } = Layout;

const App: React.FC = () => {

  return (
    <Layout className='w-full h-full flex'>
      <Sider
        className='w-1/4 h-full border-r-1 border-gray-300 box-border'
        theme='light'
        breakpoint="lg"
        collapsedWidth="0"
        defaultCollapsed={true}
        // onBreakpoint={(broken) => {
        //   console.log(broken);
        // }}
      >
        <div className="logo"><RobotOutlined /><span className='ml-2'>桌面助手</span></div>
        <LeftBar />
      </Sider>
      <Layout className=''>
        <Chat />
      </Layout>
    </Layout>
  );
};


export default App;