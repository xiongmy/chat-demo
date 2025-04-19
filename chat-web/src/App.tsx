
import React, { useEffect, useState } from 'react';
import { Switch, ConfigProvider, theme } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import '@/App.css'
import Chat from './views/Chat.tsx'
import AgentInfo from '@/views/AgentInfo';
import RobotInfo from '@/views/RobotInfo.tsx'
import { getAgent } from '@/http'
// import { Agent, AgentData, ModeData, ModeListData } from '@/props'
// import EventBox from '@/views/EventBox.tsx'

const App: React.FC = () => {
  const [agent, setAgent] = useState('coco')
  const [mode, setMode] = useState('')
  const [value, setValue] = useState<boolean>(true)
  document.documentElement.setAttribute('data-theme', value ? 'light' : 'dark')
  useEffect(() => {
    getAgent().then((data: any) => {
      const main = data.main
      setAgent(main)
    })
  }, []);
  const switchMode = (mode)=>{
      // console.log(mode)
      setMode(mode)
  }
  return (
    <ConfigProvider
      theme={{
        // 1. 单独使用暗色算法
        algorithm: value ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      <div className='w-full h-full flex p-4'>
        <div className='color-set w-1/5 mr-1'>
          <RobotInfo agent={agent} themeMode={value} />
        </div>
        <div className='color-set w-2/5 mr-1'>
          {/* <EventBox agent={agent} /> */}
          <AgentInfo agent={agent} mode={mode} onSwitch={switchMode}/>
        </div>
        <div className='color-set w-2/5'>
          <Chat agent={agent} mode={mode} />
        </div>
        <div className='fixed top-4 right-6'>
          <Switch
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            defaultChecked
            size='small'
            onClick={value => {
              setValue(value)
              document.documentElement.setAttribute('data-theme', value ? 'light' : 'dark')
            }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};


export default App;