import { Conversations, type ConversationsProps } from '@ant-design/x';
import { Button, Flex, type GetProp, theme } from 'antd';
import { useState } from 'react';
import './LeftBar.css'

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 10 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
}));

const LeftBar = () => {
  const [activeKey, setActiveKey] = useState<string>('item1');

  const { token } = theme.useToken();

  // Customize the style of the container
  const style = {
    width: '100%',
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    margin: 0,
    padding: 0
  };

  return (
    <div className='left-bar'>
      <div>
        <Button
          onClick={() => {
            setActiveKey('item1');
          }}
        >
          开启新对话
        </Button>
      </div>
      <Conversations
        activeKey={activeKey}
        onActiveChange={(v) => setActiveKey(v)}
        items={items}
        style={style}
      />
    </div>
  );
};

export default LeftBar;