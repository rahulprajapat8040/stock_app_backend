"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";

const DatePicker = ({ pageType }: { pageType: "admin" | "panel" | "results" }) => {
    const router = useRouter();

    const [day, setDay] = useState<number>(1);
    const [month, setMonth] = useState<number>(1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [hour, setHour] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);
    const [years, setYears] = useState<number[]>([]);

    useEffect(() => {
        const today = new Date();
        setDay(today.getDate());
        setMonth(today.getMonth() + 1);
        setYear(today.getFullYear());
        setHour(today.getHours());
        setMinute(today.getMinutes());

        const generatedYears = Array.from({ length: 10 }, (_, i) => today.getFullYear() - i);
        setYears(generatedYears);
    }, []);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const onSetClick = () => {
        const selectedDate = moment(`${year}-${month}-${day}`, "YYYY-M-D").format("YYYY-MM-DD");

        let path: string;
        if (pageType === "admin") {
            const selectedTime = moment(`${hour}:${minute}`, "H:m").format("HH:mm");
            path = `/admin?date=${selectedDate}&time=${selectedTime}`;
        } else if (pageType === 'panel') {
            // whole day, only date param
            path = `/?date=${selectedDate}`;
        } else {
            path = `/results-sheet?date=${selectedDate}`
        }

        router.push(path);
    };

    const onResetClick = () => {
        const selectedDate = moment(`${year}-${month}-${day}`, "YYYY-M-D").format("YYYY-MM-DD");

        let path: string;
        const selectedTime = moment(`${hour}:${minute}`, "H:m").format("HH:mm");
        path = `/admin?date=${selectedDate}`;
        router.push(path);
    }

    return (
        <div className="flex gap-2 items-center flex-wrap">
            <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="border border-gray-400 text-black bg-white px-2 rounded"
            >
                {days.map((d) => (
                    <option key={d} value={d}>
                        {d.toString().padStart(2, "0")}
                    </option>
                ))}
            </select>

            <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border border-gray-400 text-black bg-white px-2 rounded"
            >
                {months.map((m) => (
                    <option key={m} value={m}>
                        {m.toString().padStart(2, "0")}
                    </option>
                ))}
            </select>

            <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border border-gray-400 text-black bg-white px-2 rounded"
            >
                {years.map((y) => (
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>
            {/* Only show time pickers for admin */}
            {pageType === "admin" && (
                <>
                    <select
                        value={hour}
                        onChange={(e) => setHour(Number(e.target.value))}
                        className="border border-gray-400 text-black bg-white px-2 rounded"
                    >
                        {hours.map((h) => (
                            <option key={h} value={h}>
                                {h.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                    <select
                        value={minute}
                        onChange={(e) => setMinute(Number(e.target.value))}
                        className="border border-gray-400 text-black bg-white px-2 rounded"
                    >
                        {minutes.map((m) => (
                            <option key={m} value={m}>
                                {m.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                </>
            )}
            {
                pageType == 'admin' &&
                <button
                    onClick={onResetClick}
                    className="bg-white border text-black border-gray-500 rounded px-3 text-sm"
                >
                    Reset
                </button>
            }
            <button
                onClick={onSetClick}
                className="bg-white border text-black border-gray-500 rounded px-3 text-sm"
            >
                Set
            </button>
        </div>
    );
};

export default DatePicker;
