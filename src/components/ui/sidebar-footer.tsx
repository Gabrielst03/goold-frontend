import { ChevronDown, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";


type AccountInfo = {
    firstName: string;
    lastName: string;
    accountType: string;
}

export function SidebarFooter({ accountInfo }: { accountInfo: AccountInfo }) {

    const { firstName, lastName, accountType } = accountInfo;

    return (
        <div className="flex items-center justify-between p-4 border-t">
            <div>
                <p className="font-semibold text-zinc-800">{firstName} {lastName}</p>
                <p>{accountType}</p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="p-2 hover:bg-zinc-200 rounded cursor-pointer">
                        <ChevronDown />
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <LogOut className="text-red-500" />
                        Desconectar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}