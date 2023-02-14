export const StorageKeys = {
    Theme: "preference:theme",
    Session: "kidztime:session"
};

export const ThemeModes = {
    Dark: "dark",
    Light: "light",
};

export const Paths = {
    Landing: "/",

    Auth: {
        Root: "/auth",
        Login: "/auth/login",
        Password: {
            Request: "/auth/password",
            Reset: "/auth/password/reset"
        }
    },

    Error: {
        Root: "/errors",
        "401": "/errors/error-401",
        "404": "/errors/error-404",
        "500": "/errors/error-500"
    },

    Customers: "/customers",

    Accounts: {
        List: "/accounts",
        New: "/accounts/new",
    },

    Products: {
        CatalogueList: "/products/catalogue/list",
        Create: "/products/create",
        BulkUpdate: "/products/bulkupdate",
        PlatformGraceImport: "/products/platformgrace-import",
    },

    GiftGroups: "/gift-groups/list",

    AccessoryGroups: "/accessory-groups/list",

    DiscountGroups: {
        List: "/discount-groups/list",
        Create: "/discount-groups/create",
    },

    Bundle: {
        List: "/bundle/list",
        New: "/bundle/new",
    },

    Frontend: {
        ProductGroupsList: "/frontend/product-groups/list",
        Homepage: "/frontend/homepage",
        Navigation: "/frontend/navigation",
        Classifications: "/frontend/classifications",
        PagesList: "/frontend/pages/list",
        BottlesList: "/frontend/bottles/list",
    },

    Sales: {
        OrdersList: "/sales/orders/list",
        OrderManagement: "/sales/order-management",
        StrawReplacement: "/sales/straw-replacement",
        ReviewManagement: "/sales/review-management",
    },

    ShippingZones: {
        List: "/shipping-zones/list",
        Create: "/shipping-zones/create",
    }
};

export const Roles = {
    AdminPortal: "admin_portal",
    AdminAccount: "admin_account",
    SuperAdmin: "superadmin"
};

export const ServerErrors = {
    "access_handle conflict": "Email exists",
    "invalid credentials": "Invalid credentials",
}