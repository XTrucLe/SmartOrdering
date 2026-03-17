export const formatCurrency = (
  money: string | number,
  type: string = "VND",
) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: type,
  }).format(Number(money));
};
