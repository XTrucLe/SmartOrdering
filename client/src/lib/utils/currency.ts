export const formatCurrency = (
  amount: number | string,
  currency: string = "VND",
) => {
  return Number(amount).toLocaleString("vi-VN", {
    style: "currency",
    currency: currency,
  });
};
