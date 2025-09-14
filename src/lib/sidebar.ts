import { Calendar, ListCheck, User, Users } from "lucide-react";

const sidebarItems = [
    { href: "/", label: "Agendamentos", icon: Calendar },
    { href: "/logs", label: "Logs", icon: ListCheck },
    { href: "/clientes", label: "Clientes", icon: Users, adminOnly: true },
    { href: "/conta", label: "Minha Conta", icon: User },
]

export default sidebarItems;
