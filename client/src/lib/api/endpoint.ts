export const endpoints = {
  account: {
    detail: (id: string) => `/accounts/${id}`,
    activate: (id: string) => `/accounts/${id}/activate`,
    inactivate: (id: string) => `/accounts/${id}/inactivate`,
  },
  auth: {
    login: "/auth/login",
    register: "/auth/owner-register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  category: {
    root: "/categories",
    detail: (id: string) => `/categories/${id}`,
    disable: (id: string) => `/categories/${id}/disable`,
    enable: (id: string) => `/categories/${id}/enable`,
  },
  items: {
    root: "/ingredients",
    detail: (id: string) => `/ingredients/${id}`,
    code: (code: string) => `/ingredients/code/${code}`,
  },
  menu: {
    root: "/menus",
    detail: (id: string) => `/menus/${id}`,
    sections: (id: string) => `/menus/${id}/menu-sections`,
    activate: (id: string) => `/menus/${id}/activate`,
    deactivate: (id: string) => `/menus/${id}/deactivate`,
  },
  section: {
    root: "/sections",
  },
  menu_item: {
    detail: (id: string) => `/menu-items/${id}`,
    section: (section_id: string) => `/menu-sections/${section_id}/menu-items`,
    reorder: (section_id: string) =>
      `/menu-sections/${section_id}/menu-items/reorder`,
  },
  order: {
    root: "/orders",
    detail: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
    complete: (id: string) => `/orders/${id}/complete`,
    confirm: (id: string) => `/orders/${id}/confirm`,
    prepare: (id: string) => `/orders/${id}/prepare`,
    ready: (id: string) => `/orders/${id}/ready`,
  },
  product: {
    root: "/products",
    detail: (id: string) => `/products/${id}`,
    disable: (id: string) => `/products/${id}/disable`,
    enable: (id: string) => `/products/${id}/enable`,
  },
  profile: {
    account: (account_id: string) => `/profiles/${account_id}`,
    update: (id: string) => `/profiles/${id}`,
    me: "/profiles/me",
  },
  store_member: {
    root: "/members",
    detail: (id: string) => `/members/${id}`,
    managers: "/members/managers",
    staff: "/members/staff",
    membership: "/members/me",
  },
  stores: {
    root: "/stores",
    detail: (id: string) => `/stores/${id}`,
    search: (q: string) => `/stores/${q}`,
    check_slug: (slug: string) => `/stores/check-slug/${slug}`,
    mine: "/stores/my-stores",
  },
  table: {
    root: "/tables",
    detail: (id: string) => `/tables/${id}`,
    status: (id: string) => `/tables/${id}/status`,
    grouped: "/tables/grouped",
    reorder: "/tables/reorder",
  },
  zone: {
    root: "/zones",
    detail: (id: string) => `/zones/${id}`,
    reorder: "/zones/reorder",
  },
} as const;
