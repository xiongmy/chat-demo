import { Button, Modal, Input, Form, Space } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const { TextArea } = Input;

const AgentInfo = ({ agent = "", onCreate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    getList();
  }, []);

  const getList = () => {};
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values: any) => {
    onCreate(values.name)
    setIsModalOpen(false);
    form.resetFields();
  };

  const onCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div className="user-management inline-block">
      <Button type="link" size="small" onClick={() => setIsModalOpen(true)}>
        <PlusOutlined />
      </Button>
      <Modal
        title={<p className="flex h-8 leading-8">新增技能</p>}
        width={488}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="mb-6">
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
          >
            <Form.Item name="name" label="技能名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="code" label="技能代码" rules={[{ required: true }]}>
               <TextArea rows={5} />
            </Form.Item>
           
            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="button" onClick={onCancel}>
                  cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AgentInfo;
