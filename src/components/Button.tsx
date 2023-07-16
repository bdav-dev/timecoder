'use client';

type PropsButton = {
    children: React.ReactNode,
    onClick: () => void
}

export default function Button(props: PropsButton) {
    return (
        <button onClick={props.onClick} className="w-20 h-10 rounded-lg bg-slate-500 text-white font-bold">&#xff0b;</button>
    );
}