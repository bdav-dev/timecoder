import { useEffect, useRef, useState } from "react";
import Modal, { ModalFwd } from "./Modal";

type ErrorModalProps = {
    fwd: any
}

export type ErrorModalFwd = {
    showModal: (errorTitle: string, errorText: string) => void,
    close: () => void
}

export default function ShareModal(props: ErrorModalProps) {
    const modal = useRef<ModalFwd>(null);
    let [title, setTitle] = useState("");
    let [text, setText] = useState("");

    useEffect(() => {
        props.fwd.current = {
            showModal: showModal,
            close: () => modal.current?.close()
        }
    }, [props.fwd]);

    function showModal(errorTitle: string, errorText: string) {
        setTitle(errorTitle);
        setText(errorText);
        modal.current?.showModal();
    }

    return (
        <Modal fwd={modal} className="h-1/3 w-1/2">
            <div className="h-full flex flex-col">
                {/* Title */}
                <div className="text-center text-2xl mt-5 font-bold h-auto">
                    {title}
                </div>

                {/* Export options */}
                <div className="flex h-full justify-center items-center text-lg">
                    {text}
                </div>
            </div>
        </Modal>
    );
}