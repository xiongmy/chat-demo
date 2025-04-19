import { Button, Select, message, Input } from "antd";
import { useEffect, useState, useRef } from "react";
import { agentSwitchMode, getAgentMode } from "../http";
import { Mode, ModeData } from "./../props";
import AgentSetting from "./AgentSetting";
import "./AgentInfo.css";
import Title from "../components/Title";
import JSONFormatter from "json-formatter-js";
interface AgentInfoProps {
  agent: string;
  mode: string;
  onSwitch: (mode: string) => void;
}
const AgentInfo: React.FC<AgentInfoProps> = ({
  agent = "",
  mode = "",
  onSwitch,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modeList, setModeList] = useState<ModeData[]>([]);
  const [currentMode, setCurrentMode] = useState({ label: "", value: "" });
  const [info, setInfo] = useState("");
  const containerRef = useRef<HTMLInputElement>(null);

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
      setInfo(data);
      const formatter = new JSONFormatter(data);
      containerRef.current?.appendChild(formatter.render());
      if (data.all_modes) {
        setModeList([...data.all_modes]);
        const current = data.all_modes.find((item) => item.id === data.current);
        console.log(current);
        onSwitch(current.id);
        setCurrentMode({ label: current.name, value: current.id });
      }
    });
  }, []);

  return (
    <div className="agent-info">
      {contextHolder}
      <Title text="">
        <div>
          <Button type="link" size="small">
            Agent: {agent}
          </Button>
          {agent && mode ? <AgentSetting agent={agent} mode={mode} /> : ""}
        </div>
        <div>
          <span className="text-sm">选择模式: </span>
          <Select
            labelInValue
            value={currentMode}
            size="small"
            onChange={handleChange}
            options={modeList?.map((mode: any) => {
              return { label: mode.name, value: mode.id };
            })}
          />
        </div>
      </Title>

      <div className="code-box m-4">
        <div ref={containerRef} className="w-full h-full p-4">
          {/* <Input type="textarea" className="w-full h-full" value={info} /> */}
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;
