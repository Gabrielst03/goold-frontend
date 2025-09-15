'use client'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateRoom } from '@/hooks/useRooms'
import z from 'zod'

const createRoomSchema = z.object({
    number: z.string().min(1, 'Número da sala é obrigatório'),
    startTime: z.string().min(1, 'Horário de abertura é obrigatório'),
    endTime: z.string().min(1, 'Horário de fechamento é obrigatório'),
    intervalMinutes: z.enum(['15', '30', '60'], {
        message: 'Selecione um intervalo válido'
    })
})

type CreateRoomFormData = z.infer<typeof createRoomSchema>

interface CreateRoomModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function CreateRoomModal({ isOpen, onClose, onSuccess }: CreateRoomModalProps) {
    const createRoomMutation = useCreateRoom()

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CreateRoomFormData>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            intervalMinutes: '30'
        }
    })

    const intervalMinutes = watch('intervalMinutes')

    const handleCreateRoom = async (data: CreateRoomFormData) => {
        try {
            await createRoomMutation.mutateAsync({
                number: data.number,
                startTime: data.startTime,
                endTime: data.endTime,
                intervalMinutes: parseInt(data.intervalMinutes)
            })

            toast.success('Sala criada com sucesso!')
            reset()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Erro ao criar sala:', error)
            toast.error('Erro ao criar sala. Tente novamente.')
        }
    }

    const generateTimeOptions = () => {
        const options = []
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                options.push(time)
            }
        }
        return options
    }

    const timeOptions = generateTimeOptions()

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[500px]">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle>Nova Sala</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleCreateRoom)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Número da Sala</label>
                        <Input
                            {...register('number')}
                            placeholder="Ex: 101, A1, B2"
                            disabled={createRoomMutation.isPending}
                        />
                        {errors.number && (
                            <span className="text-red-500 text-sm">{errors.number.message}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Horário de Abertura</label>
                            <Select onValueChange={(value) => setValue('startTime', value)} disabled={createRoomMutation.isPending}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="08:00" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeOptions.map((time) => (
                                        <SelectItem key={`start-${time}`} value={time}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.startTime && (
                                <span className="text-red-500 text-sm">{errors.startTime.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Horário de Fechamento</label>
                            <Select onValueChange={(value) => setValue('endTime', value)} disabled={createRoomMutation.isPending}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="18:00" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeOptions.map((time) => (
                                        <SelectItem key={`end-${time}`} value={time}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.endTime && (
                                <span className="text-red-500 text-sm">{errors.endTime.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium">Bloco de Horários de agendamento</label>
                        <Select

                            value={intervalMinutes}
                            onValueChange={(value) => setValue('intervalMinutes', value as '15' | '30' | '60')}
                            disabled={createRoomMutation.isPending}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 minutos</SelectItem>
                                <SelectItem value="30">30 minutos</SelectItem>
                                <SelectItem value="60">1 hora</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.intervalMinutes && (
                            <span className="text-red-500 text-sm">{errors.intervalMinutes.message}</span>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <strong>Resumo:</strong> A sala estará disponível para agendamentos em blocos de{' '}
                            <strong>{intervalMinutes === '60' ? '1 hora' : `${intervalMinutes} minutos`}</strong> durante o funcionamento.
                        </p>
                    </div>

                    <DialogFooter className="mt-4 border-t pt-4">
                        <div className="flex gap-2 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={createRoomMutation.isPending}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={createRoomMutation.isPending}
                                className="flex-1"
                            >
                                {createRoomMutation.isPending ? 'Criando...' : 'Criar Sala'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}