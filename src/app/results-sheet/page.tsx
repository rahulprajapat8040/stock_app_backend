import DatePicker from "@/components/DatePicker"
import { IStockInterface } from "@/interfaces/stock.interface";
import moment from 'moment';
import Link from "next/link";
import { apiCall } from "../CallApi";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "PlayGoldWin Result Sheet | Latest Winning Numbers & Draw History",
    description: "View the official PlayGoldWin result sheet with today's winning numbers, past draw history, and dry day updates. Fast and accurate results.",
    abstract: "Daily updated PlayGoldWin lottery results with draw timings, winning numbers, and dry day alerts.",
    keywords: [
        "PlayGoldWin",
        "Play Gold Win Result Sheet",
        "PlayGoldWin result sheet",
        "lottery result sheet",
        "PlayGoldWin winning numbers",
        "PlayGoldWin draw history",
        "PlayGoldWin today result",
        "PlayGoldWin dry day",
        "PlayGoldWin past results"
    ],
    robots: { index: true, follow: true },
    openGraph: {
        title: "PlayGoldWin Result Sheet",
        type: "website",
        locale: 'en_IN',
        siteName: 'PlayGoldWin',
        url: "https://playgolddwin.com/results-sheet",
        description: "Check PlayGoldWin result sheet for winning numbers, draw history, and dry day updates.",
    },
    twitter: {
        card: "summary_large_image",
        site: "@playgoldwin",
        creator: "@playgoldwin",
        description: "Check PlayGoldWin result sheet for winning numbers, draw history, and dry day updates.",
    }
}

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ date: string }>;
}) {
    const { date } = await searchParams;

    const today = moment().utcOffset(330).format("YYYY-MM-DD");
    // ✅ Decide time based on whether the date is today
    let finalDate: string | null = null;
    console.log('is today', today)
    console.log('date is', date)
    if (moment(date, "YYYY-MM-DD", true).isValid()) {
        if (date === today) {
            // If today → use current time
            finalDate = moment(`${date} ${moment().format("HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss")
                .utc()
                .add(5, "hours")
                .add(30, "minutes")
                .toISOString();
        } else {
            // If not today → use fixed 09:40
            finalDate = moment(`${date} 16:10:00`, "YYYY-MM-DD HH:mm:ss")
                .utc()
                .add(5, "hours")
                .add(30, "minutes")
                .toISOString();
        }
    }

    // List of dry days (MM-DD format for comparison)
    const dryDays = ["01-26", "08-15", "10-02"];
    const selectedDate = date ? moment(date, "YYYY-MM-DD") : moment();

    // Check if the selected date is a dry day
    const isDryDay = dryDays.includes(selectedDate.format("MM-DD"));

    // Fetch slots only if not a dry day
    let slots: IStockInterface[] = [];
    if (!isDryDay && finalDate) {
        slots = await apiCall(`/stock/get-stock-till-now?date=${finalDate}`);
    }
    return (
        <div className="min-h-screen bg-[#00244a] text-white flex flex-col items-center">
            <div className="w-full max-w-7xl mx-auto">

                {/* Custom Date Selector */}
                <div className="flex gap-1  mt-10 translate-y-5  items-center justify-center scale-50 sm:scale-60 md:scale-75 lg:scale-90 xl:scale-100 origin-top-left w-[200%] sm:w-[167%] md:w-[133%] lg:w-[111%] xl:w-full">
                    <span className="text-lg font-semibold ms-1 text-[#f2e70f]">Select Date:</span>
                    <DatePicker pageType="results" />
                </div>

                {/* Date Display */}
                <h1 className="flex text-xs ms-10 mt-2 sm:mt-7 sm:text-lg justify-center gap-1">
                    <span>Result of Date :</span>
                    <span className="text-[#f2e70f] text-[10px] sm:text-lg mt-px">
                        {selectedDate.format("DD.MM.YYYY")}
                    </span>
                </h1>

                <div className="w-full flex justify-between px-2">
                    <div>
                        <Link href={'/'} className="text inline-block text-xs  font-bold text-[#f2e70f]">Home</Link>
                    </div>
                </div>
                <div className="overflow  px-1">
                    {isDryDay ? (
                        // Dry Day Message
                        <div className="flex items-center justify-center mt-10 px-2">
                            <div className="max-w-sm w-full p-4 bg-white">
                                <div className="h-36 bg-red-700 flex items-center justify-center w-full">
                                    <h1 className="text-4xl font-bold text-white">DRY DAY</h1>
                                </div>
                            </div>
                        </div>
                    ) : slots.length > 0 ? (
                        <div className="w-full px-1 sm:px-4">

                            <div className="w-full">
                                <table className="table-fixed pb-3 w-full font-bold border border-gray-400 text-[clamp(9px,1.8vw,14px)]">
                                    <thead>
                                        <tr className="bg-[#01244a] text-center">
                                            <th className="border border-gray-400  w-14">
                                                Draw Time
                                            </th>
                                            <th className="border border-gray-400 px-1 text-center">
                                                Winning Numbers
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[#01244a]">
                                        {slots.map((item) => (
                                            <tr key={item.id} className="border text-center">
                                                <td className="border font-extrabold text-[11.5px] border-gray-400 ">
                                                    {moment(item.stockTime).format("hh:mm A")}
                                                </td>
                                                <td
                                                    className="
    border border-gray-400 px-1 text-left
    text-[2.9vw]                        /* base for very small screens */
    [@media(min-width:345px)]:text-[3.1vw]   /* >=345px */
    [@media(min-width:385px)]:text-[3.2vw]   /* >=385px */
    [@media(min-width:435px)]:text-[3.2vw]   /* >=435px */
    [@media(min-width:450px)]:text-[3.2vw]   /* >=450px */
    [@media(min-width:480px)]:text-[3.2vw]   /* >=480px */
    sm:text-[3.2vw]                     /* >=640px */
    md:text-[14px]                     /* >=768px */
  "
                                                >

                                                    {item.stockPrices}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    ) : (
                        // No Result Fallback
                        <div className="flex items-center justify-center px-2">
                            <div className="max-w-sm w-full p-4 bg-white">
                                <div className="h-36 bg-red-800 flex items-center justify-center w-full">
                                    <h1 className="text-6xl fontBold">RESULTS</h1>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
