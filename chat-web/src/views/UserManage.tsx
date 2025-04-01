import { Button, message } from "antd";

const AgentInfo = ({ agent = "" }) => {
  const [messageApi, contextHolder] = message.useMessage();
  console.log(agent)

  return (
    <div className="user-management">
      <Button className="ml-4" type="primary" size="small">用户管理</Button>
    </div>
  );
};

export default AgentInfo;
