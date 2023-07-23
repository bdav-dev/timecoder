import { useEffect, useRef, useState } from "react";

type SelectGroupProps = {
    selectOptions: number[],
    displayEach: (value: number) => React.ReactNode;
    initialValue?: number,
    onChange?: (value: number) => void
}

type SelectOptionRef = {
    value: number,
    ref: React.RefObject<HTMLDivElement>
}

export default function SelectGroup(props: SelectGroupProps) {
    let [selected, setSelected] = useState(props.initialValue ?? null);

    let selectOptions: SelectOptionRef[] = [];

    // Fill select option list
    for (const element of props.selectOptions) {
        selectOptions.push({
            value: element,
            ref: useRef(null)
        });
    }

    useEffect(() => {
        // Select default value, if present
        if (props.initialValue !== undefined) {
            for (const element of selectOptions)
                if (element.value === props.initialValue)
                    select(element)
        }
    }, []);

    useEffect(() => {
        props.onChange?.(selected!);
    }, [selected]);


    function select(so: SelectOptionRef) {
        setSelected(() => so.value);

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
            {selectOptions.map((e) => {
                return (
                    <div
                        onClick={() => select(e)}
                        className="cursor-pointer text-xl p-1 m-2 w-14 select-none drop-shadow-md"
                        id={e.toString()}
                        ref={e.ref}
                    >
                        {props.displayEach(e.value)}
                    </div>
                );
            })}

        </div>
    );
}