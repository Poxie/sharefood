import Button from '@/components/button'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@/test-utils'
 
describe('Button', () => {
    const renderButton = (props?: React.ComponentProps<typeof Button>) => {
        render(<Button {...props}>{props?.children || 'Button text'}</Button>)
    }

    const getButton = () => screen.getByRole('button');

    it('renders a button with the correct text', () => {
        const text = 'Specific button text';
        renderButton({ children: text });
    
        const button = getButton();
    
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent(text);
    })
    it('calls the onClick function when clicked', () => {
        const onClick = jest.fn();

        renderButton({ onClick });
    
        const button = getButton();
        fireEvent.click(button);
    
        expect(onClick).toHaveBeenCalledTimes(1);
    })
    it('should have the primary button classes by default', () => {
        renderButton();
    
        const button = getButton();
    
        expect(button).toHaveClass('text-light');
        expect(button).toHaveClass('bg-c-primary');
        expect(button).toHaveClass('hover:bg-c-accent');
    })
    it('should have the transparent button classes when type is transparent', () => {
        renderButton({ type: 'transparent' });
    
        const button = getButton()
    
        expect(button).toHaveClass('hover:bg-secondary');
    })
    it('should have the hollow button classes when type is hollow', () => {
        renderButton({ type: 'hollow' });
    
        const button = getButton();
    
        expect(button).toHaveClass('border-[1px]');
        expect(button).toHaveClass('border-text-muted');
        expect(button).toHaveClass('hover:bg-tertiary');
    })
    it('should be an anchor tag if href is provided', () => {
        const href = 'https://example.com';
        renderButton({ href });
    
        const button = screen.getByRole('link');
    
        expect(button).toHaveAttribute('href', href);
    })
    it('should be disabled if disabled is true', () => {
        renderButton({ disabled: true });
    
        const button = getButton();
    
        expect(button).toBeDisabled();
    })
})