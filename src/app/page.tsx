'use client';

import Button from "@/components/Primitives/Button";
import FpsSelector from "@/components/FpsSelector/FpsSelector";
import InOutSequence, { InOutSequence as InOutSequenceType } from "@/components/Timecodes/InOutSequence";
import Textbubble from "@/components/Primitives/Textbubble";
import TimecoderLabel from "@/components/TimecoderLabel";
import { useEffect, useRef, useState } from "react";
import { initialFramerate } from "@/ts/framerate";
import StaticTimecode from "@/components/Timecodes/StaticTimecode/StaticTimecode";
import { Timecode } from "@/ts/timecode";
import { downloadCSV } from "@/ts/export";
import SmallLabel from "@/components/Primitives/SmallLabel";
import { useSearchParams } from "next/navigation";
import { ModalFwd } from "@/components/Modals/Modal";
import ShareModal from "@/components/Modals/ShareModal";

export type IndexedInOutSequence = {
  id: number,
  inOutSequence: InOutSequenceType
}

export default function Timecoder() {
  let [nextID, setNextID] = useState(0);
  let [inOutSequences, setInOutSequences] = useState<IndexedInOutSequence[]>([]);
  let [framerate, setFramerate] = useState(initialFramerate);
  let [sumTimecode, setSumTimecode] = useState<Timecode>(new Timecode(initialFramerate));
  const query = useSearchParams();

  const shareModal = useRef<ModalFwd>();

  useEffect(() => {
    if (inOutSequences.length === 0)
      addSequence();
  }, []);

  useEffect(() => {
    calculateSum();
  }, [inOutSequences]);

  function updateInOutSequence(id: number, data: InOutSequenceType) {
    setInOutSequences((prev) => {
      let copy = prev.splice(0);

      for (let sequence of copy)
        if (sequence.id === id)
          sequence.inOutSequence = data;

      return copy;
    });
  }

  function addSequence() {
    setInOutSequences((prev) => [...prev, {
      id: nextID,
      inOutSequence: {
        comment: "",
        difference: new Timecode(framerate),
        in: new Timecode(framerate),
        out: new Timecode(framerate)
      }
    }]);
    setNextID((prev) => prev + 1);
  }

  function deleteSequence(id: number) {
    setInOutSequences((prev) => prev.filter((e) => e.id !== id));
  }

  function calculateSum() {
    setSumTimecode(() => {
      const sum = new Timecode(framerate);

      for (const sequence of inOutSequences) {
        const diffTimecode = sequence.inOutSequence.difference;

        if (!diffTimecode.isInvalid())
          sum.addToSelf(diffTimecode);
      }

      return sum;
    });
  }

  return (
    <div className="w-screen h-screen">

      {/* Header */}
      <div id="header" className="flex justify-between flex-row items-center">
        <TimecoderLabel />
        <input placeholder="Project name" className="expand-on-focus-1 text-center h-16 text-3xl w-1/2 text-white bg-zinc-900 p-2 rounded-xl drop-shadow-md focus:outline-none border border-transparent focus:border-zinc-200" type="text"></input>
        <FpsSelector onChange={(newFramerate) => setFramerate(() => newFramerate)} initialValue={initialFramerate} />
      </div>

      {/* Timecode Sequences */}
      <div className="flex flex-col items-center drop-shadow-xl mb-48">
        <div className="w-4/5 pb-8">
          {inOutSequences.map((e) =>
            <InOutSequence onChange={(data) => { updateInOutSequence(e.id, data) }} framerate={framerate} key={e.id} onDelete={() => deleteSequence(e.id)} />
          )}
        </div>
        <Button className="w-24" onClick={addSequence}>&#xff0b;</Button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full">
        <Textbubble className="p-8 mt-0 drop-shadow-xl flex items-center">
          <div>
            <SmallLabel>Total</SmallLabel>
            <StaticTimecode timecode={sumTimecode.toTimecodeString()} />
          </div>

          <div className="ml-auto">
            <Button onClick={() => shareModal.current?.showModal()}>Share & Export</Button>
          </div>
        </Textbubble>
      </div>

      <ShareModal onDownloadClick={(tableName) => downloadCSV(tableName, framerate, inOutSequences, sumTimecode)} fwd={shareModal} />
    </div>
  );
}
