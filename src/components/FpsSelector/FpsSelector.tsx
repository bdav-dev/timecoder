import SelectGroup from "../SelectGroup/SelectGroup";
import Textbubble from "../Textbubble";
import { ubuntuMono } from '@/fonts';
import { Framerate, framerates } from "@/globalTypes/types";

type FpsSelectorProps = {
    onChange?: (framerate: Framerate) => void,
    initialValue?: Framerate
}

export default function FpsSelector(props: FpsSelectorProps) {

    const fpsOptions = framerates;

    function selectGroupChanged(value: number) {
        if (props.onChange !== undefined)
            props.onChange(value as Framerate);
    }

    function displayEach(value: number) {
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
                <span className="text-xl">Framerate</span>
                <div>
                    <SelectGroup onChange={selectGroupChanged} displayEach={displayEach} selectOptions={fpsOptions} initialValue={props.initialValue || fpsOptions[0]} />
                </div>
            </Textbubble>
        </div>
    );
}

