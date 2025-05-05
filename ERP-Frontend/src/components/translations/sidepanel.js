import { href } from "react-router-dom";

export const sidebarDictionary = {
    title: {
        Portuguese: "Gestão",
        English: "Dashboard"
    },
    buttons: [
        {
            href: "/",
            Portuguese: "Painel",
            English: "Dashboard"
        },
        {
            href: "/companies",
            Portuguese: "Empresas",
            English: "Companies"
        },
        {
            href: "/customers",
            Portuguese: "Clientes",
            English: "Customers"
        },
        {
            href: "/products",
            Portuguese: "Produtos",
            English: "Products"
        },
        {
            href: "/orders",
            Portuguese: "Pedidos",
            English: "Orders"
        },
        {
            href: "/shipments",
            Portuguese: "Envios",
            English: "Shipments"
        }
    ]
}