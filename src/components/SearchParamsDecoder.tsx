import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type SearchParamsDecoderProps = {
    onDataPresent: (encodedData: string) => void,
    onNoDataPresent: () => void,
}

export default function SearchParamsDecoder(props: SearchParamsDecoderProps) {
    const query = useSearchParams();
    const encodedData = query.get('d');

    useEffect(() => {
        if (encodedData !== null) {
            props.onDataPresent(encodedData);
        } else {
            props.onNoDataPresent();
        }
    }, []);

    return <></>;
}