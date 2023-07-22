'use client';

import Button from "@/components/Button";
import FpsSelector from "@/components/FpsSelector/FpsSelector";
import InOutSequence, { InOutSequence as InOutSequenceType } from "@/components/InOutSequence";
import Textbubble from "@/components/Textbubble";
import TimecoderLabel from "@/components/TimecoderLabel";
import { Ref, createRef, useEffect, useRef, useState } from "react";
import { initialFramerate } from "@/globalTypes/types";
import StaticTimecode from "@/components/Timecode/StaticTimecode/StaticTimecode";
import { Timecode, downloadCSV } from "@/logic/timecodelogic";
import SmallLabel from "@/components/SmallLabel";
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
    setSumTimecode((prev) => {
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

      <div className="flex flex-row">
        <TimecoderLabel />
        <div className="ml-auto h-fit">
          <FpsSelector onChange={(newFramerate) => setFramerate(() => newFramerate)} initialValue={initialFramerate} />
        </div>
      </div>

      <div className="flex flex-col items-center drop-shadow-xl mb-48">
        <div className="w-4/5 pb-8">
          {inOutSequences.map((e) =>
            <InOutSequence onChange={(data) => { updateInOutSequence(e.id, data) }} framerate={framerate} key={e.id} onDelete={() => deleteSequence(e.id)} />
          )}
        </div>
        <Button className="w-24" onClick={addSequence}>&#xff0b;</Button>
      </div>

      <ShareModal onDownloadClick={(tableName) => downloadCSV(tableName, framerate, inOutSequences, sumTimecode)} fwd={shareModal}/>
      
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



    </div>
  )
}
