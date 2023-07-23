import { IndexedInOutSequence } from '@/app/page';
import { Framerate } from '@/ts/framerate';
import { Timecode } from '@/ts/timecode';

export function downloadCSV(tableName: string, framerate: Framerate, inOut: IndexedInOutSequence[], sum: Timecode) {
    function formatField(text: string): string {
        return `"${text.replace('"', "'")}"`;
    }

    let rows = [
        [tableName, "", `"Framerate: ${framerate}fps"`],
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
        + rows.map(e => e.join(";")).join("\n");

    const encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tableName == "" ? "timecoder-export" : tableName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}