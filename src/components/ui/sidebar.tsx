'use client'
import sidebarItems from "@/lib/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarFooter } from "./sidebar-footer";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex flex-col h-screen w-64 border-r bg-[#F6F4F1]">
            <div className="p-4 border-b">
                <Image src="/logo.png" alt="Logo" width={64} height={64} />
            </div>

            <nav className="flex flex-col gap-2 mt-6 px-4 flex-1">
                {sidebarItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors
                                ${isActive ? "bg-black text-white" : "hover:bg-zinc-200 text-zinc-800"}
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <SidebarFooter accountInfo={{
                firstName: "Gabriel",
                lastName: "Santana",
                accountType: "Cliente"
            }} />
        </aside>
    );
}
