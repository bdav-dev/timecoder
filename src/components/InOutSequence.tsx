import Image from "next/image";
import SmallLabel from "./SmallLabel";
import Timecode from "./Timecode";
import StaticTimecode from "./Timecode/StaticTimecode/StaticTimecode";
import trashcanIcon from "@/../public/trashcan_icon.webp";
import { useEffect, useState } from "react";
import { Timecode as TimecodeClass } from '@/logic/timecodelogic';
import { Framerate } from "@/globalTypes/types";

export type InOutSequenceProps = {
    onDelete: () => void,
    framerate: Framerate,
    onChange?: (seq: InOutSequence) => void
};

export type InOutSequence = {
    in: TimecodeClass,
    out: TimecodeClass,
    difference: TimecodeClass,
    comment: string
};

export default function InOutSequence(props: InOutSequenceProps) {
    let [differenceTimecode, setDifferenceTimecode] = useState(new TimecodeClass(props.framerate));
    let [inTimecode, setInTimecode] = useState(new TimecodeClass(props.framerate));
    let [outTimecode, setOutTimecode] = useState(new TimecodeClass(props.framerate));
    let [comment, setComment] = useState("");

    function onChange() {
        if (props.onChange !== undefined) {
            props.onChange({
                in: inTimecode,
                out: outTimecode,
                difference: differenceTimecode,
                comment: comment
            });
        }
    }

    useEffect(() => {
        onChange();
    }, [differenceTimecode]);

    useEffect(() => {
        calculateTimecodeDifference()
    }, [inTimecode, outTimecode]);

    function calculateTimecodeDifference() {
        if (inTimecode.compare(outTimecode) > 0)
            setDifferenceTimecode((prev) => TimecodeClass.invalid());
        else
            setDifferenceTimecode((prev) => outTimecode.subtract(inTimecode));
    }

    return (
        <div className="text-white flex flex-row h-auto p-3">
            <div className="flex items-center">
                <div>
                    <SmallLabel>In</SmallLabel>
                    <Timecode framerate={props.framerate} onChange={(timecode) => setInTimecode((p) => timecode)} />
                </div>

                <div className="m-3 pt-5">&#x2013;</div>

                <div>
                    <SmallLabel>Out</SmallLabel>
                    <Timecode framerate={props.framerate} onChange={(timecode) => setOutTimecode((p) => timecode)} />
                </div>

                <div className="ml-8">
                    <SmallLabel>Difference</SmallLabel>
                    <StaticTimecode timecode={differenceTimecode.toTimecodeString()} />
                </div>
            </div>

            <div className="pl-8 w-full h-full">
                <SmallLabel>Comment</SmallLabel>
                <textarea className="resize-none bg-zinc-700 w-full h-16 text-white p-1 rounded-md focus:outline-none focus:border border-zinc-50" />
            </div>

            <div className="self-center">
                <button className="bg-red-800 w-9 h-9 rounded-md m-3 mt-8 p-1" onClick={() => props.onDelete()}>
                    <Image src={trashcanIcon} width={256} height={256} alt="" />
                </button>
            </div>
        </div>
    );
}
