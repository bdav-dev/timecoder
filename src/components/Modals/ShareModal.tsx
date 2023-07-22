import { Ref, createRef, useRef } from "react";
import Modal, { ModalFwd } from "./Modal";
import Button from "../Button";
import CopyableTextfield, { CopyableTextfieldFwd } from "../CopyableTextfield";
import SmallLabel from "../SmallLabel";

type ShareModalProps = {
    fwd: any
    onDownloadClick: (tablename: string) => void;
}

export default function ShareModal(props: ShareModalProps) {
    const modal = useRef<ModalFwd>();
    const tableName = createRef<HTMLInputElement>();
    const copyableTextfieldLink = useRef<CopyableTextfieldFwd>();
    const copyableTextfieldCode = useRef<CopyableTextfieldFwd>();

    const headlinesClassNames = "text-lg font-bold mb-3";
    const shareBoxClassNames = "w-1/3 ml-4 mr-4";

    props.fwd.current = {
        showModal: () => modal.current?.showModal(),
        close: () => {
            modal.current?.showModal();
            close();
        }
    }

    function close() {
        copyableTextfieldLink.current?.reset();
        copyableTextfieldCode.current?.reset();
    }

    return (
        <Modal onClose={close} fwd={modal} className="h-1/3">
            <div className="h-full flex flex-col">
                <div className="text-center text-2xl mt-5 font-bold h-auto">
                    Export and Share
                </div>

                <div className="flex items-center text-center flex-auto">
                    <div className={shareBoxClassNames}>
                        <div className={headlinesClassNames}>Export as .csv table</div>

                        <div className="flex h-10">
                            <input ref={tableName} placeholder="Table name" className="bg-zinc-900 p-2 rounded-lg drop-shadow-md w-full focus:outline-none border border-transparent focus:border-zinc-200"></input>
                            <Button usePadding={false} className="pl-3 pr-3 ml-2 h-10" onClick={() => props.onDownloadClick(tableName.current!.value)}>Download</Button>
                        </div>
                    </div>

                    <div className={shareBoxClassNames}>
                        <div className={headlinesClassNames}>Share Link</div>
                        <CopyableTextfield fwd={copyableTextfieldLink} text="https:/timecoder.de/?prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&" />
                    </div>

                    <div className={shareBoxClassNames}>
                        <div className={headlinesClassNames}>Share Code</div>
                        <CopyableTextfield fwd={copyableTextfieldCode} text="https:/timecoder.de/?prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&prop1=10&" />
                    </div>
                </div>

            </div>

        </Modal>
    );
}