'use client'
import { Base_Url } from "@/utils/constans"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"

const DeleteButton = ({ stockId }: { stockId: string }) => {
    const router = useRouter()

    const onDelteClick = async () => {
        try {
            const res = await axios.delete(`${Base_Url}/stock/delete-stock?stockId=${stockId}`)
            if (res.data.success) {
                router.refresh()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <button
            onClick={() => onDelteClick()}
            className="bg-yellow-400 px-3 rounded-md py-1 text-black">
            {<Trash />}
        </button>

    )
}

export default DeleteButton;