import { Modal, message, Spin} from "antd";
import { useEffect, useState } from "react";
import {
  getAgentData,
  getAgentSchema,
  changeAgentPermission,
  SetAgentInfo,
} from "./../http";
import { SettingFilled } from "@ant-design/icons";
import FormRender, { useForm } from "form-render";
import "./AgentSetting.css";

const AgentSetting = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [schema, setSchema] = useState({});
  const [status, setStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disField, setDisField] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const form = useForm();

  useEffect(() => {
    getAgentSchema().then(({ schema }) => {
      const originalSchema = schema;
      changeAgentPermission().then(({ permissions }) => {
        const disArr = permissions.immutable_fields;
        setDisField([...disArr]);
        // console.log(originalSchema);
        disArr.forEach((item: string) => {
          // console.log(item);
          const keyArr = item.split(".");
          if (
            originalSchema.properties[keyArr[0]] &&
            originalSchema.properties[keyArr[0]].properties[keyArr[1]]
          ) {
            originalSchema.properties[keyArr[0]].properties[
              keyArr[1]
            ].disabled = true;
          }
        });
        setSchema(originalSchema);
      });
    });
    getAgentData().then(({ info }) => {
      setStatus(info);
      form.setValues(info);
    });
  }, []);
  const onFinish = (formData) => {
    setLoading(true);
    SetAgentInfo(formData).then((data: any) => {
      setLoading(false);
      if (data.success) {
        messageApi.success("更新成功");
        handleCancel();
      }
    });
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
        className="agent-setting"
        title="Coco参数配置"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Spin spinning={loading}>
          <FormRender
            className="w-full"
            style={{ maxHeight: "700px", overflowY: "auto", overflowX: "hidden" }}
            maxWidth={360}
            form={form}
            schema={schema}
            displayType="inline"
            footer
            onFinish={onFinish}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default AgentSetting;
