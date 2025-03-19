
import React, { useEffect, useState } from 'react';
import Chat from '@/views/Chat.tsx'
import EventBox from '@/views/EventBox.tsx'
import RobotInfo from '@/views/RobotInfo.tsx'
import { Switch, ConfigProvider,theme } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import '@/App.css'
import { getAgent, getAgentMode } from './http'
import { Agent, AgentData, ModeData, ModeListData } from '@/props'

const App: React.FC = () => {
  const [agent, setAgent] = useState('coco')
  const [mode, setMode] = useState('simple_chat')
  const [modeList, setModeList] = useState<ModeListData[]>([])
  const [value, setValue] = useState<boolean>(true)
  document.documentElement.setAttribute('data-theme', value ? 'light' : 'dark')
  useEffect(() => {
    getAgent().then((res: { data: AgentData }) => {
      console.log('当前Agent名字：' + res.data.main)
      setAgent(res.data.main)
      getAgentMode(res.data.main).then((modes: { data: ModeData }) => {
        setMode(modes.data.current)
        if (modes.data.all_modes) {
          setModeList([...modes.data.all_modes])
        }
      })
    })
  }, []);
  return (
    <ConfigProvider
      theme={{
        // 1. 单独使用暗色算法
        algorithm: value? theme.defaultAlgorithm: theme.darkAlgorithm,
      }}
    >
      <div className='w-full h-full flex'>
        <div className='color-set w-1/4'>
          <RobotInfo agent={agent} modes={modeList} />
        </div>
        <div className='color-set chat w-2/4'>
          <Chat agent={agent} />
        </div>
        <div className='w-1/4 color-set'>
          <EventBox agent={agent} />
        </div>
        <div className='fixed top-0 right-4'>
          <Switch
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            defaultChecked
            size='small'
            onClick={value => {
              console.log(value)
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