import { useState } from "react";
import { Layout, Button, Modal, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import type { IdCardData } from "../types/idCard";
import { saveIdCardForm } from "../utils/storage";

const { Header, Content } = Layout;

export default function CreateIdCardPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [form] = Form.useForm<IdCardData>();

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      saveIdCardForm<IdCardData>(values);
      navigate("/id-card");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button type="primary" disabled>
          Создать новую карточку ИД
        </Button>
      </Header>
      <Content style={{ padding: 0 }}>
        <Modal
          title="Создание карточки ИД"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Сохранить"
          cancelText="Отмена"
          destroyOnClose
          centered
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="constructionObject"
              label="Объект строительства"
              rules={[
                { required: true, message: "Укажите объект строительства" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="kit"
              label="Комплект"
              rules={[{ required: true, message: "Укажите комплект" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="equipmentType"
              label="Тип оборудования"
              rules={[{ required: true, message: "Укажите тип оборудования" }]}
            >
              <Select
                options={[
                  { value: "typeA", label: "Тип A" },
                  { value: "typeB", label: "Тип B" },
                  { value: "typeC", label: "Тип C" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="equipmentName"
              label="Наименование оборудования"
              rules={[
                {
                  required: true,
                  message: "Укажите наименование оборудования",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="designer"
              label="Проектировщик"
              rules={[{ required: true, message: "Укажите проектировщика" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
