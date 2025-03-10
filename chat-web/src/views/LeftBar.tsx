import { Conversations, type ConversationsProps } from '@ant-design/x';
import { Button, type GetProp } from 'antd';
import { useState } from 'react';
import { MessageOutlined } from '@ant-design/icons'
import './LeftBar.css'

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 10 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
}));

const LeftBar = () => {
  const [activeKey, setActiveKey] = useState<string>('item1');

  return (
    <div className='left-bar'>
      <div className='w-full text-center mt-4'>
        <Button
          onClick={() => {
            setActiveKey('item1');
          }}
        ><MessageOutlined />
          开启新对话
        </Button>
      </div>
      <Conversations
        className='w-full m-0 p-0'
        activeKey={activeKey}
        onActiveChange={(v) => setActiveKey(v)}
        items={items}
      />
    </div>
  );
};

export default LeftBar;