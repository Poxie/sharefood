import '@testing-library/jest-dom'
import SendIcon from '@/assets/icons/SendIcon';
import Input from '@/components/input'
import { fireEvent, render } from '@/test-utils';

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
    it('should render a password input if type is password', () => {
        const type = 'password';
        const placeholder = 'Password';

        const { getByPlaceholderText } = render(<Input type={type} placeholder={placeholder} />);

        const input = getByPlaceholderText(placeholder);

        expect(input).toHaveAttribute('type', type);
    });
    it('should render the input with the default value', () => {
        const value = 'Hello';

        const { getByDisplayValue } = render(<Input defaultValue={value} />);

        const input = getByDisplayValue(value);

        expect(input).toBeInTheDocument();
    })
    it('should render the icon element if provided', () => {
        const { getByTestId } = render(<Input icon={<SendIcon />} />);

        const icon = getByTestId('input-icon');

        expect(icon).toBeInTheDocument();
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
    it('should render the submit icon element if provided', () => {
        const { getByTestId } = render(<Input submitIcon={<SendIcon />} />);

        const icon = getByTestId('input-submit-icon');

        expect(icon).toBeInTheDocument();
    })
    it('should call the onSubmit function when the submit icon is clicked', () => {
        const onSubmit = jest.fn();

        const text = 'Hello';
        const { getByTestId } = render(<Input submitIcon={<SendIcon />} onSubmit={onSubmit} defaultValue={text} />);

        const icon = getByTestId('input-submit-icon');

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

        const { getByTestId } = render(<Input icon={<SendIcon />} iconClassName={className} />);

        const icon = getByTestId('input-icon');

        expect(icon).toHaveClass(className);
    })
    it('should set submitIconClassName on the icon element if provided', () => {
        const className = 'text-primary';

        const { getByRole } = render(<Input submitIcon={<SendIcon />} submitIconClassName={className} />);

        const icon = getByRole('button');

        expect(icon).toHaveClass(className);
    })
})