import { Modal, message, Spin, Button, Tabs } from "antd";
import { useEffect, useState } from "react";
import {
  getAgentBaseConfig,
  getAgentPersonaSchema,
  getAgentPersonaData,
  updateAgentPersona,
  getAgentContracts,
  getAgentModeConfig,
  getAgentModeSchema,
} from "./../http";
import { SettingFilled } from "@ant-design/icons";
import type { TabsProps } from "antd";
import JsonViewer from "../components/JsonViewer";
import SchemaForm from "../components/SchemaForm";
import "./AgentSetting.css";
interface Props {
  agent: string;
  mode: string;
}
const AgentSetting: React.FC<Props> = ({ agent, mode }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [personaSchema, setPersonaSchema] = useState({});
  const [personaStatus, setPersonaStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modeSchema, setModeSchema] = useState({});
  const [modeStatus, setModeStatus] = useState({});

  const [baseInfo, setBaseInfo] = useState({});
  const [contractsInfo, setContractsInfo] = useState({});
  useEffect(() => {
    getAgentPersonaSchema().then((schema) => {
      const originalSchema = schema;
      // changeAgentPermission().then(({ permissions }) => {
      //   const disArr = permissions.immutable_fields;
      //   // setDisField([...disArr]);
      //   disArr.forEach((item: string) => {
      //     const keyArr = item.split(".");
      //     if (
      //       originalSchema.properties[keyArr[0]] &&
      //       originalSchema.properties[keyArr[0]].properties[keyArr[1]]
      //     ) {
      //       originalSchema.properties[keyArr[0]].properties[
      //         keyArr[1]
      //       ].disabled = true;
      //     }
      //   });
      // });
      setPersonaSchema(originalSchema);
    });
    getPersona()
    getAgentContracts(agent).then((data: any) => {
      setContractsInfo(data);
    });
    getAgentBaseConfig(agent).then((data: any) => {
      setBaseInfo(data);
    });
    getAgentModeSchema(agent, mode).then((schema) => {
      setModeSchema(schema);
    });
    getAgentModeConfig(agent, mode).then(({ state }) => {
      setModeStatus(state);
    });
  }, []);
  const getPersona = ()=>{
    getAgentPersonaData().then((info) => {
      // setStatus(info);
      setPersonaStatus(info.persona);
    });
  }

  const onFinishPersona = (formData) => {
    setLoading(true);
    updateAgentPersona(formData).then((data: any) => {
      setLoading(false);
      if (data.ok) {
        messageApi.success("更新成功");
        handleCancel();
        getPersona()
      }
    }).catch((err)=>{
      messageApi.error(err);
      setLoading(false);
    });
    
  };
  const onFinishMode = (formData) => {
    setLoading(true);
    updateAgentPersona(formData).then((data: any) => {
      setLoading(false);
      if (data.ok) {
        messageApi.success("更新成功");
        handleCancel();
      }
    }).catch((err)=>{
      messageApi.error(err);
      setLoading(false);
    });
  };
  const showContent = (data) => {
    return <div className="overflow-y-auto max-h-[600px]"><JsonViewer json={data} /></div>;
  };
  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "基本配置",
      children: showContent(baseInfo),
    },
    {
      key: "2",
      label: "contracts ",
      children: showContent(contractsInfo),
    },
    {
      key: "3",
      label: "persona 配置",
      children: (
        <SchemaForm
          state={personaStatus}
          schema={personaSchema}
          onFinish={onFinishPersona}
        />
      ),
    },

    {
      key: "4",
      label: "mode 配置",
      children: (
        <SchemaForm
          state={modeStatus}
          schema={modeSchema}
          onFinish={onFinishMode}
        />
      ),
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="inline-block">
      {contextHolder}
      <SettingFilled
        style={{ color: "#1877F2" }}
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        width={800}
        className="agent-setting"
        title={
          <span>
            Agent设置
            <span className="rounded bg-green-500 text-white text-xs px-1 ml-2 ">
              {/* speech-chat */}
              {mode}
            </span>
          </span>
        }
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        maskClosable={false}
      >
          <Spin spinning={loading}>
            <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
          </Spin>
      </Modal>
    </div>
  );
};

export default AgentSetting;
