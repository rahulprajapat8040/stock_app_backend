import DatePicker from "@/components/DatePicker"
import { IStockInterface } from "@/interfaces/stock.interface";
import moment from 'moment';
import { apiCall } from "./CallApi";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const { date, time } = await searchParams;

  const now = moment(); // current time
  const defaultDate = now.format("YYYY-MM-DD"); // fallback date

  // Validate date or fallback to today
  const finalDate = moment(date, "YYYY-MM-DD", true).isValid()
    ? date!
    : defaultDate;

  // --- Slot rounding logic ---
  const nowIst = moment().utcOffset("+05:30");

  function getRoundedTime(current: moment.Moment): string {
    const hour = current.hour();
    const minute = current.minute();

    if (hour < 9) {
      return "09:00";
    } else if (hour >= 9 && hour < 15) {
      const roundedMinute = Math.floor(minute / 15) * 15;
      return moment({ hour, minute: roundedMinute }).format("HH:mm");
    } else if (hour >= 15 && hour <= 21) {
      const roundedMinute = Math.floor(minute / 20) * 20;
      return moment({ hour, minute: roundedMinute }).format("HH:mm");
    } else {
      return "21:20";
    }
  }
  // Validate time, otherwise use rounded current slot
  const finalTime = time && moment(time, "HH:mm", true).isValid()
    ? time
    : getRoundedTime(now);

  // Build API query
  const query = `/stock/get-stock-till-now?date=${finalDate}&time=${finalTime}`;
  console.log(query)
  // Fetch slots
  const slots: IStockInterface[] = await apiCall(query);

  // List of dry days (MM-DD format)
  const dryDays = ["01-26", "08-15", "10-02"];
  const selectedDate = date ? moment(date, "YYYY-MM-DD") : moment();
  const isDryDay = dryDays.includes(selectedDate.format("MM-DD"));

  return (
    <div className="min-h-screen bg-[#00244a] text-white flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto">

        {/* Custom Date Selector */}
        <div className="flex gap-1 mt-10 translate-y-5 items-center justify-center scale-50 sm:scale-60 md:scale-75 lg:scale-90 xl:scale-100 origin-top-left w-[200%] sm:w-[167%] md:w-[133%] lg:w-[111%] xl:w-full">
          <span className="text-lg font-semibold ms-1 text-[#f2e70f]">Select Date:</span>
          <DatePicker pageType="panel" />
        </div>

        {/* Date Display */}
        <div className="flex text-xs ms-5 mt-2 sm:mt-7 sm:text-lg justify-center gap-1">
          <span>Result of Date :</span>
          <span className="text-[#f2e70f] text-[10px] sm:text-lg mt-px">
            {selectedDate.format("DD.MM.YYYY")}
          </span>
        </div>

        <div className="overflow px-1">

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
            // Results Table
            <div className="ps-2 scale-[0.49] sm:scale-60 md:scale-75 lg:scale-90 xl:scale-100 origin-left w-[200%] sm:w-[167%] md:w-[133%] lg:w-[111%] xl:w-full">
              <div className="flex justify-between">
                <div>
                  <Link href={'/'} className="text inline-block px-2 font-bold text-[#f2e70f]">Home</Link>
                </div>
                <Link href={'/results-sheet'} className="flex justify-end text-[#f2e70f] font-bold">Results Sheet</Link>
              </div>
              <table className="w-full text-[1.7rem] font-extrabold border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-[#01244a]">
                    <th className="border-2 text-lg border-gray-400 px-2 font-bold whitespace-nowrap w-32" style={{ borderWidth: '3px', borderColor: '#9ca3af', borderStyle: 'solid' }}>Draw Time</th>
                    <th className="border-2 text-lg border-gray-400 px-2 font-bold" style={{ borderWidth: '3px', borderColor: '#9ca3af', borderStyle: 'solid' }}>Winning Numbers</th>
                  </tr>
                </thead>
                <tbody className="bg-[#01244a]">
                  {slots.map((item) => (
                    <tr key={item.id}>
                      <td className="border-2 border-gray-400 px-2 whitespace-nowrap text-center" style={{ borderWidth: '3px', borderColor: '#9ca3af', borderStyle: 'solid' }}>
                        {moment(item.stockTime).format("hh:mm A")}
                      </td>
                      <td className="border-2 font-extrabold border-gray-400 px-2" style={{ borderWidth: '3px', borderColor: '#9ca3af', borderStyle: 'solid' }}>
                        {item.stockPrices}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // No Result Fallback
            <div className="flex items-center justify-center mt-10 px-2">
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
