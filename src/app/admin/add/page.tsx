// page.tsx (Server Component)
import { Suspense } from "react";
import AddForm from "./AddForm";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddForm />
        </Suspense>
    );
}
