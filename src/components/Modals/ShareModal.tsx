import { useEffect, useRef } from "react";
import Modal, { ModalFwd } from "./Modal";
import Button from "../Primitives/Button";
import CopyableTextfield, { CopyableTextfieldFwd } from "../Primitives/CopyableTextfield";

type ShareModalProps = {
    fwd: any,
    onDownloadClick: (tablename: string) => void
}

export default function ShareModal(props: ShareModalProps) {
    const modal = useRef<ModalFwd>(null);
    const tableName = useRef<HTMLInputElement>(null);
    const copyableTextfieldLink = useRef<CopyableTextfieldFwd>(null);
    const copyableTextfieldCode = useRef<CopyableTextfieldFwd>(null);

    const headlinesClassNames = "text-lg font-bold mb-3";
    const shareBoxClassNames = "w-1/3 ml-4 mr-4";

    useEffect(() => {
        props.fwd.current = {
            showModal: () => modal.current?.showModal(),
            close: () => {
                modal.current?.close();
                close();
            }
        }
    }, [props.fwd]);

    function close() {
        copyableTextfieldLink.current?.reset();
        copyableTextfieldCode.current?.reset();
    }

    return (
        <Modal onClose={close} fwd={modal} className="h-1/3">
            <div className="h-full flex flex-col">
                {/* Title */}
                <div className="text-center text-2xl mt-5 font-bold h-auto">
                    Export and Share
                </div>

                {/* Export options */}
                <div className="flex items-center text-center flex-auto">
                    
                    {/* Export as .csv table */}
                    <div className={shareBoxClassNames}>
                        <div className={headlinesClassNames}>
                            Export as .csv table
                        </div>

                        <div className="flex h-10">
                            <input
                                ref={tableName}
                                placeholder="Table name"
                                className="bg-zinc-900 p-2 rounded-lg drop-shadow-md w-full focus:outline-none border border-transparent focus:border-zinc-200"
                            />

                            <Button
                                usePadding={false}
                                className="pl-3 pr-3 ml-2 h-10"
                                onClick={() => props.onDownloadClick(tableName.current!.value)}
                            >Download</Button>
                        </div>
                    </div>

                    {/* Share Link */}
                    <div className={shareBoxClassNames}>
                        <div className={headlinesClassNames}>
                            Share Link
                        </div>
                        <CopyableTextfield
                            fwd={copyableTextfieldLink}
                            text="https:/timecoder.de/?prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&"
                        />
                    </div>

                    {/* Share Code */}
                    <div className={shareBoxClassNames}>
                        <div className={headlinesClassNames}>
                            Share Code
                        </div>
                        <CopyableTextfield fwd={copyableTextfieldCode}
                            text="https:/timecoder.de/?prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}