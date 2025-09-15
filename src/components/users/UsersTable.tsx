'use client'

import { useUsers } from '@/hooks/useUsers';
import { useUpdateUserStatus } from '@/hooks/useUpdateUserStatus';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth';
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { CalendarIcon, UserCog, UserX } from "lucide-react";
import { format } from 'date-fns';
import { dateLocale } from "@/lib/date-config";
import { Calendar } from "../ui/calendar";
import { useState, useMemo, useEffect } from "react";
import { Pagination } from "../ui/pagination";

export function UsersTable() {
    const { data: users = [], isLoading, error } = useUsers();
    const { user: currentUser } = useAuth();
    const updateUserStatusMutation = useUpdateUserStatus();
    const updateUserMutation = useUpdateUser();
    const [date, setDate] = useState<string | undefined>(undefined);
    const [name, setName] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [localUserStatus, setLocalUserStatus] = useState<{ [key: number]: boolean }>({});
    const [userToPromote, setUserToPromote] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'promote' | 'demote'>('promote');
    const itemsPerPage = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [name, date]);

    useEffect(() => {
        if (users.length > 0) {
            const initialStatus: { [key: number]: boolean } = {};
            users.forEach(user => {
                initialStatus[user.id] = user.status;
            });
            setLocalUserStatus(initialStatus);
        }
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            let matchesName = true;
            let matchesDate = true;

            if (name) {
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                matchesName = fullName.includes(name.toLowerCase());
            }

            if (date) {
                const createdDate = user.createdAt.split('T')[0];
                matchesDate = createdDate === date;
            }

            return matchesName && matchesDate;
        });
    }, [users, name, date]);

    const total = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleUserStatusChange = (userId: number, newStatus: boolean) => {
        setLocalUserStatus(prev => ({
            ...prev,
            [userId]: newStatus
        }));

        updateUserStatusMutation.mutate({
            id: userId,
            isActive: newStatus
        }, {
            onError: () => {
                setLocalUserStatus(prev => ({
                    ...prev,
                    [userId]: !newStatus
                }));
            }
        });
    };

    const handleChangeAccountType = () => {
        if (!userToPromote) return;

        const newAccountType = actionType === 'promote' ? 'admin' : 'customer';

        updateUserMutation.mutate({
            id: userToPromote.id,
            accountType: newAccountType
        }, {
            onSuccess: () => {
                setUserToPromote(null);
                setIsDialogOpen(false);
            },
            onError: (error) => {
                console.error(`Erro ao ${actionType === 'promote' ? 'promover' : 'rebaixar'} usuário:`, error);
                setIsDialogOpen(false);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="mt-6 border rounded-lg p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-6 border rounded-lg p-6">
                <div className="text-center text-red-500 py-8">Erro ao carregar usuários</div>
            </div>
        );
    }

    return (
        <div className="mt-6 border rounded-lg p-6">
            <header className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Filtre por nome"
                        className="w-[300px]"
                        showSearchIcon={true}
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                data-empty={!date}
                                className="flex items-center justify-between h-11 w-[250px] text-zinc-400"
                            >
                                <div>
                                    {date ? format(new Date(date), "PPP", { locale: dateLocale }) : <span>Selecione uma data</span>}
                                </div>
                                <CalendarIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date ? new Date(date) : undefined}
                                onSelect={d => setDate(d ? d.toISOString().split('T')[0] : undefined)}
                                locale={dateLocale}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </header>

            {filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    Nenhum usuário encontrado
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Data de Criação</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Endereço</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Permissões</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedUsers.map((user: User) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-sm text-gray-800">
                                            {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: dateLocale })}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {user.accountType === 'admin' ? 'Administrador' : 'Cliente'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-800 max-w-[200px]">
                                            <div className="break-words whitespace-normal">
                                                {typeof user.address === 'object' && user.address !== null
                                                    ? [
                                                        user.address.street,
                                                        user.address.number,
                                                        user.address.district,
                                                        user.address.city,
                                                        user.address.state,
                                                        user.address.zipCode
                                                    ].filter(Boolean).join(', ')
                                                    : (user.address || 'Endereço não informado')
                                                }
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2 items-center">
                                                <div className="flex gap-2">
                                                    {user.accountType === 'admin' && (
                                                        <>
                                                            <Badge>
                                                                Agendamento
                                                            </Badge>
                                                            <Badge>
                                                                Logs
                                                            </Badge>
                                                            <Badge>
                                                                Clientes
                                                            </Badge>
                                                        </>
                                                    )}
                                                    {user.accountType === 'customer' && (
                                                        <>
                                                            <Badge>
                                                                Agendamento
                                                            </Badge>
                                                            <Badge>
                                                                Logs
                                                            </Badge>
                                                            <Badge variant='outline'>
                                                                Clientes
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                                {currentUser?.accountType === 'admin' &&
                                                    user.id !== currentUser?.id && (
                                                        <div className="relative group ml-2">
                                                            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                                                                        onClick={() => {
                                                                            setUserToPromote(user);
                                                                            setActionType(user.accountType === 'customer' ? 'promote' : 'demote');
                                                                            setIsDialogOpen(true);
                                                                        }}
                                                                        disabled={updateUserMutation.isPending}
                                                                    >
                                                                        {user.accountType === 'customer' ? (
                                                                            <UserCog className="h-3 w-3 text-green-600" />
                                                                        ) : (
                                                                            <UserX className="h-3 w-3 text-red-600" />
                                                                        )}
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            {actionType === 'promote'
                                                                                ? 'Promover usuário a Administrador'
                                                                                : 'Rebaixar Administrador a Cliente'
                                                                            }
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            {actionType === 'promote' ? (
                                                                                <>
                                                                                    Você tem certeza que deseja promover <strong>{userToPromote?.firstName} {userToPromote?.lastName}</strong> a Administrador?
                                                                                    <br /><br />
                                                                                    Esta ação irá conceder ao usuário acesso total ao sistema, incluindo:
                                                                                    <ul className="list-disc ml-6 mt-2">
                                                                                        <li>Gerenciamento de clientes</li>
                                                                                        <li>Acesso a logs do sistema</li>
                                                                                        <li>Controle de agendamentos</li>
                                                                                    </ul>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    Você tem certeza que deseja rebaixar <strong>{userToPromote?.firstName} {userToPromote?.lastName}</strong> de Administrador para Cliente?
                                                                                    <br /><br />
                                                                                    Esta ação irá remover do usuário os seguintes privilégios:
                                                                                    <ul className="list-disc ml-6 mt-2">
                                                                                        <li>Gerenciamento de clientes</li>
                                                                                        <li>Acesso completo a logs do sistema</li>
                                                                                        <li>Controle total de agendamentos</li>
                                                                                    </ul>
                                                                                    <br />
                                                                                    O usuário manterá apenas acesso básico de cliente.
                                                                                </>
                                                                            )}
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel onClick={() => {
                                                                            setUserToPromote(null);
                                                                            setIsDialogOpen(false);
                                                                        }}>
                                                                            Cancelar
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={handleChangeAccountType}
                                                                            disabled={updateUserMutation.isPending}
                                                                        >
                                                                            {updateUserMutation.isPending
                                                                                ? (actionType === 'promote' ? 'Promovendo...' : 'Rebaixando...')
                                                                                : (actionType === 'promote' ? 'Confirmar Promoção' : 'Confirmar Rebaixamento')
                                                                            }
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                                {user.accountType === 'customer' ? 'Promover a Admin' : 'Rebaixar de Admin'}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={localUserStatus[user.id] ?? user.status}
                                                    onCheckedChange={(checked) => handleUserStatusChange(user.id, checked)}
                                                    disabled={user.id === currentUser?.id}
                                                />
                                                {currentUser?.id === user.id && (
                                                    <span className="text-xs text-gray-500">
                                                        (Sua conta)
                                                    </span>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            hasNextPage={hasNextPage}
                            hasPreviousPage={hasPreviousPage}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={total}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
