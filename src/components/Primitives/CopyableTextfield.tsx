import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import DiscreteAlert, { DiscreteAlertFwd } from "./DiscreteAlert";
import CopyToClipboardIcon from "@/icons/CopyToClipboardIcon";

type CopyableTextfieldProps = {
    text: string,
    fwd: any
}

export type CopyableTextfieldFwd = {
    reset: () => void
}

export default function CopyableTextfield(props: CopyableTextfieldProps) {
    const input = useRef<HTMLInputElement>(null);
    let [marked, setMarked] = useState(false);
    let [buttonClassNameAdditum, setButtonClassNameAdditum] = useState("");

    const discreteAlert = useRef<DiscreteAlertFwd>(null);

    useEffect(() => {
        props.fwd.current = {
            reset: () => setMarked(false)
        }
    }, [props.fwd]);

    useEffect(() => {
        if (marked)
            setButtonClassNameAdditum("!bg-green-500");
        else
            setButtonClassNameAdditum("");
    }, [marked]);


    function buttonClicked() {
        copyToClipboard();
        discreteAlert.current?.show(3000, 'GREEN');
        if (!marked)
            setMarked(true);
    }

    function copyToClipboard() {
        const text = input.current?.value;

        if (text !== undefined)
            navigator.clipboard.writeText(text);
    }

    return (
        <div className="flex h-12 p-1">
            <input
                ref={input}
                className="bg-zinc-900 p-2 rounded-lg drop-shadow-md w-full"
                disabled
                value={props.text}
            />

            <Button
                usePadding={false}
                onClick={buttonClicked}
                className={"text-2xl pl-1.5 pr-1.5 ml-2 w-11 " + buttonClassNameAdditum}
            >
                {marked ? "✓" : <CopyToClipboardIcon className="stroke-[7] stroke-white"/>}
            </Button>

            <DiscreteAlert fwd={discreteAlert}>
                The link was copied to your clipboard.
            </DiscreteAlert>

        </div>

    );

}