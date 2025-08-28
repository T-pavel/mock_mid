import { useState } from "react";
import {
  Layout,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import type { IdCardData } from "../types/idCard";
import { loadIdCardForm, saveIdCardForm, getUserRole } from "../utils/storage";
import SourceDataBlock from "../components/SourceDataBlock";
import AttachmentsBlock from "../components/AttachmentsBlock";
import ReviewPIBlock from "../components/ReviewPIBlock";
import GlobalAttachmentsBlock from "../components/GlobalAttachmentsBlock";
import HistoryBlock from "../components/HistoryBlock";
import ChatWidget from "../components/ChatWidget";

const { Header, Content } = Layout;

type CustomerParamsFormValues = {
  countStartEvent?: string;
  supplier?: string;
  supplierResponsible?: string;
  countStartDate?: Dayjs | null;
};

export default function IdCardHeaderPage() {
  const [data, setData] = useState<IdCardData | undefined>(
    loadIdCardForm<IdCardData>() || undefined
  );
  const [currentScope, setCurrentScope] = useState<string>(() => {
    const eq = (loadIdCardForm<IdCardData>() || {}).equipmentType ?? "typeA";
    return `${eq}:Параметр A1`;
  });
  const role = getUserRole();
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [form] = Form.useForm<CustomerParamsFormValues>();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  type AllFieldsFormValues = Omit<IdCardData, "countStartDate"> & {
    countStartDate?: Dayjs | null;
  };
  const [editForm] = Form.useForm<AllFieldsFormValues>();

  const openCustomerModal = () => {
    form.setFieldsValue({
      countStartEvent: data?.countStartEvent,
      supplier: data?.supplier,
      supplierResponsible: data?.supplierResponsible,
      countStartDate: data?.countStartDate
        ? dayjs(data.countStartDate)
        : undefined,
    });
    setCustomerModalOpen(true);
  };

  const handleSaveCustomer = async () => {
    const values = await form.validateFields();
    const merged: IdCardData = {
      ...(data as IdCardData),
      ...values,
      countStartDate: values.countStartDate
        ? values.countStartDate.format("YYYY-MM-DD")
        : undefined,
    };
    saveIdCardForm<IdCardData>(merged);
    setData(merged);
    setCustomerModalOpen(false);
  };

  const openEditModal = () => {
    editForm.setFieldsValue({
      constructionObject: data?.constructionObject,
      kit: data?.kit,
      equipmentType: data?.equipmentType,
      equipmentName: data?.equipmentName,
      designer: data?.designer,
      countStartEvent: data?.countStartEvent,
      supplier: data?.supplier,
      supplierResponsible: data?.supplierResponsible,
      countStartDate: data?.countStartDate
        ? dayjs(data.countStartDate)
        : undefined,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const values = await editForm.validateFields();
    const merged: IdCardData = {
      ...(data as IdCardData),
      ...values,
      countStartDate: values.countStartDate
        ? (values.countStartDate as Dayjs).format("YYYY-MM-DD")
        : undefined,
    };
    saveIdCardForm<IdCardData>(merged);
    setData(merged);
    setEditModalOpen(false);
  };

  const downloadDraft = () => {
    try {
      const blob = new Blob(
        ["PDF draft placeholder for IdCard (fake content)\n"],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Черновик карточки.pdf";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {
      // no-op
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          paddingInline: 16,
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>Карточка ИД</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Space>
            {role === "functionalAdmin" && (
              <Button onClick={openEditModal}>Изменить</Button>
            )}
            {role === "provider" && (
              <Button type="primary" onClick={openCustomerModal}>
                Заполнить параметры заказчика
              </Button>
            )}
          </Space>
        </div>
      </Header>
      <Content style={{ padding: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span>
            <strong>Объект строительства:</strong>{" "}
            {data?.constructionObject ?? "-"}
          </span>
          <span>
            <strong>Комплект:</strong> {data?.kit ?? "-"}
          </span>
          <span>
            <strong>Тип оборудования:</strong> {data?.equipmentType ?? "-"}
          </span>
          <span>
            <strong>Наименование оборудования:</strong>{" "}
            {data?.equipmentName ?? "-"}
          </span>
          <span>
            <strong>Проектировщик:</strong> {data?.designer ?? "-"}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          <span>
            <strong>Событие отсчета:</strong> {data?.countStartEvent ?? "-"}
          </span>
          <span>
            <strong>Поставщик:</strong> {data?.supplier ?? "-"}
          </span>
          <span>
            <strong>Отв от поставщика:</strong>{" "}
            {data?.supplierResponsible ?? "-"}
          </span>
          <span>
            <strong>Дата начала отсчета:</strong> {data?.countStartDate ?? "-"}
          </span>
          {data ? (
            <span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  <FilePdfOutlined style={{ color: "#cf1322" }} />
                  <a onClick={downloadDraft} style={{ fontWeight: 600 }}>
                    Черновик карточки.pdf
                  </a>
                </div>
              </div>
            </span>
          ) : (
            <span style={{ visibility: "hidden" }}>—</span>
          )}
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <SourceDataBlock
            equipmentType={data?.equipmentType}
            selectedKey={data?.equipmentType ? "0" : "0"}
            onSelect={(_, label) => {
              const scope = `${data?.equipmentType ?? "typeA"}:${label}`;
              setCurrentScope(scope);
            }}
            statusVersion={Math.random()} // триггер обновления по событию
          />
          <AttachmentsBlock key={`att-${currentScope}`} scope={currentScope} />
          <ReviewPIBlock key={`rev-${currentScope}`} scope={currentScope} />
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <GlobalAttachmentsBlock />
          <HistoryBlock />
        </div>
      </Content>

      <ChatWidget />

      <Modal
        title="Параметры заказчика"
        open={isCustomerModalOpen}
        onCancel={() => setCustomerModalOpen(false)}
        onOk={handleSaveCustomer}
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item name="countStartEvent" label="Событие отсчета">
            <Input />
          </Form.Item>
          <Form.Item name="supplier" label="Поставщик">
            <Input />
          </Form.Item>
          <Form.Item name="supplierResponsible" label="Отв от поставщика">
            <Input />
          </Form.Item>
          <Form.Item name="countStartDate" label="Дата начала отсчета">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Редактировать карточку"
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSaveEdit}
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose
        centered
      >
        <Form form={editForm} layout="vertical">
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
              { required: true, message: "Укажите наименование оборудования" },
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
          <Form.Item name="countStartEvent" label="Событие отсчета">
            <Input />
          </Form.Item>
          <Form.Item name="supplier" label="Поставщик">
            <Input />
          </Form.Item>
          <Form.Item name="supplierResponsible" label="Отв от поставщика">
            <Input />
          </Form.Item>
          <Form.Item name="countStartDate" label="Дата начала отсчета">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
