import { twMerge } from "tailwind-merge";

export type FeedbackProps = {
    message: string;
    type: 'success' | 'danger';
}
export default function Feedback({ message, type }: FeedbackProps) {
    return(
        <span className={twMerge(
            "p-3 text-sm border-[1px] rounded-md",
            type === 'success' && 'bg-success/40 border-success',
            type === 'danger' && 'bg-danger/40 border-danger',
        )}>
            {message}
        </span>
    )
}