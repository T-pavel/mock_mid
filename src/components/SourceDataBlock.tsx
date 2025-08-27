import { Card, Typography, Menu } from "antd";
import { useEffect, useMemo, useState } from "react";

type Props = {
  equipmentType?: string;
  selectedKey?: string;
  onSelect?: (key: string, label: string) => void;
  statusVersion?: number;
};

const paramsByType: Record<
  string,
  Array<{ label: string; description: string }>
> = {
  typeA: [
    { label: "Параметр A1", description: "Описание параметра A1" },
    { label: "Параметр A2", description: "Описание параметра A2" },
    { label: "Параметр A3", description: "Описание параметра A3" },
  ],
  typeB: [
    { label: "Параметр B1", description: "Описание параметра B1" },
    { label: "Параметр B2", description: "Описание параметра B2" },
  ],
  typeC: [
    { label: "Параметр C1", description: "Описание параметра C1" },
    { label: "Параметр C2", description: "Описание параметра C2" },
    { label: "Параметр C3", description: "Описание параметра C3" },
    { label: "Параметр C4", description: "Описание параметра C4" },
  ],
};

export default function SourceDataBlock({
  equipmentType,
  selectedKey: selectedKeyProp,
  onSelect,
}: Props) {
  const currentType =
    equipmentType && paramsByType[equipmentType] ? equipmentType : "typeA";
  const items = paramsByType[currentType] ?? [];
  const [selectedKey, setSelectedKey] = useState<string>(
    selectedKeyProp ?? "0"
  );

  useEffect(() => {
    setSelectedKey("0");
  }, [currentType]);

  const menuItems = useMemo(
    () => items.map((it, idx) => ({ key: String(idx), label: it.label })),
    [items]
  );

  const selectedItem = items[Number(selectedKey)];

  return (
    <Card
      title="Исходные данные"
      style={{
        marginTop: 16,
        width: "calc((100% - 32px) / 3)",
        flex: "0 0 calc((100% - 32px) / 3)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(info) => {
            setSelectedKey(info.key);
            if (onSelect) {
              const idx = Number(info.key);
              const item = items[idx];
              onSelect(info.key, item?.label ?? "");
            }
          }}
          style={{ height: "100%", borderRight: 0 }}
        />

        <div>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            {selectedItem?.label ?? "—"}
          </Typography.Title>
          <Typography.Paragraph
            style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}
          >
            {selectedItem?.description ?? "Выберите параметр слева"}
          </Typography.Paragraph>
        </div>
      </div>
    </Card>
  );
}
