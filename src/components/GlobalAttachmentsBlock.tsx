import { Card, Upload, Button, List, Typography } from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import {
  getUserRole,
  loadGlobalAttachments,
  saveGlobalAttachments,
  type Attachment,
} from "../utils/storage";

export default function GlobalAttachmentsBlock() {
  const role = getUserRole();
  const isProject = role === "project";
  const [files, setFiles] = useState<Attachment[]>(loadGlobalAttachments());

  useEffect(() => {
    setFiles(loadGlobalAttachments());
  }, []);

  const download = (file: Attachment) => {
    const a = document.createElement("a");
    a.href = file.dataUrl;
    a.download = file.name;
    a.click();
  };

  const uploadProps = useMemo(
    () => ({
      beforeUpload: async (file: File) => {
        if (!isProject) return false;
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        const next: Attachment = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
        };
        const updated = [next, ...files];
        setFiles(updated);
        return false;
      },
      showUploadList: false,
    }),
    [files, isProject]
  );

  const remove = (idx: number) => {
    if (!isProject) return;
    setFiles(files.filter((_, i) => i !== idx));
  };

  const save = () => {
    saveGlobalAttachments(files);
  };

  return (
    <Card
      title="Файлы проекта"
      extra={isProject ? <Button onClick={save}>Сохранить</Button> : null}
      style={{ marginTop: 16, width: "50%", flex: "0 0 50%" }}
    >
      {isProject && (
        <Upload {...uploadProps} multiple>
          <Button icon={<UploadOutlined />}>Прикрепить файлы</Button>
        </Upload>
      )}
      <List
        style={{ marginTop: 12 }}
        dataSource={files}
        bordered
        locale={{ emptyText: "Нет файлов" }}
        renderItem={(it, idx) => (
          <List.Item
            actions={[
              <Button
                key="d"
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => download(it)}
              >
                Скачать
              </Button>,
              isProject ? (
                <Button
                  key="r"
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(idx)}
                >
                  Удалить
                </Button>
              ) : undefined,
            ]}
          >
            <List.Item.Meta
              title={it.name}
              description={
                <Typography.Text type="secondary">
                  {Math.round(it.size / 1024)} КБ
                </Typography.Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
