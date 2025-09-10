"use client";

import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { Base_Url } from "@/utils/constans";
import { useSearchParams, useRouter } from "next/navigation";

const AddForm = () => {
    const prefixes = ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69"];
    const [inputs, setInputs] = useState<string[]>(Array(prefixes.length).fill(""));
    const [slots, setSlots] = useState<string[]>([]);
    const [stockTime, setStockTime] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const stockId = searchParams.get("stockId");

    useEffect(() => {
        generateSlots();

        // if creating new stock → fill with dummy random numbers
        if (!stockId) {
            const randomNumbers = prefixes.map(() =>
                String(Math.floor(Math.random() * 100)).padStart(2, "0")
            );
            setInputs(randomNumbers);
        }
    }, []);

    const generateSlots = () => {
        const now = moment();

        const startMorning = moment().hour(9).minute(0).second(0);
        const endAfternoon = moment().hour(15).minute(0).second(0);
        const endEvening = moment().hour(21).minute(0).second(0);

        let slotStart;
        const baseDate = now.isAfter(endEvening) ? moment().add(1, "day") : moment();

        if (now.isBefore(startMorning)) {
            slotStart = baseDate.clone().hour(9).minute(0).second(0);
        } else if (now.isAfter(endEvening)) {
            slotStart = baseDate.clone().hour(9).minute(0).second(0);
        } else if (now.isBefore(endAfternoon)) {
            slotStart = baseDate.clone().hour(now.hour()).minute(now.minute()).second(0);
            slotStart.add(15 - (slotStart.minute() % 15 || 15), "minutes").startOf("minute");
        } else {
            slotStart = baseDate.clone().hour(now.hour()).minute(now.minute()).second(0);
            slotStart.add(20 - (slotStart.minute() % 20 || 20), "minutes").startOf("minute");
        }

        const slotsArr: string[] = [];
        let temp = slotStart.clone();
        // ✅ extend end of day to 21:20 instead of 21:00
        const endOfDay = baseDate.clone().hour(21).minute(20).second(0);

        while (temp.isSameOrBefore(endOfDay)) {
            let gap = temp.isBefore(baseDate.clone().hour(15)) ? 15 : 20;
            slotsArr.push(temp.format("YYYY-MM-DD HH:mm:ss"));
            temp.add(gap, "minutes");
        }

        setSlots(slotsArr);
    };

    const fetchStock = async () => {
        try {
            const res = await axios.get(`${Base_Url}/stock/get-stock-by-id?stockId=${stockId}`);
            if (res.data.success && res.data.data) {
                const stock = res.data.data;
                setStockTime(stock.stockTime);
                const prices: string[] = stock.stockPrices.split(",");
                const formattedInputs = prices.map((p) => p.slice(-2));
                setInputs(formattedInputs);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        stockId && fetchStock();
    }, [stockId]);

    const handleChange = (index: number, value: string) => {
        if (/^\d{0,2}$/.test(value)) {
            const updated = [...inputs];
            updated[index] = value;
            setInputs(updated);
        }
    };

    const handleSubmit = async () => {
        const finalNumbers = inputs.map((val, i) => `${prefixes[i]}${val.padStart(2, "0")}`);
        const res = stockId
            ? await axios.put(`${Base_Url}/stock/update-stock?stockId=${stockId}`, {
                stockPrices: finalNumbers.join(","),
            })
            : await axios.post(`${Base_Url}/stock/create-new-stock`, {
                stockTime: slots[0],
                stockPrices: finalNumbers.join(","),
            });

        if (res.data.success) {
            router.push("/admin");
        }
    };

    // 🟡 Auto Generate for all slots of the day
    const handleAutoGenerate = async () => {
        const baseDate = moment(); // today's date
        const startMorning = baseDate.clone().hour(9).minute(0).second(0);
        const endAfternoon = baseDate.clone().hour(15).minute(0).second(0);
        const endOfDay = baseDate.clone().hour(21).minute(20).second(0);

        const slotsArr: string[] = [];
        let temp = startMorning.clone();

        while (temp.isSameOrBefore(endOfDay)) {
            let gap = temp.isBefore(endAfternoon) ? 15 : 20; // ✅ switch gap after 3PM
            slotsArr.push(temp.format("YYYY-MM-DD HH:mm:ss"));
            temp.add(gap, "minutes");
        }

        // now generate payload for ALL slots of the day
        const payload = slotsArr.map((slot) => {
            const randomNumbers = prefixes.map(() =>
                String(Math.floor(Math.random() * 100)).padStart(2, "0")
            );
            const finalNumbers = randomNumbers.map((val, idx) => `${prefixes[idx]}${val}`);

            return {
                stockTime: slot,
                stockPrices: finalNumbers.join(","),
            };
        });

        try {
            const res = await axios.post(`${Base_Url}/stock/create-bulk`, { stocks: payload });
            if (res.data.success) {
                router.push("/admin");
            }
        } catch (error) {
            console.log("Error creating bulk stocks", error);
        }
    };


    return (
        <div className="min-h-screen bg-[#01244a] text-white flex flex-col items-center p-6">
            <h1 className="text-xl font-bold mb-6">Enter Winning Numbers</h1>

            <p className="mb-4">
                Current Slot:{" "}
                <span className="font-semibold">
                    {moment(stockTime || slots[0]).format("hh:mm A") || "--"}
                </span>
            </p>

            <div className="overflow-x-auto">
                <table className="border-collapse border border-gray-400 text-sm">
                    <thead>
                        <tr className="bg-[#022c5a]">
                            <th className="border border-gray-400 px-3 py-2">Prefix</th>
                            <th className="border border-gray-400 px-3 py-2">Last 2 Digits</th>
                            <th className="border border-gray-400 px-3 py-2">Final Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prefixes.map((prefix, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 px-3 py-2 text-center font-semibold">
                                    {prefix}
                                </td>
                                <td className="border border-gray-400 px-3 py-2 text-center">
                                    <input
                                        type="text"
                                        value={inputs[index]}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        className="w-16 text-center border border-gray-500 text-white rounded"
                                        placeholder="__"
                                    />
                                </td>
                                <td className="border border-gray-400 px-3 py-2 text-center">
                                    {inputs[index]
                                        ? `${prefix}${inputs[index].padStart(2, "0")}`
                                        : "--"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleSubmit}
                    className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-300"
                >
                    Save Numbers
                </button>
                <button
                    onClick={handleAutoGenerate}
                    className="bg-green-400 text-black font-semibold px-6 py-2 rounded hover:bg-green-300"
                >
                    Auto Generate
                </button>
            </div>
        </div>
    );
};

export default AddForm;
