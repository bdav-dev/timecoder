import { createRef, useEffect, useState } from "react";

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
    let [selected, setSelected] = useState(props.initialValue);

    let selectOptions: SelectOptionRef[] = [];

    for (const element of props.selectOptions) {
        selectOptions.push({
            value: element,
            ref: createRef()
        });
    }

    useEffect(() => {
        if (props.initialValue != undefined) {
            for (const element of selectOptions)
                if (element.value === props.initialValue)
                    select(element)
        }
    }, []);

    useEffect(() => {
        if (props.onChange !== undefined)
            props.onChange(selected!);
    }, [selected]);


    function select(so: SelectOptionRef) {
        setSelected(so.value);

        for (const element of selectOptions) {
            if (element.ref.current?.classList.contains("font-bold"))
                element.ref.current?.classList.toggle("font-bold");

            if (element.ref.current?.classList.contains("text-white"))
                element.ref.current?.classList.toggle("text-white");

            if (!element.ref.current?.classList.contains("text-zinc-500"))
                element.ref.current?.classList.toggle("text-zinc-500");

            if (element.value === so.value) {
                element.ref.current?.classList.toggle("font-bold");
                element.ref.current?.classList.toggle("text-zinc-500");
                element.ref.current?.classList.toggle("text-white");
            }
        }
    }

    return (
        <div className="flex flex-row">
            {selectOptions.map((e) => {
                return (
                    <div onClick={() => select(e)} className="cursor-pointer text-xl p-1 m-2 w-14 rounded-full select-none" id={e.toString()} ref={e.ref}>
                        {props.displayEach(e.value)}
                    </div>
                );
            })}

        </div>
    );


}