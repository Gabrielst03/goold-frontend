import { ScheduleHeader } from "./ScheduleHeader";
import { ScheduleTable } from "./ScheduleTable";



export function Schedule() {
    return (
        <div className="flex flex-col w-full h-full border rounded-lg px-4 py-6">
            <ScheduleHeader />
            <ScheduleTable />
        </div>
    )
}