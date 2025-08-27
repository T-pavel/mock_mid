import {
  Card,
  Upload,
  Button,
  List,
  DatePicker,
  InputNumber,
  Space,
  Typography,
} from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import {
  getUserRole,
  type Attachment,
  loadAttachmentsScoped,
  saveAttachmentsScoped,
  loadAttachmentsMetaScoped,
  saveAttachmentsMetaScoped,
  clearReviewScoped,
} from "../utils/storage";
import { useEffect, useMemo, useState, useCallback } from "react";
import { addHistory } from "../utils/storage";

type Props = { scope: string };

export default function AttachmentsBlock({ scope }: Props) {
  const role = getUserRole();
  const [files, setFiles] = useState<Attachment[]>(
    loadAttachmentsScoped(scope)
  );
  const metaInit = loadAttachmentsMetaScoped(scope);
  const [termDays, setTermDays] = useState<number | undefined>(
    metaInit.termDays
  );
  const [planDate, setPlanDate] = useState<Dayjs | null>(
    metaInit.planDate ? dayjs(metaInit.planDate) : null
  );
  const [factDate, setFactDate] = useState<Dayjs | null>(
    metaInit.factDate ? dayjs(metaInit.factDate) : null
  );

  const isProvider = role === "provider";

  useEffect(() => {
    // Reload files and meta when scope changes
    setFiles(loadAttachmentsScoped(scope));
    const m = loadAttachmentsMetaScoped(scope);
    setTermDays(m.termDays);
    setPlanDate(m.planDate ? dayjs(m.planDate) : null);
    setFactDate(m.factDate ? dayjs(m.factDate) : null);
  }, [scope]);

  const markDirty = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("attachments:changed", { detail: { scope } })
    );
  }, [scope]);

  const uploadProps = useMemo(
    () => ({
      beforeUpload: async (file: File) => {
        if (!isProvider) return false;
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const next: Attachment = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
        };
        const updated = [...files, next];
        setFiles(updated);
        markDirty();
        return false; // prevent auto upload
      },
      showUploadList: false,
    }),
    [files, isProvider, markDirty]
  );

  const handleDownload = (file: Attachment) => {
    const link = document.createElement("a");
    link.href = file.dataUrl;
    link.download = file.name;
    link.click();
  };

  const removeFile = (idx: number) => {
    if (!isProvider) return;
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    markDirty();
  };

  const saveMeta = () => {
    // Persist both files list and meta only when user clicks Save
    saveAttachmentsScoped(scope, files);
    saveAttachmentsMetaScoped(scope, {
      termDays: termDays,
      planDate: planDate ? planDate.format("YYYY-MM-DD") : undefined,
      factDate: factDate ? factDate.format("YYYY-MM-DD") : undefined,
    });
    // Clear review status and notify UI to refresh status icons
    clearReviewScoped(scope);
    window.dispatchEvent(
      new CustomEvent("review:cleared", { detail: { scope } })
    );
    addHistory("Сохранены файлы поставщика", scope);
  };

  return (
    <Card
      title="Файлы от поставщика"
      style={{
        marginTop: 16,
        width: "calc((100% - 32px) / 3)",
        flex: "0 0 calc((100% - 32px) / 3)",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {isProvider && (
          <Upload {...uploadProps} multiple>
            <Button icon={<UploadOutlined />}>Прикрепить файлы</Button>
          </Upload>
        )}

        <List
          bordered
          dataSource={files}
          locale={{ emptyText: "Нет файлов" }}
          renderItem={(item, idx) => (
            <List.Item
              actions={[
                <Button
                  key="d"
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(item)}
                >
                  Скачать
                </Button>,
                isProvider ? (
                  <Button
                    key="x"
                    type="link"
                    danger
                    onClick={() => removeFile(idx)}
                  >
                    Удалить
                  </Button>
                ) : undefined,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={
                  <Typography.Text type="secondary">
                    {Math.round(item.size / 1024)} КБ
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />

        {isProvider && (
          <Card size="small" title="Сроки" bordered>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Typography.Text>Срок (дней):</Typography.Text>
                <InputNumber
                  min={0}
                  value={termDays}
                  onChange={(v) => {
                    setTermDays(v ?? undefined);
                    markDirty();
                  }}
                />
              </Space>
              <Space>
                <Typography.Text>План:</Typography.Text>
                <DatePicker
                  value={planDate}
                  onChange={(d) => {
                    setPlanDate(d);
                    markDirty();
                  }}
                />
              </Space>
              <Space>
                <Typography.Text>Факт:</Typography.Text>
                <DatePicker
                  value={factDate}
                  onChange={(d) => {
                    setFactDate(d);
                    markDirty();
                  }}
                />
              </Space>
              <Button type="primary" onClick={saveMeta}>
                Сохранить
              </Button>
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
}
