export type Framerate = 24 | 25 | 30 | 50 | 60;

export const framerates: Framerate[] = [24, 25, 30, 50, 60];
export const initialFramerate: Framerate = 24;

export type Timecode = {
    hours: number,
    minutes: number,
    seconds: number,
    frames: number,
    framerate: Framerate
}

export type TimecodeString = {
    hours: string,
    minutes: string,
    seconds: string,
    frames: string
}

export const invalidTimecode: TimecodeString = {
    hours: "--",
    minutes: "--",
    seconds: "--",
    frames: "--"
}

export const initialTimecode: TimecodeString = {
    hours: "00",
    minutes: "00",
    seconds: "00",
    frames: "00"
}
