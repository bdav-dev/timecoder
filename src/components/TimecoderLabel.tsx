import Textbubble from "@/components/Textbubble";
import { vt323, ubuntuMono } from '@/fonts'

export default function TimecoderLabel() {
    
    return (
        <Textbubble className="w-fit text-center p-4 flex flex-col justify-center">
            <div className={"text-6xl " + vt323}>
                TIMECODER
            </div>

            <div className={" " + ubuntuMono}>
                Timecode Calculator
            </div>
        </Textbubble>
    );
}