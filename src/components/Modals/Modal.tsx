import React, { useEffect, useRef } from "react";

type ModalProps = {
    className?: string,
    children?: React.ReactNode,
    isOpen: boolean,
    onRequestClose: () => void
};

export default function Modal(props: ModalProps) {
    const modal = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (props.isOpen) {
            modal.current?.showModal();
        } else {
            modal.current?.close();
        }
    }, [props.isOpen]);

    return (
        <dialog
            className={"backdrop:bg-opacity-40 backdrop:bg-zinc-900 bg-zinc-700 drop-shadow-xl rounded-xl text-white " + props.className}
            ref={modal}
        >
            <button
                onClick={props.onRequestClose}
                className="focus:outline-none expand-on-hover-10 bg-zinc-900 drop-shadow-md text- rounded-full h-10 w-10 absolute right-0 top-0 m-4 text-zinc-300"
            >&#10005;</button>

            {props.children}
        </dialog>
    );

}