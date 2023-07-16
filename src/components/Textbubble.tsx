import React from "react";

type TextProps = {
    children: React.ReactNode,
    className?: string
}

export default function Textbubble(props: TextProps) {

    return (
        <div className={"bg-zinc-700 text-white m-5 rounded-2xl drop-shadow-xl " + props.className || ""}>{props.children}</div>
    );
}