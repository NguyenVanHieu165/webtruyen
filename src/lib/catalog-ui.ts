import type {
  CatalogQuery,
  StoryLifecycle,
} from "@/features/catalog/model";

export const lifecycleLabels: Record<StoryLifecycle, string> = {
  ongoing: "Đang ra",
  completed: "Đã hoàn thành",
  hiatus: "Tạm dừng",
};

export const sortLabels: Record<CatalogQuery["sort"], string> = {
  updated: "Mới cập nhật",
  newest: "Mới xuất bản",
  title: "Theo tên",
};

export function formatDateVi(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}
