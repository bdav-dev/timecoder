import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import Button from "../Primitives/Button";
import CopyableTextfield, { CopyableTextfieldFwd } from "../Primitives/CopyableTextfield";

type ShareModalProps = {
    onDownloadClick: () => void,
    code?: string,
    isOpen: boolean,
    onRequestClose: () => void
}

export default function ShareModal(props: ShareModalProps) {
    const copyableTextfieldLink = useRef<CopyableTextfieldFwd>(null);
    const copyableTextfieldCode = useRef<CopyableTextfieldFwd>(null);

    let [url, setUrl] = useState("");

    const headlinesClassNames = "text-lg font-bold mb-3";
    const shareBoxClassNames = "ml-4 mr-4";

    useEffect(() => {
        const origin = window.location.origin;
        setUrl(`${origin}/?d=${props.code}`);
    }, [props.code]);

    function close() {
        copyableTextfieldLink.current?.reset();
        copyableTextfieldCode.current?.reset();
        props.onRequestClose();
    }

    return (
        <Modal isOpen={props.isOpen} onRequestClose={close} className="h-1/3 w-1/2">
            <div className="h-full flex flex-col">
                {/* Title */}
                <div className="text-center text-2xl mt-5 font-bold h-auto">
                    Export and Share
                </div>

                {/* Export options */}
                <div className="flex items-center text-center after:content-stretch before:content-stretch justify-between flex-auto">
                    
                    {/* Export as .csv table */}
                    <div className={shareBoxClassNames}>
                        <div className={headlinesClassNames}>
                            Export as .csv table
                        </div>

                        <div className="flex h-10 justify-center">
                            <Button
                                usePadding={false}
                                className="pl-3 pr-3 ml-2 h-10"
                                onClick={() => props.onDownloadClick()}
                            >Download</Button>
                        </div>
                    </div>

                    {/* Share Link */}
                    <div className={shareBoxClassNames + " w-1/3"}>
                        <div className={headlinesClassNames}>
                            Share Link
                        </div>
                        <CopyableTextfield
                            fwd={copyableTextfieldLink}
                            text={url}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}