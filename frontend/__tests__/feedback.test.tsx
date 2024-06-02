import '@testing-library/jest-dom'
import Feedback from '@/components/feedback'
import { render } from '@testing-library/react'

describe('Feedback', () => {
    it('should render the feedback message', () => {
        const message = 'feedback message';
        const { getByText } = render(<Feedback message={message} type="success" />);

        const feedback = getByText(message);

        expect(feedback).toBeInTheDocument();
    })
})