import { useEffect, useRef, useState } from "react";

type SelectGroupProps<T> = {
    selectOptions: T[],
    displayEach: (value: T) => React.ReactNode;
    initialValue?: T,
    onChange?: (value: T) => void,
    fwd?: any
}

type SelectOptionRef<T> = {
    value: T,
    ref: React.RefObject<HTMLDivElement>
}

export type SelectGroupFwd<T> = {
    selectValue: (value: T) => void
}

export default function SelectGroup<T>(props: SelectGroupProps<T>) {
    let [selected, setSelected] = useState(props.initialValue ?? null);

    let selectOptions: SelectOptionRef<T>[] = [];

    // Fill select option list
    for (const element of props.selectOptions) {
        selectOptions.push({
            value: element,
            ref: useRef(null)
        });
    }

    useEffect(() => {
        props.fwd.current = {
            selectValue: selectValue
        }
    }, [props.fwd]);

    useEffect(() => {
        // Select default value, if present
        if (props.initialValue)
            selectValue(props.initialValue);
    }, []);

    useEffect(() => {
        props.onChange?.(selected!);
    }, [selected]);

    function selectValue(value: T) {
        for (const element of selectOptions)
            if (element.value === value)
                select(element)
    }

    function select(so: SelectOptionRef<T>) {
        setSelected(() => so.value!);

        for (const element of selectOptions) {
            if (element.value === so.value) {
                element.ref.current?.classList.remove('select-group-not-selected');
                element.ref.current?.classList.add('select-group-selected');
            } else {
                element.ref.current?.classList.remove('select-group-selected');
                element.ref.current?.classList.add('select-group-not-selected');
            }
        }
    }

    return (
        <div className="flex flex-row">
            {selectOptions.map((e, index) => {
                return (
                    <div
                        onClick={() => select(e)}
                        className="cursor-pointer text-xl p-1 m-2 w-14 select-none drop-shadow-md"
                        id={e.toString()}
                        ref={e.ref}
                        key={index}
                    >
                        {props.displayEach(e.value)}
                    </div>
                );
            })}

        </div>
    );
}