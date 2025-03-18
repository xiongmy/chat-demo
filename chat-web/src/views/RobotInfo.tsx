import { Conversations, type ConversationsProps } from '@ant-design/x';
import { Select } from 'antd';
import { useState } from 'react';
import { RobotOutlined } from '@ant-design/icons'
import Title from '../components/Title'
import { Mode}  from './../props'
import './RobotInfo.css'

const RobotInfo = ({agent='', modes=[]}) => {
  console.log(agent)
  console.log(modes)
  const [option, setOption] = useState<string>('model1');
  const handleChange = (value: string) => {
    console.log(value); 
    setOption(value)
  };
  return (
    <div className='robot-info text-base'>
      <Title text={"机器人信息"} />
      <div className='avatar flex m-2'>
        <div className='w-12 h-12 rounded-full text-center bg-gray-300 text-2xl leading-12'>
          <RobotOutlined />
        </div>
        <div className='ml-2'>
          <p className='text-base leading-6 text-gray-700'>Hi, 你好</p>
          <p className='text-xs leading-6 text-gray-500'>IP: 192.168.1.56</p>
        </div>
      </div>
      <div className='m-2 text-sm flex'>
        <span>模式：</span>
        <Select
          className='w-3/5'
          labelInValue
          defaultValue={''}
          size='small'
          onChange={handleChange}
          options={modes?.map((mode:Mode)=>{
            return {label: mode.name,value:mode.id}
          })}
        />
      </div>
      <div className='m-2'>
        <p className='h-8 leading-8 text-lg'>配件列表</p>
        <ul className='leading-6 ml-4 text-sm'>
          <li>舵机</li>
          <li>摄像头</li>
          <li>麦克风</li>
          <li>屏幕</li>
        </ul>
      </div>
      <div className='m-2'>
        <p className='h-8 leading-8 text-lg'>技能列表</p>
        <ul className='leading-6 ml-4 text-sm'>
          <li>人脸识别</li>
          <li>打招呼</li>
          <li>向前走</li>
          <li>障碍识别</li>
        </ul>
      </div>
      <div className="real-video">
        <Title text={"实时视频流"} />
        <video controls>
          <source src="https://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default RobotInfo;