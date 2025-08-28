import { FloatButton, Form, Input, List, Card, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useState } from "react";

type Msg = { id: string; text: string; createdAt: number };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [form] = Form.useForm<{ text: string }>();

  const send = async () => {
    const v = await form.validateFields();
    const now = Date.now();
    setMessages([{ id: `${now}`, text: v.text, createdAt: now }, ...messages]);
    form.resetFields();
  };

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setOpen((v) => !v)}
      />

      {open && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 92,
            width: "30vw",
            maxWidth: "calc(100% - 48px)",
            height: "70vh",
            zIndex: 1000,
          }}
        >
          <Card
            title="Чат"
            extra={
              <Button type="text" onClick={() => setOpen(false)}>
                ×
              </Button>
            }
            style={{
              background: "#f2f2f2",
              color: "#000",
              border: "1px solid #f7f7f7",
              boxShadow: "0 12px 28px №",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            headStyle={{
              color: "#000",
            }}
            styles={{
              body: {
                paddingTop: 8,
                background: "transparent",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Form form={form} layout="vertical" onFinish={send}>
              <Form.Item
                name="text"
                label="Сообщение"
                rules={[{ required: true, message: "Введите сообщение" }]}
              >
                <Input.TextArea
                  rows={3}
                  style={{
                    borderColor: "#424242",
                  }}
                />
              </Form.Item>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" onClick={() => form.submit()}>
                  Отправить
                </Button>
              </div>
            </Form>
            <List
              split={false}
              style={{
                marginTop: 12,
                overflow: "auto",
                flex: 1,
              }}
              dataSource={messages}
              renderItem={(m) => (
                <List.Item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {m.text}
                    </div>
                    <div style={{ color: "#999", whiteSpace: "nowrap" }}>
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      )}
    </>
  );
}
