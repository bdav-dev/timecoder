import { VT323, Ubuntu_Mono } from 'next/font/google';

const ubuntuMonoFont = Ubuntu_Mono({ subsets: ['latin'], weight: '400'});
export const ubuntuMono = ubuntuMonoFont.className;

const vt323Font = VT323({ subsets: ['latin'], weight: "400" })
export const vt323 = vt323Font.className;