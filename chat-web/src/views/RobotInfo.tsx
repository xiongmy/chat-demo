import { Select, Button, Modal, Input, message, Popover, Collapse } from "antd";
import { Children, useEffect, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import type { CollapseProps } from 'antd';
import Title from "../components/Title";
import { Mode, ModeData } from "./../props";
import {
  agentSwitchMode,
  getAgentMode,
  getRobotSchema,
  getRobotData,
} from "./../http";
import avatar from "./../assets/avatar.png";
import "./RobotInfo.css";

interface RobotInfoType{
  key:string,
  label: string,
  children:{
    key:string,
    label:string,
  }[]
}
const RobotInfo = ({ agent = "" }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [option, setOption] = useState<string>("simple-chat");
  const [ip, setIp] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modeList, setModeList] = useState<ModeData[]>([]);
  const [info, setInfo] = useState("");
  const [robotData, setRobotData] = useState({});
  const [robotSchema, setRobotSchema] = useState({});

  useEffect(() => {
    getAgentMode(agent).then(({ data, data: modes }) => {
      setInfo(JSON.stringify(data));
      if (modes.all_modes) {
        setModeList([...modes.all_modes]);
      }
    });
    getRobotSchema().then(({ data }) => {
      console.log(data);
      setRobotSchema(data.schema.$defs);
    });
    getRobotData().then(({ data }) => {
      console.log(data);
      setRobotData(data.state);
    });
  }, []);

  const handleChange = (option: { value: string; label: React.ReactNode }) => {
    agentSwitchMode(agent, option.value).then(({ data }) => {
      if (data.ok) {
        setOption(option.value);
        messageApi.success("切换成功");
      } else {
        messageApi.warning("切换失败");
      }
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

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
  const generateList = () => {
    const items: CollapseProps['items'] = [
      // {
      //   key: '1',
      //   label: 'This is panel header 1',
      //   children: <p>{text}</p>,
      // },
      
    ];
    
    for (let key in robotSchema) {
      let item = {
        key:'',
        label:'',
        value:'',
        children: undefined
      };
      const info = robotSchema[key]
      item.key = key
      item.label = info.title
      for(let childKey in info.properties){
        const child = info.properties[childKey]
        item.children+= <p>{childKey} {child.title}</p>
        console.log(key+' , '+childKey)

        // console.log(RobotInfo[key][childKey])
        // item.children.push({key: childKey, label:child.title})
      }
      items.push(item)
    }
    console.log(items)
    return <Collapse items={items} />;
  };
  return (
    <div className="robot-info text-base">
      {contextHolder}
      <Title text={"机器人信息"} />
      <div className="avatar flex mx-2 my-4">
        <div className="w-12 h-12 rounded-full text-center  text-2xl leading-12">
          <img src={avatar} />
        </div>
        <div className="ml-2">
          <p className="text-base leading-6">
            Hi, 你好 {option}
            <Popover style={{ width: "100px" }} content={info} title="Title">
              <Button type="link" size="small">
                <InfoCircleOutlined />
              </Button>
            </Popover>
          </p>
          {ip ? (
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
          )}
        </div>
      </div>
      <div className="mx-2 my-4 text-sm flex">
        <span>模式：</span>
        <Select
          className="w-3/5"
          labelInValue
          defaultValue={option}
          size="small"
          onChange={handleChange}
          options={modeList?.map((mode: Mode) => {
            return { label: mode.name, value: mode.id };
          })}
        />
      </div>
      <div className="m-2">
        <p className="h-8 leading-8 text-base">配件列表</p>
        <div className="leading-6 ml-2 text-sm">
          {generateList()}
        </div>
      </div>
      <div className="m-2">
        <p className="h-8 leading-8 text-base">技能列表</p>
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
