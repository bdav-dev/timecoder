'use client';

export type PropsButton = {
    className?: string,
    children: React.ReactNode,
    usePadding?: boolean,
    onClick?: () => void
}

export default function Button(props: PropsButton) {
    const padding = props.usePadding ?? "p-3";

    return (
        <button
            onClick={props.onClick}
            className={padding + " expand-on-hover-10 rounded-lg bg-slate-500 text-white font-bold drop-shadow-lg " + props.className}
        >
            {props.children}
        </button>
    );
}