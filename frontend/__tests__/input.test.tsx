import SendIcon from '@/assets/icons/SendIcon';
import Input from '@/components/input'
import { fireEvent, getByTestId, render } from '@/test-utils';
import '@testing-library/jest-dom'

describe('Input', () => {
    it('should render an input element', () => {
        const { getByRole } =  render(<Input />);
        const input = getByRole('textbox');
        expect(input).toBeInTheDocument();
    })
    it('should render the input with the correct placeholder', () => {
        const placeholder = 'Search';

        const { getByPlaceholderText } = render(<Input placeholder={placeholder} />);

        const input = getByPlaceholderText(placeholder);

        expect(input).toBeInTheDocument();
    })
    it('should render the input with the default value', () => {
        const value = 'Hello';

        const { getByDisplayValue } = render(<Input defaultValue={value} />);

        const input = getByDisplayValue(value);

        expect(input).toBeInTheDocument();
    })
    it('should call the onChange function when the value changes', () => {
        const onChange = jest.fn();

        const { getByRole } = render(<Input onChange={onChange} />);

        const input = getByRole('textbox');

        const newValue = 'Hello';
        fireEvent.change(input, { target: { value: newValue } });

        expect(onChange).toHaveBeenCalledWith(newValue);
    })
    it('should call the onSubmit function when the enter key is pressed', () => {
        const onSubmit = jest.fn();

        const text = 'Hello';
        const { getByRole } = render(<Input onSubmit={onSubmit} defaultValue={text} />);

        const input = getByRole('textbox');

        fireEvent.keyDown(input, { key: 'Enter' });

        expect(onSubmit).toHaveBeenCalledWith(text);
    })
    it('should render the icon element if provided', () => {
        const { getByRole } = render(<Input icon={<SendIcon />} />);

        const icon = getByRole('button');

        expect(icon).toBeInTheDocument();
    })
    it('should call the onSubmit function when the icon is clicked', () => {
        const onSubmit = jest.fn();

        const text = 'Hello';
        const { getByRole } = render(<Input icon={<SendIcon />} onSubmit={onSubmit} defaultValue={text} />);

        const icon = getByRole('button');

        fireEvent.click(icon);

        expect(onSubmit).toHaveBeenCalledWith(text);
    })
    it('should set className on the input element if provided', () => {
        const className = 'text-primary';

        const { getByRole } = render(<Input className={className} />);

        const input = getByRole('textbox');

        expect(input).toHaveClass(className);
    })
    it('should set containerClassName on the container element if provided', () => {
        const className = 'text-primary';

        const { getByTestId } = render(<Input containerClassName={className} />);

        const container = getByTestId('input-container');

        expect(container).toHaveClass(className);
    })
    it('should set iconClassName on the icon element if provided', () => {
        const className = 'text-primary';

        const { getByRole } = render(<Input icon={<SendIcon />} iconClassName={className} />);

        const icon = getByRole('button');

        expect(icon).toHaveClass(className);
    })
})