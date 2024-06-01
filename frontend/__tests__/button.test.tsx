import Button from '@/components/button'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
 
describe('Button', () => {
    it('renders a button with the correct text', () => {
        const text = 'Button text';
        render(<Button>{text}</Button>)
    
        const button = screen.getByRole('button');
    
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent(text);
    })
    it('calls the onClick function when clicked', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Button text</Button>)
    
        const button = screen.getByRole('button');
        button.click();
    
        expect(onClick).toHaveBeenCalledTimes(1);
    })
    it('should have the primary button classes by default', () => {
        render(<Button>Button text</Button>)
    
        const button = screen.getByRole('button');
    
        expect(button).toHaveClass('text-light');
        expect(button).toHaveClass('bg-c-primary');
        expect(button).toHaveClass('hover:bg-c-accent');
    })
    it('should have the transparent button classes when type is transparent', () => {
        render(<Button type="transparent">Button text</Button>)
    
        const button = screen.getByRole('button');
    
        expect(button).toHaveClass('hover:bg-secondary');
    })
    it('should be an anchor tag if href is provided', () => {
        render(<Button href="https://example.com">Button text</Button>)
    
        const button = screen.getByRole('link');
    
        expect(button).toHaveAttribute('href', 'https://example.com');
    })
})