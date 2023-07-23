import SelectGroup from "./SelectGroup";
import Textbubble from "../Primitives/Textbubble";
import { ubuntuMono } from '@/fonts';
import { Framerate, framerates } from "@/ts/framerate";

type FpsSelectorProps = {
    onChange?: (framerate: Framerate) => void,
    initialValue?: Framerate
}

export default function FpsSelector(props: FpsSelectorProps) {

    const fpsOptions = framerates;

    function selectGroupChanged(value: number) {
        props.onChange?.(value as Framerate);
    }

    function displayValue(value: number) {
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
                />
            </Textbubble>
        </div>
    );
}

