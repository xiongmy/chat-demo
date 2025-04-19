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
  Table,
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
  updateUser,
  getImgRes,
  delUser,
  getUserSchema,
} from "./../http/user";
import SchemaForm from "../components/SchemaForm";
type FieldType = {
  username?: string;
};
interface user {
  id: string;
  name: string;
  image?: string;
}
const defaultUser = {
  id: "",
  name: "",
  image_file: "",
  birthday: "",
  birthplace: "",
  gender: "",
  city: "",
};
const AgentInfo = ({ agent = "" }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProgress, setIsNewProgress] = useState(false);
  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    ...defaultUser,
  });
  const [schema, setSchema] = useState({});
  const [userList, setUserList] = useState<user[]>([]);
  const [newUser, setNewUser] = useState<user>();
  useEffect(() => {
    getList();
    getUserSchema().then((res: any) => {
      setSchema(res);
    });
  }, []);

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (_, record, index) => index + 1,

    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "出生地",
      dataIndex: "birthplace",
      key: "birthplace",
    },
    {
      title: "所在城市",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "生日",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "照片",
      dataIndex: "image_file",
      key: "image_file",
      render: (_, record) => {
        return (
          <div>
            {record.image_file ? (
              <Image src={record.image_file} width={60} />
            ) : (
              ""
            )}
            <Button
              size="small"
              onClick={() => getFaceImage(record.id)}
              type="link"
            >
              <span className="text-xs">
                {" "}
                {record.image_file ? "更新" : "设置"}
              </span>
            </Button>
          </div>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "operations",
      key: "operations",
      render: (_, record) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => editUser(record)}>
              <EditOutlined style={{ color: "#1677ff" }} />
            </Button>
            <Popconfirm
              title="确认要删除这个用户吗？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => deleteUser(record.id)}
            >
              <Button type="link" size="small">
                <DeleteOutlined style={{ color: "red" }} />
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const getList = () => {
    getUserList().then((data: any) => {
      const list: user[] = data.users;
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
    setStep(0);
    setState({
      ...defaultUser,
    });
  };

  const newUserCancel = () => {
    newUserOk();
  };
  const deleteUser = (id: string) => {
    delUser(id).then(() => {
      messageApi.success("删除成功");
      getList();
      setIsNewProgress(false);
    });
  };
  const editUser = (user: object) => {
    console.log(user);
    setState(Object.assign(state, user));
    setIsNewProgress(true);
  };
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
  const onfinishForm = (data) => {
    if (data.id) {
      console.log("edit");
      updateUser(data.id, data).then(() => {
        messageApi.success("修改成功");
        newUserOk();
      });
    } else {
      console.log("create");
      createNewUser(Object.assign(data, { id: "" })).then((data: any) => {
        getFaceImage(data.user.id);
      });
    }
  };
  const getFaceImage = (id: string) => {
    if (!id) return;
    setIsNewProgress(true);
    setStep(1);
    getImgRes(id)
      .then(() => {
        messageApi.success("识别成功");
        setStep(2);
        getList();
      })
      .catch(() => {
        messageApi.error("识别失败，请重试");
      });
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
        <span className="text-xs">用户管理</span>
      </Button>
      <Modal
        title={
          <p className="flex h-8 leading-8">
            <span>用户管理</span>
            <Button
              type="link"
              onClick={() => {
                setStep(0);
                setIsNewProgress(true);
              }}
            >
              新增
              <PlusCircleOutlined className="text-base" />
            </Button>
          </p>
        }
        width={800}
        height={500}
        open={isModalOpen}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="my-6">
          <Table
            bordered
            dataSource={userList}
            columns={columns}
            size="small"
            pagination={false}
            scroll={{ y: 50 * 6 }}
          />
        </div>
      </Modal>
      <Modal
        title={state.id ? "修改用户" : "新增用户"}
        open={isNewProgress}
        onOk={newUserOk}
        onCancel={newUserCancel}
        maskClosable={false}
        footer={null}
      >
        <Steps
          size="small"
          current={step}
          labelPlacement="vertical"
          items={stepItems}
        />
        <div className="my-6">
          {step === 0 ? (
            <SchemaForm state={state} schema={schema} onFinish={onfinishForm} />
          ) : (
            ""
          )}
          {step === 1 ? (
            <div className="text-center mt-10">
              <Button
                className="text-lg"
                type="link"
                size="large"
                loading
              ></Button>
              <p className=" text-gray-600 mt-10">
                人脸识别中...请保持人脸在屏幕中央
              </p>
              {/* <Button className="mt-6" type="primary" onClick={()=>getFaceImage(state.id)}>重试</Button> */}
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
