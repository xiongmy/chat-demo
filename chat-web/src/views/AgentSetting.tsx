import { Modal } from "antd";
import { useEffect, useState } from "react";
import { getAgentData, getAgentSchema, changeAgentPermission } from "./../http";
import { SettingFilled } from "@ant-design/icons";
import FormRender, { useForm } from "form-render";
import './AgentSetting.css'
const AgentSetting = () => {
  const [schema, setSchema] = useState({});
  const [status, setStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disField, setDisField] = useState<string[]>([])
  const form = useForm();

  useEffect(() => {
    getAgentSchema().then((res) => {
      console.log(res);
      setSchema(res.data.schema);
    });
    getAgentData().then((res) => {
      console.log(res);
      setStatus(res.data.info);
      form.setValues(res.data.info);
    });
    changeAgentPermission().then((res)=>{
      const disArr = res.data.permissions.immutable_fields
      console.log(disArr)
      setDisField([...disArr])
    })
  }, []);
  const handleOk = () => {
    setIsModalOpen(false)
  };
  const handleCancel = () => {
    setIsModalOpen(false)
  };
  const onFinish = (formData) => {
    console.log('formData:', formData);
  };
  return (
    <div className="inline-block">
      <SettingFilled
        style={{ color: "#1877F2" }}
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        title="修改信息"
        open={isModalOpen}
        
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <FormRender
          className="w-full"
          maxWidth={360}
          form={form}
          schema={schema}
          displayType="inline"
          onFinish={onFinish} 
        />
      </Modal>
    </div>
  );
};

export default AgentSetting;
