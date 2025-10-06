import { Plus, Pencil, Eye, EyeClosed } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import Link from "next/link";
import { apiCall } from "../CallApi";
import { IStockInterface } from "@/interfaces/stock.interface";
import moment from "moment";
import EyeButton from "@/components/EyeButton";
import DeleteButton from "@/components/DeleteButton";
import LogoutBtn from "@/components/LogoutBtn";

const Dashboard = async ({
    searchParams,
}: {
    searchParams: Promise<{ date: string, time: string }>;
}) => {
    const { date, time } = await searchParams;

    const defaultDate = moment().format("YYYY-MM-DD"); // fallback to today

    // Validate date
    const finalDate = moment(date, "YYYY-MM-DD", true).isValid()
        ? date!
        : defaultDate;

    // Validate time (only if provided)
    const finalTime =
        time && moment(time, "HH:mm", true).isValid()
            ? time
            : undefined;

    // Build query string
    const query = finalTime
        ? `/stock/get-all-stocks?date=${finalDate}&time=${finalTime}`
        : `/stock/get-all-stocks?date=${finalDate}`;

    // Call API
    const slots: IStockInterface[] = await apiCall(query);


    return (
        <div className="min-h-screen bg-[#01244a] text-white p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Winning Numbers</h1>

                <div className="flex items-center gap-3">
                    <LogoutBtn />
                    <Link href={'/admin/add'} className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300">
                        <Plus size={18} /> Add
                    </Link>
                </div>
            </div>

            {/* Date Selector */}
            <div className="flex gap-2 justify-end mb-6">
                <DatePicker pageType='admin' />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.map((slot, index) => (
                    <div
                        key={index}
                        className="bg-[#022c5a] rounded-xl shadow-md p-4 flex flex-col justify-between"
                    >
                        {/* Slot Time */}
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">{moment(slot.stockTime).format("hh:mm A")}</h2>
                            <div className="flex gap-2 items-center">
                                <EyeButton stockId={slot.id} status={slot.isPublic} />
                                {/* <Link href={`/admin/add?stockId=${slot.id}`} className="flex items-center gap-1 text-sm bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-300">
                                    <Pencil size={14} /> Edit
                                </Link> */}
                                {/* <DeleteButton stockId={slot.id} /> */}
                            </div>
                        </div>

                        {/* Numbers */}
                        <div className="grid grid-cols-5 gap-2 text-center">
                            {/* Split stockPrices string into an array and render each number */}
                            {slot.stockPrices.split(',').map((num, i) => (
                                <div
                                    key={i}
                                    className="bg-[#034078] rounded py-2 font-mono font-semibold text-sm"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
