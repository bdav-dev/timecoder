import Image from "next/image";
import SmallLabel from "../Primitives/SmallLabel";
import Timecode from "./Timecode/Timecode";
import StaticTimecode from '@/components/Timecodes/StaticTimecode/StaticTimecode';
import trashcanIcon from "@/../public/icons/trashcan_icon.webp";
import { ChangeEvent, useEffect, useState } from "react";
import { CompactTimecodeObject, Timecode as TimecodeClass } from '@/ts/timecode';
import { Framerate } from "@/ts/framerate";
import Button from '@/components/Primitives/Button'

export type InOutSequenceProps = {
    onDelete?: () => void,
    onMove?: (operation: MoveOperation) => void,
    framerate: Framerate,
    onChange?: (seq: InOutSequence) => void
};

export enum MoveOperation {
    UP,
    DOWN
}

export type InOutSequence = {
    in: TimecodeClass,
    out: TimecodeClass,
    difference: TimecodeClass,
    comment: string
};

export type CompactInOutSequence = {
    i: CompactTimecodeObject,
    o: CompactTimecodeObject,
    c: string
}

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
                        onChange={(timecode) => setInTimecode(() => timecode)}
                    />
                </div>

                <div className="m-3 pt-5">&#x2013;</div>

                {/* Out-Timecode */}
                <div>
                    <SmallLabel>Out</SmallLabel>
                    <Timecode
                        framerate={props.framerate}
                        onChange={(timecode) => setOutTimecode(() => timecode)}
                    />
                </div>

                {/* Difference-Timecode */}
                <div className="ml-8">
                    <SmallLabel>Difference</SmallLabel>
                    <StaticTimecode timecode={differenceTimecode.toTimecodeString()} />
                </div>
            </div>

            {/* Comment */}
            <div className="pl-8 w-full h-full z-10">
                <SmallLabel>Comment</SmallLabel>
                <textarea
                    onInput={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(() => e.target.value)}
                    className="expand-on-focus-1 resize-none bg-zinc-700 w-full h-16 text-white p-1 rounded-md border border-transparent focus:border-white focus:outline-none"
                />
            </div>

            {/* Navigation and delete buttons */}
            <div className="m-3 mt-7 self-center flex flex-row items-center">

                <div className="flex flex-col mr-3">
                    <Button className="pl-3 pr-3 mb-1"
                        usePadding={false}
                        onClick={() => props.onMove?.(MoveOperation.UP)}
                    >▴</Button>

                    <Button
                        className="pl-3 pr-3 mt-1"
                        usePadding={false} onClick={() => props.onMove?.(MoveOperation.DOWN)}
                    >▾</Button>
                </div>

                <button
                    className="bg-red-800 w-9 h-9 rounded-md p-1.5 expand-on-hover-10"
                    onClick={() => props.onDelete?.()}
                >
                    <Image
                        src={trashcanIcon}
                        width={128}
                        height={128}
                        alt=""
                    />
                </button>
            </div>
        </div>
    );
}
