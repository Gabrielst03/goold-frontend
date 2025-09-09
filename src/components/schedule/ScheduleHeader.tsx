'use client'
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from 'date-fns'
import { dateLocale } from "@/lib/date-config";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { TimePicker } from "./TimePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAvailableRooms } from "@/hooks/useRooms";
import { useCreateSchedule } from "@/hooks/useSchedules";

export function ScheduleHeader() {
    const [date, setDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState<string>()
    const [selectedRoom, setSelectedRoom] = useState<string>()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { data: availableRooms = [] } = useAvailableRooms()
    const createScheduleMutation = useCreateSchedule()

    const canCreate = date && selectedTime && selectedRoom
    const isCreating = createScheduleMutation.isPending

    const handleCreateSchedule = async () => {
        if (!canCreate) return

        const scheduleDateTime = new Date(date)
        const [hours, minutes] = selectedTime.split(':')
        scheduleDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

        try {
            await createScheduleMutation.mutateAsync({
                scheduleDate: scheduleDateTime.toISOString(),
                roomId: parseInt(selectedRoom)
            })

            setDate(undefined)
            setSelectedTime(undefined)
            setSelectedRoom(undefined)
            setIsDialogOpen(false)
        } catch (error) {
            console.error('Erro ao criar agendamento:', error)
        }
    }

    return (
        <header className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Filtre por nome"
                    className="w-[300px]"
                    showSearchIcon={true}
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
                                        data-empty={!date}
                                        className="flex items-center justify-between h-11 w-full text-zinc-400"
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

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Selecione um <strong>horário</strong> (Obrigatório)</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!selectedTime}
                                        className="flex items-center justify-between h-11 w-full text-zinc-400"
                                    >
                                        <div>
                                            {selectedTime ? selectedTime : <span>Selecione</span>}
                                        </div>
                                        <Clock />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <TimePicker value={selectedTime} onSelect={setSelectedTime} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Selecione uma <strong>sala</strong> (Obrigatório)</label>
                            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                                <SelectTrigger className="h-11 w-full">
                                    <SelectValue placeholder="Selecione uma sala" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRooms.map((room) => (
                                        <SelectItem key={room.id} value={room.id.toString()}>
                                            <span>Sala {room.number}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
        </header>
    )
}