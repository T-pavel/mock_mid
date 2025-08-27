import { FloatButton, Modal, Form, Input, List } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useState } from "react";

type Msg = { id: string; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [form] = Form.useForm<{ text: string }>();

  const send = async () => {
    const v = await form.validateFields();
    setMessages([{ id: `${Date.now()}`, text: v.text }, ...messages]);
    form.resetFields();
  };

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setOpen(true)}
      />
      <Modal
        title="Чат"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={send}
        okText="Отправить"
        cancelText="Закрыть"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="text"
            label="Сообщение"
            rules={[{ required: true, message: "Введите сообщение" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
        <List
          style={{ marginTop: 12, maxHeight: 240, overflow: "auto" }}
          dataSource={messages}
          renderItem={(m) => <List.Item>{m.text}</List.Item>}
        />
      </Modal>
    </>
  );
}
