import SelectGroup, { SelectGroupFwd } from "./SelectGroup";
import Textbubble from "../Primitives/Textbubble";
import { ubuntuMono } from '@/fonts';
import { Framerate, framerates } from "@/ts/framerate";
import { useEffect, useRef } from "react";

type FpsSelectorProps = {
    onChange?: (framerate: Framerate) => void,
    initialValue?: Framerate,
    fwd?: any
}

export type FpsSelectorFwd = {
    selectFramerate: (framerate: Framerate) => void
}

export default function FpsSelector(props: FpsSelectorProps) {
    const fpsOptions = framerates;
    const selectGroupRef = useRef<SelectGroupFwd<Framerate>>();

    useEffect(() => {
        props.fwd.current = {
            selectFramerate: selectFramerate
        }
    }, [props.fwd]);

    function selectFramerate(framerate: Framerate) {
        selectGroupRef.current?.selectValue(framerate);
    }

    function selectGroupChanged(value: Framerate) {
        props.onChange?.(value);
    }

    function displayValue(value: Framerate) {
        return (
            <div className="flex flex-col p-1">
                <div>{value}</div>
                <div className="text-xs">FPS</div>
            </div>
        );
    }

    return (
        <div>
            <Textbubble className={"text-center p-4  h-32 " + ubuntuMono}>
                <div className="text-xl">Framerate</div>
                <SelectGroup
                    onChange={selectGroupChanged}
                    displayEach={displayValue}
                    selectOptions={fpsOptions}
                    initialValue={props.initialValue ?? fpsOptions[0]}
                    fwd={selectGroupRef}
                />
            </Textbubble>
        </div>
    );
}

