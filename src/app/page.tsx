'use client';

import Button from "@/components/Primitives/Button";
import FpsSelector from "@/components/FpsSelector/FpsSelector";
import InOutSequence, { InOutSequence as InOutSequenceType, MoveOperation } from "@/components/Timecodes/InOutSequence";
import Textbubble from "@/components/Primitives/Textbubble";
import TimecoderLabel from "@/components/TimecoderLabel";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { initialFramerate } from "@/ts/framerate";
import StaticTimecode from "@/components/Timecodes/StaticTimecode/StaticTimecode";
import { Timecode } from "@/ts/timecode";
import { encode, downloadCSV } from "@/ts/export";
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
  let [projectName, setProjectName] = useState("");
  let [code, setCode] = useState("");
  const query = useSearchParams();

  const shareModal = useRef<ModalFwd>(null);

  useEffect(() => {
    if (inOutSequences.length === 0)
      addSequence();
  }, []);

  useEffect(() => {
    calculateSum();
  }, [inOutSequences]);

  /*
  // under construction
  function init() {
    let data = getFromLocalStorage();

    if (data != null) {
      setInOutSequences(() => {
        if (data == null)
          return [];

        let index = 0;
        return data.map((e) => {
          return {
            id: index++,
            inOutSequence: e
          }
        });
      });

    } else {
      if (inOutSequences.length === 0)
        addSequence();

    }

    window.onbeforeunload = () => {
      saveToLocalStorage();
    };
  }

  // under construction
  function getFromLocalStorage() {
    const rawData = localStorage.getItem("timecoder_data");
    let data: InOutSequenceType[];

    if (rawData != null)
      data = JSON.parse(rawData);
    else
      return null;


    data = data.map((e: InOutSequenceType) => {
      return {
        in: new Timecode(e.in.framerate, e.in.hours, e.in.minutes, e.in.seconds, e.in.frames),
        out: new Timecode(e.out.framerate, e.out.hours, e.out.minutes, e.out.seconds, e.out.frames),
        difference: new Timecode(e.difference.framerate, e.difference.hours, e.difference.minutes, e.difference.seconds, e.difference.frames),
        comment: e.comment
      }
    });

    if (data.length == 0)
      return null;

    return data;
  }

  // under construction
  function saveToLocalStorage() {
    localStorage.setItem("timecoder_data", JSON.stringify(inOutSequences.map(e => e.inOutSequence)));
  }
  */

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

  function moveSequence(id: number, op: MoveOperation) {
    setInOutSequences((prev) => {
      let copy = prev.slice(0);
      let firstIndex = 0;
      let secondIndex = 0;

      // get index in array where id matches
      for (let i = 0; i < copy.length; i++)
        if (copy[i].id == id)
          firstIndex = i;

      // determine second swap index
      if (op === MoveOperation.UP) {
        if (firstIndex <= 0) return prev;
        secondIndex = firstIndex - 1;
      } else { // MoveOperation.DOWN
        if (firstIndex >= copy.length - 1) return prev;
        secondIndex = firstIndex + 1;
      }

      // swap
      const first = copy[firstIndex];
      copy[firstIndex] = copy[secondIndex];
      copy[secondIndex] = first;

      return copy;
    });
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

  function shareButtonClicked() {
    encode({
      title: projectName,
      framerate: framerate,
      indexedInOutSequences: inOutSequences
    }).then(code => {
      setCode(() => code);
      shareModal.current?.showModal();
    });
  }

  return (
    <div className="w-screen h-screen">

      {/* Header */}
      <div id="header" className="flex justify-between flex-row items-center">
        <TimecoderLabel />
        <input onInput={(e: ChangeEvent<HTMLInputElement>) => setProjectName(() => e.target.value)} placeholder="Project name" className="text-center h-16 text-3xl w-1/2 text-white bg-zinc-900 p-2 rounded-xl drop-shadow-md focus:outline-none border border-transparent focus:border-zinc-200" type="text"></input>
        <FpsSelector onChange={(newFramerate) => setFramerate(() => newFramerate)} initialValue={initialFramerate} />
      </div>

      {/* Timecode Sequences */}
      <div className="flex flex-col items-center drop-shadow-xl mb-48">
        <div className="w-4/5 pb-8">
          {inOutSequences.map((e) =>
            <InOutSequence
              onChange={(data) => { updateInOutSequence(e.id, data) }}
              framerate={framerate}
              key={e.id}
              onDelete={() => deleteSequence(e.id)}
              onMove={(op) => moveSequence(e.id, op)}
            />
          )}
        </div>
        <Button className="w-24" onClick={addSequence}>&#xff0b;</Button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full">
        <Textbubble className="p-8 mt-0 drop-shadow-xl flex items-center tset">
          <div>
            <SmallLabel>Total</SmallLabel>
            <StaticTimecode timecode={sumTimecode.toTimecodeString()} />
          </div>

          <div className="ml-auto">
            <Button onClick={() => shareButtonClicked()}>Share & Export</Button>
          </div>
        </Textbubble>
      </div>

      <ShareModal onDownloadClick={() => downloadCSV(projectName, framerate, inOutSequences, sumTimecode)} fwd={shareModal} code={code} />
    </div>
  );
}
