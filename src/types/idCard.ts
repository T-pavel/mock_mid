export type IdCardData = {
  constructionObject: string;
  kit: string;
  equipmentType: string;
  equipmentName: string;
  designer: string;
  // Доп. поля параметров заказчика
  countStartEvent?: string; // событие отсчета
  supplier?: string; // поставщик
  supplierResponsible?: string; // отв от поставщика
  countStartDate?: string; // ISO-строка даты начала отсчета
};
