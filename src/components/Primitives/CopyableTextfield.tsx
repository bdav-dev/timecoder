import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import copyIcon from '@/../public/icons/copy_icon.webp'
import Image from "next/image";
import DiscreteAlert, { DiscreteAlertFwd } from "./DiscreteAlert";

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
                {marked ? "✓" : <Image src={copyIcon} width={128} height={128} alt="" />}
            </Button>

            <DiscreteAlert fwd={discreteAlert}>
                The link was copied to your clipboard.
            </DiscreteAlert>

        </div>

    );

}