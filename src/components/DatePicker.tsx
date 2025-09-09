"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";

const DatePicker = ({ pageType }: { pageType: "admin" | "panel" }) => {
    const router = useRouter();

    const [day, setDay] = useState<number>(1);
    const [month, setMonth] = useState<number>(1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [years, setYears] = useState<number[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const today = new Date();
        setDay(today.getDate());
        setMonth(today.getMonth() + 1);
        setYear(today.getFullYear());

        const generatedYears = Array.from({ length: 10 }, (_, i) => today.getFullYear() - i);
        setYears(generatedYears);

        setMounted(true);
    }, []);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const onSetClick = () => {
        const selectedDate = moment(`${year}-${month}-${day}`, "YYYY-M-D").format("YYYY-MM-DD");
        const path = pageType === "admin" ? `/admin?date=${selectedDate}` : `/?date=${selectedDate}`;
        router.push(path);
    };

    return (
        <div className="flex gap-2 items-center">
            <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="border border-gray-400 text-black bg-white px- rounded"
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
                className="border border-gray-400 text-black bg-white px- rounded"
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
                className="border border-gray-400 text-black bg-white px- rounded"
            >
                {years.map((y) => (
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>

            <button onClick={onSetClick} className="bg-white text-black px-3 text-sm">
                Set
            </button>
        </div>
    );
};

export default DatePicker;
