'use client'

import { LogOut } from "lucide-react";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
    const router = useRouter()
    const onBtnClick = () => {
        Cookies.remove("accessToken");
        router.push('/login')
    }
    return (
        <button
            onClick={onBtnClick}
            className="text-white cursor-pointer">
            <LogOut />
        </button>
    )
}

export default LogoutBtn;