import { Card, List, Typography } from "antd";
import { loadHistory } from "../utils/storage";
import { useEffect, useState } from "react";

type Entry = ReturnType<typeof loadHistory>[number];

export default function HistoryBlock() {
  const [items, setItems] = useState<Entry[]>(loadHistory());

  useEffect(() => {
    const refresh = () => setItems(loadHistory());
    window.addEventListener("history:updated", refresh as EventListener);
    return () =>
      window.removeEventListener("history:updated", refresh as EventListener);
  }, []);

  return (
    <Card
      title="История изменений"
      style={{ marginTop: 16, width: "50%", flex: "0 0 50%" }}
    >
      <List
        dataSource={items}
        bordered
        locale={{ emptyText: "Пока нет записей" }}
        renderItem={(it) => (
          <List.Item>
            <List.Item.Meta
              title={`${new Date(it.timestamp).toLocaleString()} • ${
                it.action
              }`}
              description={
                <Typography.Text type="secondary">
                  {it.scope ?? "—"} {it.details ? `• ${it.details}` : ""}
                </Typography.Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
