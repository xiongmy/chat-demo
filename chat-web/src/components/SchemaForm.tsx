import React, { useEffect } from "react";
import FormRender, { useForm } from "form-render";
import './SchemaForm.css'

interface FormProps {
  state: object;
  schema: object;
  onFinish: (values: object) => void;
}

const SchemaForm: React.FC<FormProps> = ({ state, schema, onFinish }) => {
  const form = useForm();
  useEffect(() => {
    form.setValues(state);
  }, [state]);
  return (
    <FormRender
      className="dynamic-form"
      style={{
        
      }}
      size="small"
      maxWidth={360}
      form={form}
      schema={schema}
      displayType="row"
      footer
      onFinish={onFinish}
    />
  );
};

export default SchemaForm;
