
type HeaderProps = {
    title: string;
    description: string;
}

export function Header({ title, description }: HeaderProps) {
    return (
        <div className="flex items-center w-full h-[92px] border-b px-12">
            <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                <span className="text-sm">{description}</span>
            </div>
        </div>
    )
}