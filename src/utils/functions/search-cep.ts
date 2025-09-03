export interface ViaCepResponse {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
    erro?: boolean
}

export interface SearchCepResult {
    success: boolean
    data?: {
        street: string
        city: string
        state: string
        complement?: string
        district?: string
    }
    error?: string
}

/**
 * Busca informações de endereço através do CEP usando a API do ViaCEP
 * @param cep - CEP para buscar (pode conter formatação)
 * @returns Promise com resultado da busca
 */

export async function searchCep(cep: string): Promise<SearchCepResult> {
    const cleanCep = cep.replace(/\D/g, '')

    if (cleanCep.length !== 8) {
        return {
            success: false,
            error: 'CEP deve ter 8 dígitos'
        }
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)

        if (!response.ok) {
            return {
                success: false,
                error: 'Erro na consulta do CEP'
            }
        }

        const data: ViaCepResponse = await response.json()

        if (data.erro) {
            return {
                success: false,
                error: 'CEP não encontrado'
            }
        }

        return {
            success: true,
            data: {
                street: data.logradouro,
                city: data.localidade,
                state: data.uf,
                complement: data.complemento || undefined,
                district: data.bairro || undefined

            }
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error)
        return {
            success: false,
            error: 'Erro ao buscar CEP. Verifique sua conexão.'
        }
    }
}

/**
 * Formata um CEP adicionando hífen na posição correta
 * @param cep - CEP para formatar
 * @returns CEP formatado (00000-000)
 */

export function formatCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '')

    if (cleanCep.length > 5) {
        return cleanCep.slice(0, 5) + '-' + cleanCep.slice(5, 8)
    }

    return cleanCep
}
