export const formatCurrency = (amount: number | string, currency: string) => {
  return Number(amount).toLocaleString("vi-VN", {
    style: "currency",
    currency: currency ?? "VND",
  });
};
