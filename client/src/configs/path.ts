export const paths = {
    staff: {
        root: (store_slug: string) => `/staff/${store_slug}`,
        orders: (store_slug: string) => `/staff/${store_slug}/orders`,
        order: (store_slug: string, orderId: string) => `/staff/${store_slug}/order/${orderId}`,
    },
    manager: {
        root: (store_slug: string) => `/manager/${store_slug}`,
        orders: (store_slug: string) => `/manager/${store_slug}/orders`,
        menu: (store_slug: string) => `/manager/${store_slug}/menu`,
        tables: (store_slug: string) => `/manager/${store_slug}/tables`,
        queue: (store_slug: string) => `/manager/${store_slug}/queue`,
        reports: (store_slug: string) => `/manager/${store_slug}/reports`,
    },
    client: {
        root: (store_slug: string) => `/${store_slug}`,
        menu: (store_slug: string) => `/${store_slug}`,
        order: (store_slug: string, orderId: string) => `/${store_slug}/order/${orderId}`,
        checkout: (store_slug: string, orderId: string) => `/${store_slug}/checkout/${orderId}`,
    },
    public: {
        root: "/",
        login: "/login",
        register: "/register",
        home: "/",
        about: "/about",
        contact: "/contact",
    },
}

export const goHome = (role: string, store_slug: string) => {
    switch (role) {
        case "staff":
            return paths.staff.root(store_slug);
        case "manager":
            return paths.manager.root(store_slug);
        default:
            return paths.public.home;
    }
}