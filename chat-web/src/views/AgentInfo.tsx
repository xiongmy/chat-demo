import { Button, Select, message } from "antd";
import { useEffect, useState } from "react";
import { agentSwitchMode, getAgentMode } from "../http";
import { Mode, ModeData } from "./../props";
import AgentSetting from "./AgentSetting";
import * as monaco from "monaco-editor";
import "./AgentInfo.css";

const AgentInfo = ({ agent = "" }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modeList, setModeList] = useState<ModeData[]>([]);
  const [currentMode, setCurrentMode] = useState<string>("simple-chat");

  const handleChange = (option: { value: string; label: React.ReactNode }) => {
    agentSwitchMode(agent, option.value).then(({ data }) => {
      if (data.ok) {
        setCurrentMode(option.value);
        messageApi.success("切换成功");
      } else {
        messageApi.warning("切换失败");
      }
    });
  };
  useEffect(() => {
    getAgentMode(agent).then(({ data, data: modes }) => {
      if (modes.all_modes) {
        setModeList([...modes.all_modes]);
      }
      monaco.editor.create(document.getElementById("container"), {
        value: JSON.stringify(data, null, 2),
        language: "javascript",
      });
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
      <div className="w-full h-8 leading-8 pl-2 border-b-1 border-b-1 border-gray-300 text-base color-set">
        <div className="flex ">
          <div>
            <Button type="link" size="small">
              Agent : {agent}
            </Button>
            <AgentSetting />
          </div>
          <div className="ml-8">
            <span className="text-sm"> 选择模式：</span>
            <Select
              labelInValue
              defaultValue={currentMode}
              size="small"
              onChange={handleChange}
              options={modeList?.map((mode: Mode) => {
                return { label: mode.name, value: mode.id };
              })}
            />
          </div>
        </div>
      </div>
      <div className="code-box mt-4">
        <div id="container" className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default AgentInfo;
