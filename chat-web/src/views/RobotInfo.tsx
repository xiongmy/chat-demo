import { Modal, Input, message, Button, Collapse, theme } from "antd";
import { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import Title from "../components/Title";
import { Mode, ModeData } from "./../props";
import { getRobotSchema, getRobotData } from "./../http";
import UserManage from "./UserManage";
import FormRender, { useForm } from "form-render";
import avatar from "./../assets/avatar.png";
import "./RobotInfo.css";
interface RobotInfoType {
  key: string;
  label: string;
  children: {
    key: string;
    label: string;
  }[];
}
const RobotInfo = ({ agent = "", themeMode = "" }) => {
  const [ip, setIp] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [robotData, setRobotData] = useState({});
  const [robotSchema, setRobotSchema] = useState({});
  const [loading, setLoading] = useState(false);
  const form = useForm();

  useEffect(() => {
    getRobotSchema().then(({ data }) => {
      console.log(data);
      setRobotSchema(data.schema);
    });
    getRobotStatus()
    
  }, []);
  const getRobotStatus = ()=>{
    setLoading(true)
    getRobotData().then(({ data }) => {
      console.log(data);
      setRobotData(data.state);
      form.setValues(data.state);
      setLoading(false)
    });
  }
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  const handleOk = () => {
    if (ip) {
      setIsModalOpen(false);
      setIp(ip);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const ipPopModel = () => {
    return (
      <Modal
        title="请输入机器人的IP"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex">
          <Input onChange={(e) => setIp(e.target.value)} />
        </div>
      </Modal>
    );
  };

  return (
    <div className="robot-info text-base">
      <Title text={"机器人信息"} />
      <div className="avatar flex mx-2 my-4">
        <div className="w-12 h-12 rounded-full text-center  text-2xl leading-12">
          <img src={avatar} />
        </div>
        <div className="ml-2">
          <p className="text-base leading-6">Hi, 你好</p>

          <p className="text-sm leading-6 text-gray-500">
            我是你的机器人小助手
          </p>
          {/* {ip ? (
            <p className="text-sm leading-6">
              IP: {ip}{" "}
              <Button type="link" size="small" onClick={() => setIp("")}>
                断开
              </Button>
            </p>
          ) : (
            <Button type="primary" size="small" onClick={showModal}>
              连接
            </Button>
          )} */}
        </div>
      </div>
      <div className="w-full">
        <UserManage agent={agent} />
      </div>
      <div className="m-2 device-list">
        <p className="h-8 leading-8 text-base">配件列表 <Button type="link" onClick={getRobotStatus} className={loading?'animate-spin':''}><ReloadOutlined size={16} /></Button></p>
        <FormRender
          className="w-full"
          readOnly={true}
          form={form}
          schema={robotSchema}
          displayType="inline"
          configProvider={{
            theme: {
              algorithm: themeMode
                ? theme.defaultAlgorithm
                : theme.darkAlgorithm,
            },
          }}
        />
        <p className="mt-2 h-8 leading-8 text-base">技能列表</p>
        <ul className="leading-6 ml-4 text-sm">
          <li>人脸识别</li>
          <li>打招呼</li>
          <li>向前走</li>
          <li>障碍识别</li>
        </ul>
      </div>
      <div className="real-video">
        <Title text={"实时视频流"} />
        <video controls>
          <source
            src="https://media.w3.org/2010/05/sintel/trailer.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      {ipPopModel()}
    </div>
  );
};

export default RobotInfo;
