'use client';
import { ubuntuMono } from '@/fonts'
import { useEffect, useRef, useState } from 'react';

export type TimecodefieldProps = {
    placeholder?: string,
    defaultValue?: number,
    maxValue?: number,
    onChange?: (value: number) => void
}

export default function Timecodefield(props: TimecodefieldProps) {
    const placeholder = props.placeholder ?? "";
    const defaultValue = props.defaultValue ?? "";
    const maxValue = props.maxValue ?? 99;
    const regex = /[^0-9]/g;
    const ref = useRef<HTMLInputElement>(null);

    let [value, setValue] = useState(0);

    useEffect(() => {
        applyRegexAndCap();
    }, [props.maxValue]);

    useEffect(() => {
        if (props.onChange !== undefined)
            props.onChange(value);
    }, [value]);

    function onInput() {
        applyRegexAndCap();
    }

    function onBlur() {
        formatInput();
    }

    function applyRegexAndCap() {
        let inputValue = ref.current!.value;

        inputValue = inputValue.replace(regex, ''); // apply regex

        if (parseInt(inputValue) > maxValue) // apply cap
            inputValue = maxValue.toString();

        ref.current!.value = inputValue;


        let passValue = inputValue;

        if (passValue.length === 0)
            passValue = "0";

        setValue(() => parseInt(passValue));
    }

    function formatInput() {
        ref.current!.value = format(ref.current!.value);
    }

    function format(text: string) {
        let formatedText = text;

        if (text.length == 1)
            formatedText = "0" + text;

        if (text.length == 0)
            formatedText = "00";

        return formatedText;
    }

    return (
        <div className={ubuntuMono}>
            <input
                ref={ref}
                type="text"
                onInput={onInput}
                onBlur={onBlur}
                maxLength={2}
                placeholder={placeholder}
                className="expand-on-focus-10 text-white bg-zinc-700 focus:outline-none focus:border border-zinc-50 rounded-md w-8 h-8 text-center m-1 text-xl"
                defaultValue={format(defaultValue.toString())}
            />
        </div>
    );
}