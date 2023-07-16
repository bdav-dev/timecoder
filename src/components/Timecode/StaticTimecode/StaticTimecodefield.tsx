'use client';
import { ubuntuMono } from '@/fonts'

type StaticTimecodefieldProps = {
    children: React.ReactNode
}

export default function StaticTimecodefield(props: StaticTimecodefieldProps) {
    return (
        <div className={ubuntuMono}>
            <div className="text-white bg-zinc-900 rounded-md w-8 h-8 text-center m-1 text-xl">
                {props.children}
            </div>
        </div>
    );
}