import { createUser } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export default function useCreateUser() {
    return useMutation({
        mutationFn: createUser,
    })
}