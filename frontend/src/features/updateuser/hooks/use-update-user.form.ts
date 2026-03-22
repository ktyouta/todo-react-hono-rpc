import { LoginUserType } from "@/app/api/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpdateUserRequestSchema, UpdateUserRequestType } from "../types/update-user-request-type";

type PropsType = {
    loginUser: LoginUserType | null;
}

export function useUpdateUserForm({ loginUser }: PropsType) {

    return useForm<UpdateUserRequestType>({
        resolver: zodResolver(UpdateUserRequestSchema),
        defaultValues: {
            name: loginUser?.name ?? ``,
            birthday: {
                year: loginUser?.birthday.slice(0, 4) ?? ``,
                month: loginUser?.birthday.slice(4, 6) ?? ``,
                day: loginUser?.birthday.slice(6, 8) ?? ``,
            },
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}