import { useEffect, useState } from "react";
import Timecodefield, { TimecodefieldProps } from "./Timecodefield";
import { Timecode as TimecodeClass } from "@/logic/timecodelogic";
import { Framerate } from "@/globalTypes/types";

export type TimecodeProps = {
    framerate: Framerate,
    onChange?: (timecode: TimecodeClass) => void
}

export default function Timecode(props: TimecodeProps) {
    let [timecode, setTimecode] = useState(new TimecodeClass(props.framerate));

    useEffect(() => {
        setTimecode((prev) => {
            let copy = TimecodeClass.clone(prev);
            copy.framerate = props.framerate
            return copy;
        });
    }, [props.framerate]);

    useEffect(() => {
        if (props.onChange !== undefined)
            props.onChange(timecode);
    }, [timecode]);

    function onChange(key: number, newValue: number) {
        setTimecode((prev) => {
            let clone = TimecodeClass.clone(prev);
            
            switch (key) {
                case 0:
                    clone.hours = newValue;
                    break;
                case 1:
                    clone.minutes = newValue;
                    break;
                case 2:
                    clone.seconds = newValue;
                    break;
                case 3:
                    clone.frames = newValue;
                    break;
            }

            return clone;
        });
    }

    return (
        <div className="flex flex-row w-fit h-auto text-white items-center select-none">
            <Timecodefield onChange={(value) => onChange(0, value)} placeholder="h" defaultValue="00" maxValue={99} />
            :
            <Timecodefield onChange={(value) => onChange(1, value)} placeholder="m" defaultValue="00" maxValue={59} />
            :
            <Timecodefield onChange={(value) => onChange(2, value)} placeholder="s" defaultValue="00" maxValue={59} />
            :
            <Timecodefield onChange={(value) => onChange(3, value)} placeholder="f" defaultValue="00" maxValue={props.framerate - 1} />
        </div>
    );
}