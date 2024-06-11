"use client";
import { InputHTMLAttributes, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default function Input({ onChange, onSubmit, placeholder, defaultValue, className, icon, iconClassName, buttonIcon, buttonIconClassName, onButtonClick, containerClassName, type="text" }: {
    onChange?: (text: string) => void;
    onSubmit?: (text: string) => void;
    className?: string;
    placeholder?: string;
    icon?: React.ReactElement;
    iconClassName?: string;
    buttonIcon?: React.ReactElement;
    buttonIconClassName?: string;
    onButtonClick?: () => void;
    containerClassName?: string;
    defaultValue?: string;
    type?: InputHTMLAttributes<HTMLInputElement>['type']
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
            {icon && (
                <div 
                    data-testid="input-icon"
                    className={twMerge(
                        "absolute h-full aspect-square flex items-center justify-center text-muted pointer-events-none",
                        iconClassName,
                    )}
                >
                    {icon}
                </div>
            )}
            <input 
                type={type}
                className={twMerge(
                    "w-full p-3 rounded-md border-[1px] border-tertiary",
                    icon && (
                        "pl-12"
                    ),
                    className,
                )}
                onChange={handleChange}
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                value={defaultValue}
                ref={ref}
            />
            {buttonIcon && (
                <button 
                    data-testid="input-submit-icon"
                    className={twMerge(
                        "[--from-edge:1rem] absolute top-2/4 -translate-y-2/4 right-[calc(var(--from-edge)/2)] h-[calc(100%-var(--from-edge))] aspect-square flex items-center justify-center text-c-primary hover:bg-secondary transition-colors rounded-lg",
                        buttonIconClassName,
                    )}
                    onClick={onButtonClick || handleSubmit}
                    type="button"
                >
                    {buttonIcon}
                </button>
            )}
        </div>
    )
}