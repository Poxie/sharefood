import { createUser } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export default function useCreateUser() {
    const { isSuccess, isPending, isError, data, mutate } = useMutation({
        mutationFn: createUser,
    })

    return { isSuccess, isPending, isError, data, createUser: mutate };
}