import { QueryWrapper } from '@/test-utils';
import useRefetchQueries from "@/hooks/react-query/useRefetchQueries"
import { renderHook } from "@testing-library/react";
import reactQuery, { QueryClient } from '@tanstack/react-query';

describe('useRefetchQueries', () => {
    it('should return a refetch function', () => {
        const { result } = renderHook(useRefetchQueries, { wrapper: QueryWrapper });

        expect(result.current).toBeInstanceOf(Function);
    })
    it('should call react query refetchQueries with the provided query keys', () => {
        const queryKey = ['testkey', 'testkey1'];

        const queryClient = new QueryClient();
        const spy = jest.spyOn(queryClient, 'refetchQueries');
        
        const { result } = renderHook(useRefetchQueries, {
            wrapper: ({ children }) => (
                <QueryWrapper defaultClient={queryClient}>{children}</QueryWrapper>
            ),
        });

        result.current(queryKey);
    
        expect(spy).toHaveBeenCalledWith({ queryKey });
    })
})