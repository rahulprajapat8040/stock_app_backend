import DatePicker from "@/components/DatePicker"
import { IStockInterface } from "@/interfaces/stock.interface";
import moment from 'moment';
import { apiCall } from "./CallApi";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const { date } = await searchParams;

  // build final datetime with current time
  const finalDate = moment(date, "YYYY-MM-DD", true).isValid()
    ? moment(`${date} ${moment().format("HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss") // Append current time
      .utc() // Convert to UTC
      .add(5, 'hours') // Convert to IST by adding 5 hours
      .add(30, 'minutes') // IST is UTC + 5:30
      .toISOString() // Convert to ISO string in IST
    : null;
  // List of dry days (MM-DD format for comparison)
  const dryDays = ["01-26", "08-15", "10-02"];
  const selectedDate = date ? moment(date, "YYYY-MM-DD") : moment();

  // Check if the selected date is a dry day
  const isDryDay = dryDays.includes(selectedDate.format("MM-DD"));

  // Fetch slots only if not a dry day
  console.log(finalDate)
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
          <Link href={'/'} className="text-[12px] translate-y-10 inline-block px-2 font-bold text-[#f2e70f]">Home</Link>

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
