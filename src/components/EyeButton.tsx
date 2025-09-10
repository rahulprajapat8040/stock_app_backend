'use client'
import { Base_Url } from "@/utils/constans"
import axios from "axios"
import { Eye, EyeClosed } from "lucide-react"
import { useRouter } from "next/navigation"

const EyeButton = ({ stockId, status }: { stockId: string, status: boolean }) => {
    const router = useRouter()

    const onEyeClick = async (isPublic: boolean) => {
        try {
            const res = await axios.put(`${Base_Url}/stock/update-stock-status?stockId=${stockId}`, { isPublic: isPublic })
            if (res.data.success) {
                router.refresh()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <button
            onClick={() => onEyeClick(!status)}
            className="bg-yellow-400 px-3 rounded-md py-1 text-black">
            {status ? <Eye size={22} /> : <EyeClosed />}
        </button>

    )
}

export default EyeButton;