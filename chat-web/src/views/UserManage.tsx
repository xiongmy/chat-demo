import {
  Button,
  message,
  Modal,
  List,
  Steps,
  Form,
  Input,
  Image,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getUserList,
  createNewUser,
  getImgRes,
  exitCreate,
  delUser,
} from "./../http/user";
type FieldType = {
  username?: string;
};
interface user {
  id: string;
  name: string;
  image?: string;
}
const AgentInfo = ({ agent = "" }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProgress, setIsNewProgress] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [userList, setUserList] = useState<user[]>([]);
  const [newUser, setNewUser] = useState<user>();
  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    getUserList().then((data) => {
      const list: user[] = data.user_list;
      setUserList([...list]);
    });
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const newUserOk = () => {
    setIsNewProgress(false);
    getList();
    resetCreate();
  };
  const resetCreate = () => {
    setStep(0);
    setName("");
  };

  const newUserCancel = () => {
    setIsNewProgress(false);
    if (step === 1) {
      // 中断流程
      exitCreate().then((res) => {
        resetCreate();
      });
    }
  };
  const deleteUser = (id: string) => {
    delUser(id).then((res) => {
      messageApi.success("删除成功");
      getList();
    });
  };
  // const editUser = (id: string) => {
  // };
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
      let timer: number;
      createNewUser(name).then(() => {
        setStep(1);
        timer = window.setInterval(() => {
          getImgRes().then((img: any) => {
            if (img.status === "success") {
              messageApi.success("新增成功");
              clearInterval(timer);
              setStep(2);
              setNewUser({
                id: img.user_id,
                name: name,
                image: img.user_image,
              });
            }
          });
        }, 1000);
      });
    }
  };
  return (
    <div className="user-management">
      {contextHolder}
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
            <Button type="link">新增 
              <PlusCircleOutlined
                className="text-base"
                onClick={() => setIsNewProgress(true)}
              />
            </Button>
          </p>
        }
        width={488}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="mb-6">
          <List
            className="w-full overflow-y-auto"
            style={{ height: "300px" }}
            bordered
            size="small"
            dataSource={userList}
            renderItem={(item) => (
              <List.Item>
                <p className="w-4/5 ellipsis-text">{item.name}</p>
                <div>
                  {/* <Button
                  type="link"
                  size="small"
                  onClick={() => editUser(item.id)}
                >
                  <EditOutlined style={{ color: "#1677ff" }} />
                </Button> */}
                  <Popconfirm
                    title="确认要删除这个用户吗？"
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => deleteUser(item.id)}
                  >
                    <Button type="link" size="small">
                      <DeleteOutlined style={{ color: "red" }} />
                    </Button>
                  </Popconfirm>
                </div>
              </List.Item>
            )}
          ></List>
        </div>
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
                  提交
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
            </div>
          ) : (
            ""
          )}
          {step === 2 ? (
            <div className="text-center">
              {newUser?.image ? <Image width={100} src={newUser.image} /> : ""}

              <p className="mt-4">{newUser?.name}</p>
              <div className="mt-4">
                <Button type="primary" onClick={newUserOk}>
                  确定
                </Button>
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
