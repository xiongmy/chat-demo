import { Modal, message } from "antd";
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
  const form = useForm();

  useEffect(() => {
    getAgentSchema().then((res) => {
      // let formSchema = res.data.schema
      // for(let key in formSchema){
      //   console.log(formSchema[key])
      //   for(let downkey in formSchema[key]){
      //     console.log(formSchema[key])
      //   }
      // }
      const originalSchema = res.data.schema
      changeAgentPermission().then((res) => {
        const disArr = res.data.permissions.immutable_fields;
        setDisField([...disArr]);
        console.log(originalSchema)
        disArr.forEach((item:string) => {
          console.log(item)
          const keyArr = item.split('.')
          if(originalSchema.properties[keyArr[0]] && originalSchema.properties[keyArr[0]].properties[keyArr[1]]){
            originalSchema.properties[keyArr[0]].properties[keyArr[1]].disabled = true
          }
          
        });
        console.log(originalSchema)
        setSchema(originalSchema)
      });      
    });
    getAgentData().then((res) => {
      setStatus(res.data.info);
      form.setValues(res.data.info);
    });
    
  }, []);
  const onFinish = (formData) => {
    SetAgentInfo(formData).then((res) => {
      if (res.data.success) {
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
        title="Coco参数配置"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
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
      </Modal>
    </div>
  );
};

export default AgentSetting;
