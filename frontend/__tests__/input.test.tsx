import '@testing-library/jest-dom'
import SendIcon from '@/assets/icons/SendIcon';
import Input from '@/components/input'
import { fireEvent, render, screen, updateInput } from '@/test-utils';

describe('Input', () => {
    const renderInput = (props?: React.ComponentProps<typeof Input>) => {
        render(<Input {...props} />);
    }
    const getInput = () => screen.getByRole('textbox');

    describe('Rendering', () => {
        it('should render an input element', () => {
            renderInput();

            const input = getInput();

            expect(input).toBeInTheDocument();
        })
        it('should render the input with the correct placeholder', () => {
            const placeholder = 'Search';
    
            renderInput({ placeholder });
    
            const input = screen.getByPlaceholderText(placeholder);
    
            expect(input).toBeInTheDocument();
        })
        it('should render a password input if type is password', () => {
            const type = 'password';
            const placeholder = 'Password';
    
            renderInput({ type, placeholder });
    
            const input = screen.getByPlaceholderText(placeholder);
    
            expect(input).toHaveAttribute('type', type);
        });
        it('should render the input with the default value', () => {
            const value = 'Hello';
    
            renderInput({ defaultValue: value });
    
            const input = screen.getByDisplayValue(value);
    
            expect(input).toBeInTheDocument();
        })
        it('should render the icon element if provided', () => {
            renderInput({ icon: <SendIcon /> });
    
            const icon = screen.getByTestId('input-icon');
    
            expect(icon).toBeInTheDocument();
        })
    })
    describe('Function interaction', () => {
        it('should call the onChange function when the value changes', () => {
            const onChange = jest.fn();
    
            renderInput({ onChange });
    
            const input = getInput();
    
            const newValue = 'Hello';
            updateInput(input, newValue);
    
            expect(onChange).toHaveBeenCalledWith(newValue);
        })
        it('should call the onSubmit function when the enter key is pressed', () => {
            const onSubmit = jest.fn();
    
            const text = 'Hello';
            renderInput({ onSubmit, defaultValue: text });
    
            const input = getInput();
    
            fireEvent.keyDown(input, { key: 'Enter' });
    
            expect(onSubmit).toHaveBeenCalledWith(text);
        })
    })
    describe('set classNames correctly', () => {
        it('should set className on the input element if provided', () => {
            const className = 'text-primary';
    
            renderInput({ className });
    
            const input = getInput();
    
            expect(input).toHaveClass(className);
        })
        it('should set containerClassName on the container element if provided', () => {
            const className = 'text-primary';
    
            renderInput({ containerClassName: className });
    
            const container = screen.getByTestId('input-container');
    
            expect(container).toHaveClass(className);
        })
        it('should set iconClassName on the icon element if provided', () => {
            const className = 'text-primary';
    
            renderInput({ icon: <SendIcon />, iconClassName: className });
    
            const icon = screen.getByTestId('input-icon');
    
            expect(icon).toHaveClass(className);
        })
    })
    describe('when the button icon is provided', () => {
        const renderInputWithButton = (props?: React.ComponentProps<typeof Input>) => {
            render(
                <Input 
                    buttonIcon={<SendIcon />}
                    {...props}
                />
            )
        }

        const getIconButton = () => screen.getByRole('button');

        it('should render the button icon element if provided', () => {
            renderInputWithButton();
    
            const icon = getIconButton();
    
            expect(icon).toBeInTheDocument();
        })
        it('should render the aria label on the button icon if provided', () => {
            const ariaLabel = 'Submitty';
            renderInputWithButton({ buttonAriaLabel: ariaLabel });

            const icon = getIconButton();

            expect(icon).toHaveAttribute('aria-label', ariaLabel);
        })
        it('should call the onSubmit function when the button icon is clicked and onButtonClick is not provided', () => {
            const onSubmit = jest.fn();

            const text = 'Hello';
            renderInputWithButton({
                onSubmit,
                defaultValue: text,
            })

            const icon = getIconButton();

            fireEvent.click(icon);

            expect(onSubmit).toHaveBeenCalledWith(text);
        })
        it('should call the onButtonClick function when the button icon is clicked and onButtonClick is provided', () => {
            const onButtonClick = jest.fn();

            renderInputWithButton({ onButtonClick });

            const icon = getIconButton();

            fireEvent.click(icon);

            expect(onButtonClick).toHaveBeenCalled();
        })
        it('should set buttonIconClassName on the icon element if provided', () => {
            const className = 'text-primary';
    
            renderInputWithButton({ buttonIconClassName: className });
    
            const icon = getIconButton();
    
            expect(icon).toHaveClass(className);
        })
    })
})