import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserCreateRequestSchema, UserCreateRequestType } from "../types/user-create-request-type";

export function useUserCreateForm() {
    return useForm<UserCreateRequestType>({
        resolver: zodResolver(UserCreateRequestSchema),
        defaultValues: {
            name: "",
            birthday: { year: "", month: "", day: "" },
            password: "",
            confirmPassword: "",
            roleId: 1,
        },
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
}
