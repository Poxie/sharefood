import { loginUser } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export default function useLoginUser() {
    return useMutation({
        mutationFn: ({ username, password }: {
            username: string;
            password: string;
        }) => loginUser({ username, password }),
        retry: false,
    })
}