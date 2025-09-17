import DatePicker from "@/components/DatePicker"
import { IStockInterface } from "@/interfaces/stock.interface";
import moment from 'moment';
import { apiCall } from "./CallApi";
import Link from "next/link";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "PlayGoldWin – Latest Lottery Results",
  description: "Playgoldwin is your trusted source for the latest Playgoldwin lottery results.",
  keywords: ["PlayGoldWin", "lottery results", "daily draw", "winning numbers"],
  abstract: "PlayGoldWin provides accurate daily lottery results and draw timings.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "playgoldwin",
    type: "website",
    url: "https://playgolddwin.com",
    description: "Playgoldwin is your trusted source for the latest Playgoldwin lottery results.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@playgoldwin",
    creator: "@playgoldwin",
    description: "Playgoldwin is your trusted source for the latest Playgoldwin lottery results.",
  },
}

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

  function getRoundedTime(current: moment.Moment): string {
    const hour = current.hour();
    const minute = current.minute();

    if (hour < 9) {
      return "09:00";
    } else if (hour >= 9 && hour < 15) {
      const roundedMinute = Math.floor(minute / 15) * 15;
      return current.clone().minute(roundedMinute).format("HH:mm");
    } else if (hour >= 15 && hour <= 21) {
      const roundedMinute = Math.floor(minute / 20) * 20;
      const candidate = current.clone().minute(roundedMinute).format("HH:mm");

      // Cap at 21:20 max
      if (current.isAfter(moment(current).hour(21).minute(20))) {
        return "21:20";
      }

      return candidate;
    } else {
      return "21:20"; // After 9:20pm, always return 21:20
    }
  }

  const nowIst = moment().utcOffset("+05:30");

  const finalTime = time && moment(time, "HH:mm", true).isValid()
    ? time
    : getRoundedTime(nowIst);


  // Build API query
  const query = `/stock/get-stock-till-now?date=${finalDate}&time=${finalTime}`;
  // Fetch slots
  const slots: IStockInterface[] = await apiCall(query);

  // List of dry days (MM-DD format)
  const dryDays = ["01-26", "08-15", "10-02"];
  const selectedDate = date ? moment(date, "YYYY-MM-DD") : moment();
  const isDryDay = dryDays.includes(selectedDate.format("MM-DD"));

  return (
    <div className="min-h-screen bg-[#00244a] text-white flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto">

        <div className="overflow px-1">
          {/* Custom Date Selector */}
          <div className="flex gap-1 mt-10 translate-y-5 items-center justify-center scale-50 sm:scale-60 md:scale-75 lg:scale-90 xl:scale-100 origin-top-left w-[200%] sm:w-[167%] md:w-[133%] lg:w-[111%] xl:w-full">
            <span className="text-lg font-semibold ms-1 text-[#f2e70f]">Select Date:</span>
            <DatePicker pageType="panel" />
          </div>

          {/* Date Display */}
          <h1 className="flex text-xs ms-10 mt-2 sm:mt-7 sm:text-lg justify-center gap-1">
            <span style={{ position: "absolute", left: "-9999px" }}>PlayGoldWin Lottery Results</span>
            <span>Result of Date :</span>
            <span className="text-[#f2e70f] text-[10px] sm:text-lg mt-px">
              {selectedDate.format("DD.MM.YYYY")}
            </span>
          </h1>
          <p style={{ position: "absolute", left: "-9999px" }}>
            PlayGoldWin provides daily lottery results with accurate timing and easy access. Select your date to view the latest draw outcomes. Fast, simple, and reliable.
          </p>
          <div style={{ position: "absolute", left: "-9999px" }} className="text-center mt-4">
            <Link href="/about" className="text-xs text-[#f2e70f] mx-2">About</Link>
            <Link href="/results-sheet" className="text-xs text-[#f2e70f] mx-2">Results Sheet</Link>
          </div>

          {isDryDay ? (
            // Dry Day Message
            <div className="flex items-center justify-center mt-10 px-2">
              <div className="max-w-sm w-full p-4 bg-white">
                <div className="h-36 bg-red-700 flex items-center justify-center w-full">
                  <h1 className="text-4xl font-bold text-white">DRY DAY</h1>
                </div>
              </div>
            </div>
          ) : (
            // Results Table
            <div className="w-full px-1 sm:px-4">
              <div className="w-full flex justify-between">
                <div>
                  <Link href={'/'} className="text inline-block text-xs  font-bold text-[#f2e70f]">Home</Link>
                </div>
                <div>
                  <Link href={'/results-sheet'} className=" inline-block text-xs justify-end text-[#f2e70f] font-bold">Results Sheet</Link>
                </div>
              </div>
              {
                slots.length > 0 ? (
                  <table className="table-fixed w-full font-bold border border-gray-400 text-[clamp(9px,1.8vw,14px)]">
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
                ) : <div className="flex items-center justify-center">
                  <div className="w-full p-4 bg-white">
                    <div className="h-36 bg-red-800 flex items-center justify-center w-full">
                      <h1 className="text-[3.5rem] fontBold">RESULTS</h1>
                    </div>
                  </div>
                </div>
              }
            </div>
          )}
        </div>
      </div>
      <p style={{ position: "absolute", left: "-9999px" }}>
        Welcome to PlayGoldWin, your trusted destination for accurate and timely lottery results. Whether you're checking today's draw or reviewing past outcomes, PlayGoldWin ensures you have access to the most up-to-date information. Our platform is designed to be fast, reliable, and easy to use—so you can focus on what matters most: your numbers and your chances.

        Each day, we publish verified results from multiple draws, helping users stay informed and confident. Our intuitive interface allows you to select the date and time of interest, view winning numbers, and explore historical data. We understand how important transparency is, which is why PlayGoldWin is committed to delivering results with precision and clarity.

        In addition to results, we offer insights into draw timings, dry days, and slot patterns to help you plan ahead. Whether you're a casual player or a regular participant, PlayGoldWin is here to support your journey with dependable updates and a user-friendly experience.

        Explore our Results Sheet, learn more about our platform, and stay connected for future enhancements. With PlayGoldWin, you're not just checking numbers—you're part of a growing community that values fairness, speed, and simplicity.
      </p>
    </div >
  );
}
