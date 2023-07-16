import { Framerate, TimecodeString } from "@/globalTypes/types";
import { invalidTimecode, initialFramerate } from "@/globalTypes/types";

class TimecodeCalculationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimecodeCalculationException";
    }
}

export class Timecode {
    hours: number;
    minutes: number;
    seconds: number;
    frames: number;
    framerate: Framerate;

    private invalid: boolean;

    constructor(framerate: Framerate, hours: number, minutes: number, seconds: number, frames: number);
    constructor(framerate: Framerate);
    constructor(framerate?: Framerate, hours?: number, minutes?: number, seconds?: number, frames?: number) {
        this.hours = hours || 0;
        this.minutes = minutes || 0;
        this.seconds = seconds || 0;
        this.frames = frames || 0;
        this.framerate = framerate || initialFramerate;
        this.invalid = false;
    }

    static invalid(): Timecode {
        let invalidTimecode = new Timecode(initialFramerate);
        invalidTimecode.invalid = true;
        return invalidTimecode;
    }

    isInvalid() {
        return this.invalid;
    }

    static clone(timecode: Timecode): Timecode {
        return new Timecode(timecode.framerate, timecode.hours, timecode.minutes, timecode.seconds, timecode.frames);
    }

    add(timecode: Timecode): Timecode {
        if (this.framerate != timecode.framerate)
            throw new TimecodeCalculationException(`Add: Provided Timecode has different framerate. Framerate-Self: ${this.framerate}, Framerate-Other: ${timecode.framerate}`);

        const framesCalc = calcResultAndRemainder(timecode.frames + this.frames, this.framerate);
        const secondsCalc = calcResultAndRemainder(timecode.seconds + this.seconds + framesCalc.result, 60);
        const minutesCalc = calcResultAndRemainder(timecode.minutes + this.minutes + secondsCalc.result, 60);
        const hoursCalc = calcResultAndRemainder(timecode.hours + this.hours + minutesCalc.result, 99);

        if (hoursCalc.result > 0)
            throw new TimecodeCalculationException("Hour overflow.");

        let sum: Timecode = new Timecode(this.framerate);

        sum.frames = framesCalc.remainder;
        sum.seconds = secondsCalc.remainder;
        sum.minutes = minutesCalc.remainder;
        sum.hours = hoursCalc.remainder;

        return sum;
    }

    subtract(timecode: Timecode): Timecode {
        if (this.framerate != timecode.framerate)
            throw new TimecodeCalculationException(`Add: Provided Timecode has different framerate. Framerate-Self: ${this.framerate}, Framerate-Other: ${timecode.framerate}`);

        let framesCalc = calcResultAndRemainder(this.frames - timecode.frames, this.framerate);
        if (framesCalc.remainder < 0)
            framesCalc.remainder += -framesCalc.result * this.framerate;

        let secondsCalc = calcResultAndRemainder(this.seconds - timecode.seconds + framesCalc.result, 60);
        if (secondsCalc.remainder < 0)
            secondsCalc.remainder += -secondsCalc.result * 60;

        let minutesCalc = calcResultAndRemainder(this.minutes - timecode.minutes + secondsCalc.result, 60);
        if (minutesCalc.remainder < 0)
            minutesCalc.remainder += -minutesCalc.result * 60;

        let hoursCalc = calcResultAndRemainder(this.hours - timecode.hours + minutesCalc.result, 99);
        if (hoursCalc.remainder < 0)
            hoursCalc.remainder += -hoursCalc.result * 60;

        let diff: Timecode = new Timecode(this.framerate);

        diff.frames = framesCalc.remainder;
        diff.seconds = secondsCalc.remainder;
        diff.minutes = minutesCalc.remainder;
        diff.hours = hoursCalc.remainder;

        return diff;
    }

    compare(timecode: Timecode): number {
        return this.toFrames() - timecode.toFrames();
    }

    private toFrames() {
        const seconds = this.seconds + 60 * this.minutes + 60 * 60 * this.hours;
        return this.frames + this.framerate * seconds;
    }

    addToSelf(timecode: Timecode): void {
        const result = this.add(timecode);
        this.frames = result.frames;
        this.seconds = result.seconds;
        this.minutes = result.minutes;
        this.hours = result.hours;
    }

    toTimecodeString(): TimecodeString {
        if (!this.invalid) {
            return {
                frames: this.frames.toString().length == 1 ? "0" + this.frames : this.frames.toString(),
                seconds: this.seconds.toString().length == 1 ? "0" + this.seconds : this.seconds.toString(),
                minutes: this.minutes.toString().length == 1 ? "0" + this.minutes : this.minutes.toString(),
                hours: this.hours.toString().length == 1 ? "0" + this.hours : this.hours.toString()
            }
        } else {
            return invalidTimecode;
        }
    }

    toString() {
        const timecodeString = this.toTimecodeString();
        return `${timecodeString.hours}:${timecodeString.minutes}:${timecodeString.seconds}:${timecodeString.frames} at ${this.framerate}fps`;
    }
}

type Result = {
    result: number,
    remainder: number
}

function calcResultAndRemainder(a: number, b: number): Result {
    return {
        result: Math.floor(a / b),
        remainder: a % b
    };
}