import { Button, Select, message } from "antd";
import { useEffect, useState } from "react";
import { agentSwitchMode, getAgentMode } from "../http";
import { Mode, ModeData } from "./../props";
import AgentSetting from "./AgentSetting";
import * as monaco from "monaco-editor";
import "./AgentInfo.css";
import Title from "../components/Title";
interface AgentInfoProps {
  agent: string;
  onSwitch: () => void;
}
const AgentInfo: React.FC<AgentInfoProps> = ({ agent = "", onSwitch }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modeList, setModeList] = useState<ModeData[]>([]);
  const [currentMode, setCurrentMode] = useState({ label: "", value: "" });

  const handleChange = (option: { value: string; label: string }) => {
    agentSwitchMode(agent, option.value).then((data: any) => {
      if (data.ok) {
        setCurrentMode({ label: option.value, value: option.label });
        messageApi.success("切换成功");
        onSwitch(option.value);
      } else {
        messageApi.warning("切换失败");
      }
    });
  };
  useEffect(() => {
    getAgentMode(agent).then((data: any) => {
      if (data.all_modes) {
        setModeList([...data.all_modes]);
        const current = data.all_modes.find((item) => item.id === data.current);
        console.log(current);
        setCurrentMode({ label: current.name, value: current.id });
      }
    });
  }, []);
  // const changeAgentInfo = ()=>{

  // }
  const openChangeModal = () => {
    // json schema render
  };
  return (
    <div className="agent-info">
      {contextHolder}
      <Title text="">
        <div>
          <Button type="link" size="small">
            Agent : {agent}
          </Button>
          <AgentSetting />
        </div>
        <div className="ml-8">
          <span className="text-sm"> 选择模式：</span>
          <Select
            style={{ width: 150 }}
            labelInValue
            value={currentMode}
            size="small"
            onChange={handleChange}
            options={modeList?.map((mode:any) => {
              return { label: mode.name, value: mode.id };
            })}
          />
        </div>
      </Title>

      <div className="code-box mt-4">
        <div id="container" className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default AgentInfo;
