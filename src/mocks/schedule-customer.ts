type Schedule = {
    id: string
    date: string
    name: string
    role: string
    room: string
    status: string
}

const schedules: Schedule[] = [
    {
        id: "1",
        date: "15/12/2024 às 10:30",
        name: "Gabriel Silva",
        role: "Cliente",
        room: "101",
        status: "Confirmado",
    },
    {
        id: "2",
        date: "20/12/2024 às 14:00",
        name: "Mariana Souza",
        role: "Cliente",
        room: "102",
        status: "Em análise",
    },
    {
        id: "3",
        date: "22/12/2024 às 09:00",
        name: "Lucas Almeida",
        role: "Cliente",
        room: "203",
        status: "Cancelado",
    },
]

export default schedules;