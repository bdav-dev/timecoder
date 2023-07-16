import { ubuntuMono } from '@/fonts'

type SmallLabelProps = {
    children: React.ReactNode
}

export default function SmallLabel(props: SmallLabelProps) {

    return (
        <span className={"pl-2 text-zinc-400 font-extrabold drop-shadow-none " + ubuntuMono}>{props.children}</span>
    );
}