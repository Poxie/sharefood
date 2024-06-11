import { useQueryClient } from "@tanstack/react-query";

export default function useRefetchQueries() {
    const queryClient = useQueryClient();

    const refetch = async (queryKey:  string[]) => {
        return queryClient.refetchQueries({
            queryKey,
        })
    }

    return refetch;
}