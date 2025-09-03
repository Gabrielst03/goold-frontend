import { ptBR } from 'date-fns/locale'

// Configuração global de localização para date-fns
export const dateLocale = ptBR

// Configurações de formato padrão
export const dateFormats = {
    display: 'PPP', // Para exibição: "15 de setembro de 2023"
    short: 'dd/MM/yyyy', // Para formato curto: "15/09/2023"
    long: 'dd \'de\' MMMM \'de\' yyyy', // Para formato longo: "15 de setembro de 2023"
    time: 'HH:mm', // Para horários: "14:30"
    datetime: 'dd/MM/yyyy HH:mm' // Para data e hora: "15/09/2023 14:30"
}

// Função helper para formatação de datas
export const formatDate = (date: Date, formatType: keyof typeof dateFormats = 'display') => {
    return format(date, dateFormats[formatType], { locale: dateLocale })
}

// Importa format do date-fns para usar na helper function
import { format } from 'date-fns'
