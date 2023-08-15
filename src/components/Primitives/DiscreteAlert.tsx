import React, { useEffect, useRef, useState } from "react";

type DiscreteAlertProps = {
    children?: React.ReactNode
    fwd: any
}

export type DiscreteAlertFwd = {
    show: (duration?: number, alertType?: DiscreteAlertType) => void
}

export type DiscreteAlertType = 'RED' | 'GREEN' | 'AMBER';

export default function DiscreteAlert(props: DiscreteAlertProps) {
    const div = useRef<HTMLDivElement>(null);

    let [alertType, setAlertType] = useState<DiscreteAlertType>('RED');
    let [borderColor, setBorderColor] = useState("border-red-500");
    let [visible, setVisible] = useState(false);


    useEffect(() => {
        props.fwd.current = {
            show: show,
        }
    }, [props.fwd]);

    
    useEffect(() => {
        switch(alertType) {
            case 'RED':
                setBorderColor('border-red-500');
                break;
            case 'AMBER':
                setBorderColor('border-amber-500');
                break;
            case 'GREEN':
                setBorderColor('border-green-500');
                break;
        }
    }, [alertType]);
    
    function show(duration?: number, alertType?: DiscreteAlertType) {
        if(alertType)
            setAlertType(alertType);

        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        }, duration ?? 2000);
    }

    return (
        <div>
            <div ref={div} className={"fixed bottom-0 left-1/2 -translate-x-1/2 p-5 bg-zinc-900 mb-3 border-4 rounded-3xl text-white " + borderColor + " " + (visible ? 'vis' : 'hid')}>
                {props.children}
            </div>
        </div>
    );

}