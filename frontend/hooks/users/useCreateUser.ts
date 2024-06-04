import { createUser } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export default function useCreateUser() {
    const { isSuccess, isPending, isError, error, data, mutate } = useMutation({
        mutationFn: createUser,
    })

    return { isSuccess, isPending, isError, error, data, createUser: mutate };
}