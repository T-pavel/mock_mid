import {
  Card,
  Space,
  Button,
  DatePicker,
  Typography,
  Modal,
  Form,
  Input,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  getUserRole,
  loadReviewScoped,
  saveReviewScoped,
  type ReviewData,
  addHistory,
} from "../utils/storage";
import { useEffect, useState } from "react";

type Props = { scope: string };

export default function ReviewPIBlock({ scope }: Props) {
  const role = getUserRole();
  const isEditable = role === "project";
  const [data, setData] = useState<ReviewData>(loadReviewScoped(scope));
  const [plan, setPlan] = useState<Dayjs | null>(
    data.planDate ? dayjs(data.planDate) : null
  );
  const [fact, setFact] = useState<Dayjs | null>(
    data.factDate ? dayjs(data.factDate) : null
  );
  const [isRejectOpen, setRejectOpen] = useState(false);
  const [rejectForm] = Form.useForm<{ reason: string }>();

  useEffect(() => {
    const d = loadReviewScoped(scope);
    setData(d);
    setPlan(d.planDate ? dayjs(d.planDate) : null);
    setFact(d.factDate ? dayjs(d.factDate) : null);
  }, [scope]);

  useEffect(() => {
    const refresh = () => {
      const d = loadReviewScoped(scope);
      setData(d);
      setPlan(d.planDate ? dayjs(d.planDate) : null);
      setFact(d.factDate ? dayjs(d.factDate) : null);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key === `reviewMeta:${scope}`) {
        refresh();
      }
    };
    const onCustom = (e: Event) => {
      const evt = e as CustomEvent<{ scope: string }>;
      if (evt.detail?.scope === scope) refresh();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("review:updated", onCustom as EventListener);
    window.addEventListener("review:cleared", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("review:updated", onCustom as EventListener);
      window.removeEventListener("review:cleared", onCustom as EventListener);
    };
  }, [scope]);

  const approve = () => {
    const next: ReviewData = {
      planDate: plan ? plan.format("YYYY-MM-DD") : undefined,
      factDate: fact ? fact.format("YYYY-MM-DD") : undefined,
      status: "approved",
      rejectionReason: undefined,
    };
    saveReviewScoped(scope, next);
    setData(next);
    window.dispatchEvent(
      new CustomEvent("review:updated", { detail: { scope } })
    );
    addHistory("Параметр согласован", scope);
  };

  const openReject = () => {
    rejectForm.resetFields();
    setRejectOpen(true);
  };

  const submitReject = async () => {
    const v = await rejectForm.validateFields();
    const next: ReviewData = {
      planDate: plan ? plan.format("YYYY-MM-DD") : undefined,
      factDate: fact ? fact.format("YYYY-MM-DD") : undefined,
      status: "rejected",
      rejectionReason: v.reason,
    };
    saveReviewScoped(scope, next);
    setData(next);
    setRejectOpen(false);
    window.dispatchEvent(
      new CustomEvent("review:updated", { detail: { scope } })
    );
    addHistory("Параметр отклонён", scope, v.reason);
  };

  return (
    <Card
      title="Рассмотрение ПИ"
      style={{
        marginTop: 16,
        width: "calc((100% - 32px) / 3)",
        flex: "0 0 calc((100% - 32px) / 3)",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Typography.Text>План:</Typography.Text>
          <DatePicker value={plan} onChange={setPlan} disabled={!isEditable} />
        </Space>
        <Space>
          <Typography.Text>Факт:</Typography.Text>
          <DatePicker value={fact} onChange={setFact} disabled={!isEditable} />
        </Space>
        <Space>
          <Button type="primary" onClick={approve} disabled={!isEditable}>
            Согласовать
          </Button>
          <Button danger onClick={openReject} disabled={!isEditable}>
            Отклонить
          </Button>
        </Space>
        <Typography.Text>
          Статус:{" "}
          {data.status === "approved"
            ? "Согласовано"
            : data.status === "rejected"
            ? "Отклонено"
            : "Не задан"}
        </Typography.Text>
        {data.status === "rejected" && data.rejectionReason && (
          <Typography.Paragraph type="danger">
            Причина отклонения: {data.rejectionReason}
          </Typography.Paragraph>
        )}
      </Space>

      <Modal
        title="Причина отклонения"
        open={isRejectOpen}
        onCancel={() => setRejectOpen(false)}
        onOk={submitReject}
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose
        centered
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Причина"
            rules={[{ required: true, message: "Укажите причину отклонения" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
