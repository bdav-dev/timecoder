import { useEffect, useRef } from "react";

type ModalProps = {
    className?: string,
    children?: React.ReactNode,
    fwd: any,
    onClose?: () => void
};

export type ModalFwd = {
    showModal: () => void,
    close: () => void
}

export default function Modal(props: ModalProps) {
    const modal = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        props.fwd.current = {
            showModal: showModal,
            close: close
        }
    }, [props.fwd]);


    function showModal() {
        modal.current?.showModal();
    }

    function close() {
        modal.current?.close()
        props.onClose?.();
    }

    return (
        <dialog
            className={"backdrop:bg-opacity-30 backdrop:bg-zinc-900 bg-zinc-700 drop-shadow-xl w-2/3 rounded-xl text-white " + props.className}
            ref={modal}
        >
            <button
                onClick={close}
                className="bg-zinc-900 drop-shadow-md text- rounded-full h-10 w-10 absolute right-0 top-0 m-4 text-zinc-300"
            >&#10005;</button>

            {props.children}
        </dialog>
    );

}