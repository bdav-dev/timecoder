import StaticTimecodefield from '@/components/Timecodes/StaticTimecode/StaticTimecodefield';
import { TimecodeString } from '@/ts/timecode';

type StaticTimecodefieldProps = {
    timecode: TimecodeString
}

export default function StaticTimecode(props: StaticTimecodefieldProps) {

    return (
        <div className="flex flex-row w-fit h-auto text-white items-center select-none">
            <StaticTimecodefield>{props.timecode.hours}</StaticTimecodefield>
            :
            <StaticTimecodefield>{props.timecode.minutes}</StaticTimecodefield>
            :
            <StaticTimecodefield>{props.timecode.seconds}</StaticTimecodefield>
            :
            <StaticTimecodefield>{props.timecode.frames}</StaticTimecodefield>
        </div>
    );


}