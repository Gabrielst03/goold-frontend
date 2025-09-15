'use client'
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from 'date-fns'
import { dateLocale } from "@/lib/date-config";
import { Calendar } from "../ui/calendar";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { RoomTimePicker } from "./RoomTimePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAvailableRooms } from "@/hooks/useRooms";
import { useCreateSchedule } from "@/hooks/useSchedules";
import { toast } from "react-toastify";
import { Room } from "@/types/room";
import { CreateRoomModal } from "./CreateRoomModal";

export function ScheduleHeader() {
    const { user } = useAuth();
    const isAdmin = user?.accountType === 'admin';
    const router = useRouter();
    const searchParams = useSearchParams();
    const [date, setDate] = useState<Date | undefined>(() => {
        const dateParam = searchParams.get('date');
        return dateParam ? new Date(dateParam) : undefined;
    });
    const [name, setName] = useState<string>(searchParams.get('name') || '');
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string>();
    const [selectedRoom, setSelectedRoom] = useState<string>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

    const { data: availableRooms = [], refetch: refetchRooms } = useAvailableRooms()
    const createScheduleMutation = useCreateSchedule()

    const selectedRoomData = availableRooms.find((room: Room) => room.id.toString() === selectedRoom)

    const handleRoomChange = (roomId: string) => {
        setSelectedRoom(roomId)
        setSelectedTime(undefined)
    }

    const canCreate = scheduleDate && selectedTime && selectedRoom
    const isCreating = createScheduleMutation.isPending

    const handleCreateSchedule = async () => {
        if (!canCreate) return

        const scheduleDateTime = new Date(scheduleDate)
        const [hours, minutes] = selectedTime.split(':')
        scheduleDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

        try {
            await createScheduleMutation.mutateAsync({
                scheduleDate: scheduleDateTime.toISOString(),
                roomId: parseInt(selectedRoom)
            })

            setScheduleDate(undefined)
            setSelectedTime(undefined)
            setSelectedRoom(undefined)
            setIsDialogOpen(false)

            toast.success("Agendamento criado com sucesso!", {
                position: "top-right",
                autoClose: 3000
            })
        } catch (error) {
            console.error('Erro ao criar agendamento:', error)
            toast.error("Erro ao criar agendamento. Tente novamente.", {
                position: "top-right",
                autoClose: 4000
            })
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (name) {
            params.set('name', name);
        } else {
            params.delete('name');
        }
        if (date) {
            params.set('date', date.toISOString().split('T')[0]);
        } else {
            params.delete('date');
        }
        router.replace(`?${params.toString()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, date]);

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <header className="flex items-center justify-between border-b pb-4">
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
                                {date ? format(date, "PPP", { locale: dateLocale }) : <span>Selecione</span>}
                            </div>
                            <CalendarIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} locale={dateLocale} />
                    </PopoverContent>
                </Popover>
            </div>

            {isAdmin ? (
                <Button size="lg" onClick={() => setIsCreateRoomModalOpen(true)}>
                    Ajustes de agendamento
                </Button>
            ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size={'lg'}>
                            Novo Agendamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[400px]">
                        <DialogHeader className="border-b pb-4">
                            <DialogTitle>
                                Novo Agendamento
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Selecione uma <strong>data</strong> (Obrigatório)</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!scheduleDate}
                                            className="flex items-center justify-between h-11 w-full text-zinc-400"
                                        >
                                            <div>
                                                {scheduleDate ? format(scheduleDate, "PPP", { locale: dateLocale }) : <span>Selecione</span>}
                                            </div>
                                            <CalendarIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} locale={dateLocale} disabled={isPastDate} />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Selecione uma <strong>sala</strong> (Obrigatório)</label>
                                <Select value={selectedRoom} onValueChange={handleRoomChange}>
                                    <SelectTrigger className="h-11 w-full">
                                        <SelectValue placeholder="Selecione uma sala" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRooms.map((room: Room) => (
                                            <SelectItem key={room.id} value={room.id.toString()}>
                                                <span>Sala {room.number}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm">Selecione um <strong>horário</strong> (Obrigatório)</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!selectedTime}
                                            className="flex items-center justify-between h-11 w-full text-zinc-400"
                                            disabled={!selectedRoomData}
                                        >
                                            <div>
                                                {selectedTime ? selectedTime : <span>Selecione</span>}
                                            </div>
                                            <Clock />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <RoomTimePicker
                                            room={selectedRoomData}
                                            value={selectedTime}
                                            onSelect={setSelectedTime}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {createScheduleMutation.isError && (
                                <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded text-sm">
                                    Erro ao criar agendamento. Tente novamente.
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-5 border-t">
                            <Button
                                size={'lg'}
                                className="w-full mt-5"
                                onClick={handleCreateSchedule}
                                disabled={!canCreate || isCreating}
                            >
                                {isCreating ? 'Criando...' : 'Confirmar Agendamento'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            <CreateRoomModal
                isOpen={isCreateRoomModalOpen}
                onClose={() => setIsCreateRoomModalOpen(false)}
                onSuccess={() => {
                    refetchRooms()
                }}
            />
        </header>
    )
}