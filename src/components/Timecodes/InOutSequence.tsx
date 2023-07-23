import Image from "next/image";
import SmallLabel from "../Primitives/SmallLabel";
import Timecode from "./Timecode/Timecode";
import StaticTimecode from '@/components/Timecodes/StaticTimecode/StaticTimecode';
import trashcanIcon from "@/../public/icons/trashcan_icon.webp";
import { ChangeEvent, useEffect, useState } from "react";
import { Timecode as TimecodeClass } from '@/ts/timecode';
import { Framerate } from "@/ts/framerate";

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
        props.onChange?.({
            in: inTimecode,
            out: outTimecode,
            difference: differenceTimecode,
            comment: comment
        });
    }

    useEffect(() => {
        onChange();
    }, [differenceTimecode, comment]);

    useEffect(() => {
        calculateTimecodeDifference()
    }, [inTimecode, outTimecode]);

    function calculateTimecodeDifference() {
        if (inTimecode.compare(outTimecode) > 0)
            setDifferenceTimecode(() => TimecodeClass.invalid());
        else
            setDifferenceTimecode(() => outTimecode.subtract(inTimecode));
    }

    return (
        <div className="text-white flex flex-row h-auto p-3">
            <div className="flex items-center">

                {/* In-Timecode */}
                <div>
                    <SmallLabel>In</SmallLabel>
                    <Timecode
                        framerate={props.framerate}
                        onChange={(timecode) => setInTimecode((p) => timecode)}
                    />
                </div>

                <div className="m-3 pt-5">&#x2013;</div>

                {/* Out-Timecode */}
                <div>
                    <SmallLabel>Out</SmallLabel>
                    <Timecode
                        framerate={props.framerate}
                        onChange={(timecode) => setOutTimecode((p) => timecode)}
                    />
                </div>

                {/* Difference-Timecode */}
                <div className="ml-8">
                    <SmallLabel>Difference</SmallLabel>
                    <StaticTimecode timecode={differenceTimecode.toTimecodeString()} />
                </div>
            </div>

            {/* Comment from user */}
            <div className="pl-8 w-full h-full z-10">
                <SmallLabel>Comment</SmallLabel>
                <textarea
                    onInput={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(() => e.target.value)}
                    className="expand-on-focus-1 resize-none bg-zinc-700 w-full h-16 text-white p-1 rounded-md border border-transparent focus:border-white focus:outline-none"
                />
            </div>

            {/* Delete-Button */}
            <div className="self-center">
                <button
                    className="bg-red-800 w-9 h-9 rounded-md m-3 mt-8 p-1 expand-on-hover-10"
                    onClick={() => props.onDelete()}
                >
                    <Image src={trashcanIcon} width={256} height={256} alt="" />
                </button>
            </div>
        </div>
    );
}
