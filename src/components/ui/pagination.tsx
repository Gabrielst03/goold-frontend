import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    onPageChange: (page: number) => void
    itemsPerPage?: number
    totalItems?: number
}

export function Pagination({
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    onPageChange,
    itemsPerPage = 10,
    totalItems = 0
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const getVisiblePages = () => {
        const pages = []
        const maxVisiblePages = 5

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return pages
    }

    const visiblePages = getVisiblePages()

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-gray-700">
                Mostrando {startItem} a {endItem} de {totalItems} resultados
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>

                <div className="flex items-center space-x-1">
                    {visiblePages[0] > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(1)}
                                className="min-w-[40px]"
                            >
                                1
                            </Button>
                            {visiblePages[0] > 2 && (
                                <span className="px-2 text-gray-500">...</span>
                            )}
                        </>
                    )}

                    {visiblePages.map((page) => (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(page)}
                            className="min-w-[40px]"
                        >
                            {page}
                        </Button>
                    ))}

                    {visiblePages[visiblePages.length - 1] < totalPages && (
                        <>
                            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                                <span className="px-2 text-gray-500">...</span>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(totalPages)}
                                className="min-w-[40px]"
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="flex items-center gap-1"
                >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
