import { IndexedInOutSequence } from '@/app/page';
import { CompactInOutSequence, InOutSequence } from '@/components/Timecodes/InOutSequence';
import { Framerate } from '@/ts/framerate';
import { CompactTimecodeObject, Timecode, TimecodeObject } from '@/ts/timecode';

type TimecoderData = {
    title: string,
    framerate: Framerate,
    indexedInOutSequences: IndexedInOutSequence[]
}

type CompactTimecoderData = {
    t: string,
    f: Framerate
    s: CompactInOutSequence[]
}

export function downloadCSV(tableName: string, framerate: Framerate, inOut: IndexedInOutSequence[], sum: Timecode) {
    function formatField(text: string): string {
        return `"${text.replaceAll('"', "'")}"`;
    }

    let rows = [
        [`${formatField(tableName)}`, "", `"Framerate: ${framerate}fps"`],
        [""],
        ["In", "Out", "Difference", "Comment"]
    ];

    for (const sequence of inOut) {
        let row = [];
        row.push(sequence.inOutSequence.in.toString());
        row.push(sequence.inOutSequence.out.toString());
        row.push(sequence.inOutSequence.difference.toString());
        row.push(formatField(sequence.inOutSequence.comment));
        rows.push(row);
    }

    rows.push([""]);
    rows.push(["", "Sum:", sum.toString()]);

    const csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tableName == "" ? "timecoder-export" : tableName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function encode(data: TimecoderData): Promise<string> {
    const compactInOutSequences: CompactInOutSequence[] = data.indexedInOutSequences.map(
        indexedSequence => toCompactInOutSequence(indexedSequence)
    );

    const encodeData: CompactTimecoderData = {
        t: data.title,
        f: data.framerate,
        s: compactInOutSequences
    };

    return await compress(JSON.stringify(encodeData));
}

export async function decode(encodedMessage: string): Promise<TimecoderData> {
    const decompressed = await decompress(encodedMessage);
    const json = JSON.parse(decompressed);

    return {
        title: json.t,
        framerate: json.f,
        indexedInOutSequences: json.s.map((e: CompactInOutSequence, index: number) => toIndexedInOutSequence(index, e, json.f))
    };
}

function toIndexedInOutSequence(id: number, compactInOutSequence: CompactInOutSequence, framerate: Framerate): IndexedInOutSequence {
    const inOutSequence: InOutSequence = {
        in: new Timecode(framerate, compactInOutSequence.i.h, compactInOutSequence.i.m, compactInOutSequence.i.s, compactInOutSequence.i.f),
        out: new Timecode(framerate, compactInOutSequence.o.h, compactInOutSequence.o.m, compactInOutSequence.o.s, compactInOutSequence.o.f),
        difference: Timecode.invalid(), // will later be recalculated
        comment: compactInOutSequence.c
    };

    return {
        id: id,
        inOutSequence: inOutSequence
    };
}

function toCompactInOutSequence(indexedInOutSequence: IndexedInOutSequence): CompactInOutSequence {
    function toCompactTimecode(timecode: TimecodeObject): CompactTimecodeObject {
        return {
            h: timecode.hours,
            m: timecode.minutes,
            s: timecode.seconds,
            f: timecode.frames
        }
    }

    return {
        i: toCompactTimecode(indexedInOutSequence.inOutSequence.in),
        o: toCompactTimecode(indexedInOutSequence.inOutSequence.out),
        c: indexedInOutSequence.inOutSequence.comment
    }
}

async function decompress(compressedMessage: string): Promise<string> {
    const byteArray = Buffer.from(compressedMessage, 'base64');
    const decompressionStream = new DecompressionStream('gzip');
    const writer = decompressionStream.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    const decompressedArrayBuffer = await new Response(decompressionStream.readable).arrayBuffer();
    return new TextDecoder().decode(decompressedArrayBuffer);
}

async function compress(message: string): Promise<string> {
    const byteArray = new TextEncoder().encode(message);
    const compressionStream = new CompressionStream('gzip');
    const writer = compressionStream.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    let compressedArrayBuffer;
    compressedArrayBuffer = await new Response(compressionStream.readable).arrayBuffer();
    return Buffer.from(compressedArrayBuffer).toString('base64');
}