import { Conversations, type ConversationsProps } from '@ant-design/x';
import { Select, Button, Modal, Input } from 'antd';
import { useState } from 'react';
import { RobotOutlined } from '@ant-design/icons'
import Title from '../components/Title'
import { Mode } from './../props'
import './RobotInfo.css'

const RobotInfo = ({ agent = '', modes = [] }) => {
  const [option, setOption] = useState<string>('simple-chat');
  const [ip, setIp] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (value: string) => {
    console.log(value);
    setOption(value)
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if(ip){
      setIsModalOpen(false);
      setIp(ip)
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const ipPopModel = () => {
    return (
      <Modal title="请输入机器人的IP" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className='flex'>
          <Input onChange={(e)=>setIp(e.target.value)} />
        </div>
      </Modal>
    )
  }
  return (
    <div className='robot-info text-base'>
      <Title text={"机器人信息"} />
      <div className='avatar flex mx-2 my-4'>
        <div className='w-12 h-12 rounded-full text-center bg-gray-300 text-2xl leading-12'>
          <RobotOutlined />
        </div>
        <div className='ml-2'>
          <p className='text-base leading-6 text-gray-700'>Hi, 你好</p>
          {ip ?
            <p className='text-sm leading-6 text-gray-500'>IP: {ip} <Button type='link' size="small" onClick={()=>setIp('')}>断开</Button></p> 
            :
            <Button type="primary" size="small" onClick={showModal}>连接</Button>
          }
        </div>
      </div>
      <div className='mx-2 my-4 text-sm flex'>
        <span>模式：</span>
        <Select
          className='w-3/5'
          labelInValue
          defaultValue={option}
          size='small'
          onChange={handleChange}
          options={modes?.map((mode: Mode) => {
            return { label: mode.name, value: mode.id }
          })}
        />
      </div>
      <div className='m-2'>
        <p className='h-8 leading-8 text-base'>配件列表</p>
        <ul className='leading-6 ml-4 text-sm'>
          <li>舵机</li>
          <li>摄像头</li>
          <li>麦克风</li>
          <li>屏幕</li>
        </ul>
      </div>
      <div className='m-2'>
        <p className='h-8 leading-8 text-base'>技能列表</p>
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
      {ipPopModel()}
    </div>
  );
};

export default RobotInfo;