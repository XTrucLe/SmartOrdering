export const ClientRoute = {
  menu: (store_slug: string) => `/${store_slug}`,
  checkout: (store_slug: string) => `/${store_slug}/checkout`,
  order: (store_slug: string, orderId: string) =>
    `/${store_slug}/order/${orderId}`,
};
