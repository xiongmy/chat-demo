import { Button, message, Modal, List, Steps, Form, Input, Image } from "antd";
import { useState } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
type FieldType = {
  username?: string;
};
const AgentInfo = ({ agent = "" }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProgress, setIsNewProgress] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  console.log(agent);
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const newUserOk = () => {
    setIsNewProgress(false);
  };

  const newUserCancel = () => {
    setIsNewProgress(false);
  };
  const userData = [
    { id: 11111, name: "用户名11111111" },
    { id: 11112, name: "用户名22222222" },
    { id: 11113, name: "用户名33333333" },
    { id: 11114, name: "用户名44444444" },
    { id: 11115, name: "用户名55555555" },
    { id: 11116, name: "用户名66666666" },
    { id: 11117, name: "用户名77777777" },
    { id: 11118, name: "用户名88888888" },
    { id: 11119, name: "用户名99999999" },
  ];
  const stepItems = [
    {
      title: "设置用户名",
    },
    {
      title: "人脸识别中",
      description: "",
    },
    {
      title: "完成",
      description: "",
    },
  ];
  const submitName = () => {
    if (name) {
      console.log(name);
      setStep(1);
    }
  };
  return (
    <div className="user-management">
      <Button
        className="ml-4"
        type="primary"
        size="small"
        onClick={() => setIsModalOpen(true)}
      >
        用户管理
      </Button>
      <Modal
        title={
          <p className="flex h-8 leading-8">
            <span>用户管理</span>
            <Button type="link">
              <PlusCircleOutlined
                className="text-lg"
                onClick={() => setIsNewProgress(true)}
              />
            </Button>{" "}
          </p>
        }
        width={600}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <List
          className="w-full overflow-y-auto"
          style={{ height: "300px" }}
          bordered
          dataSource={userData}
          renderItem={(item) => (
            <List.Item>
              <p>{item.name}</p>
              <div>
                <Button type="link" size="small">
                  <EditOutlined style={{ color: "#1677ff" }} />
                </Button>
                <Button type="link" size="small">
                  <DeleteOutlined style={{ color: "red" }} />
                </Button>
              </div>
            </List.Item>
          )}
        ></List>
      </Modal>
      <Modal
        title="新增用户"
        open={isNewProgress}
        onOk={newUserOk}
        onCancel={newUserCancel}
        footer={null}
      >
        <Steps
          size="small"
          current={step}
          labelPlacement="vertical"
          items={stepItems}
        />
        <div className="my-20">
          {step === 0 ? (
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="用户名"
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input
                  placeholder="请输入用户名"
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit" onClick={submitName}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          ) : (
            ""
          )}
          {step === 1 ? (
            <div className="text-center">
              <Button
                className="text-lg"
                type="link"
                size="large"
                loading
              ></Button>
              <p className=" text-gray-600">
                人脸识别中...请保持人脸在屏幕中央
              </p>
              <Button className="mt-4" onClick={() => setStep(2)}>
                已识别成功
              </Button>
            </div>
          ) : (
            ""
          )}
          {step === 2 ? (
            <div className="text-center">
              <Image
                width={100}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <p className="mt-4">username</p>
              <div className="mt-4">
                <Button type="primary">确定</Button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AgentInfo;
