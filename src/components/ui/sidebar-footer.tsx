import { ChevronDown, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

type AccountInfo = {
    firstName: string;
    lastName: string;
    accountType: string;
}

export function SidebarFooter({ accountInfo }: { accountInfo: AccountInfo }) {
    const { logout } = useAuth();
    const { firstName, lastName, accountType } = accountInfo;

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex items-center justify-between p-4 border-t">
            <div>
                <p className="font-semibold text-zinc-800">{firstName} {lastName}</p>
                <p className="text-sm text-zinc-600">{accountType}</p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="p-2 hover:bg-zinc-200 rounded cursor-pointer">
                        <ChevronDown />
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="text-red-500 mr-2 h-4 w-4" />
                        <span className="text-red-500">Desconectar</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}