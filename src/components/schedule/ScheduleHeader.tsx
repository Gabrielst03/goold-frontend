'use client'
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns'
import { Calendar } from "../ui/calendar";
import { useState } from "react";

export function ScheduleHeader() {
    const [date, setDate] = useState<Date>()

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
                                {date ? format(date, "PPP") : <span>Selecione</span>}
                            </div>
                            <CalendarIcon />

                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                </Popover>
            </div>

            <Button size={'lg'}>
                Novo Agendamento
            </Button>
        </header>
    )
}