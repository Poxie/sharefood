"use client";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

export default function Input({ onChange, onSubmit, placeholder, defaultValue, className, submitIcon, submitIconClassName, containerClassName }: {
    onChange?: (text: string) => void;
    onSubmit?: (text: string) => void;
    className?: string;
    placeholder?: string;
    submitIcon?: React.ReactElement;
    submitIconClassName?: string;
    containerClassName?: string;
    defaultValue?: string;
}) {
    const ref = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!onChange) return;
        onChange(e.target.value);
    }
    const handleSubmit = () => {
        if(!onSubmit || !ref.current) return;
        onSubmit(ref.current.value);
    }
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            handleSubmit();
        }
    }

    return(
        <div 
            data-testid="input-container"
            className={twMerge(
                "relative",
                containerClassName,
            )}
        >
            <input 
                type="text"
                className={twMerge(
                    "w-full p-4 rounded-md border-[1px] border-tertiary",
                    className,
                )}
                onChange={handleChange}
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                value={defaultValue}
                ref={ref}
            />
            {submitIcon && (
                <button 
                    className={twMerge(
                        "absolute right-2",
                        submitIconClassName,
                    )}
                    onClick={handleSubmit}
                >
                    {submitIcon}
                </button>
            )}
        </div>
    )
}