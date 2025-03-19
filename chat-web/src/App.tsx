
import React, { useEffect, useState } from 'react';
import Chat from './views/Chat.tsx'
import EventBox from './views/EventBox.tsx'
import RobotInfo from './views/RobotInfo.tsx'
import './App.css'
import { getAgent, getAgentMode } from './http'
import { Agent, AgentData, ModeData, ModeListData } from './props'

const App: React.FC = () => {
  const [agent, setAgent] = useState('coco')
  const [mode, setMode] = useState('simple_chat')
  const [modeList, setModeList] = useState<ModeListData[]>([])
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
    <div className='w-full h-full flex'>
      <div className='w-1/4 bg-gray-100'>
        <RobotInfo agent={agent} modes={modeList} />
      </div>
      <div className='chat w-2/4 bg-white'>
        <Chat agent={agent} />
      </div>
      <div className='w-1/4 bg-gray-100'>
        <EventBox agent={agent} />
      </div>
    </div>
  );
};


export default App;