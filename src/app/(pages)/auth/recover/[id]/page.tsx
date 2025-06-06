import SetNewPassword from "@/components/auth/recover/PasswordRecover";
import { FC } from "react";

interface PageProps {
    params: {
        id: string;
    };
}

const Page: FC<PageProps> = async ({ params }) => {
    const { id } = await params;  

    return (
        <div>
            <SetNewPassword userId={id} />
        </div>
    );
};

export default Page;