import { cn } from "@/utils/cn";
import * as React from "react";
import { type ComponentPropsWithoutRef, useCallback, useLayoutEffect, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
    registration?: Partial<UseFormRegisterReturn>;
    disableAutoResize?: boolean
} & Omit<ComponentPropsWithoutRef<"textarea">, "ref">;

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
    ({ disableAutoResize, registration, className, ...props }, externalRef) => {
        // 初期高さ調整のための内部ref
        const innerRef = useRef<HTMLTextAreaElement>(null);
        const { ref: registrationRef, ...registrationWithoutRef } = registration ?? {};

        const mergedRef = useCallback((node: HTMLTextAreaElement | null) => {
            innerRef.current = node;
            if (typeof externalRef === "function") {
                externalRef(node);
            }
            else if (externalRef) {
                externalRef.current = node;
            }
            if (typeof registrationRef === "function") {
                registrationRef(node);
            }
        }, [externalRef, registrationRef]);

        // 初期表示時、値がある場合のみコンテンツ量に応じた高さを設定する
        useLayoutEffect(() => {
            if (disableAutoResize) {
                return;
            }

            const el = innerRef.current;
            if (!el || !el.value) {
                return;
            }
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }, []);

        return (
            <textarea
                ref={mergedRef}
                {...registrationWithoutRef}
                {...props}
                className={cn(
                    "border border-gray-300 rounded px-3 py-2 text-base resize-y min-h-[80px]",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    className
                )}
            />
        );
    }
);

Textarea.displayName = "Textarea";
