'use client';

import Button from "@/components/Primitives/Button";
import FpsSelector, { FpsSelectorFwd } from "@/components/FpsSelector/FpsSelector";
import InOutSequence, { InOutSequence as InOutSequenceType, MoveOperation } from "@/components/Timecodes/InOutSequence";
import Textbubble from "@/components/Primitives/Textbubble";
import TimecoderLabel from "@/components/TimecoderLabel";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Framerate, initialFramerate } from "@/ts/framerate";
import StaticTimecode from "@/components/Timecodes/StaticTimecode/StaticTimecode";
import { Timecode } from "@/ts/timecode";
import { encode, downloadCSV, decode } from "@/ts/export";
import SmallLabel from "@/components/Primitives/SmallLabel";
import { useRouter, useSearchParams } from "next/navigation";
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
  const encodedData = query.get('d');
  const fpsSelectorFwd = useRef<FpsSelectorFwd>(null);
  const projectNameRef = useRef<HTMLInputElement>(null);
  const shareModal = useRef<ModalFwd>(null);

  const router = useRouter();

  useEffect(() => {
    console.log("on Init: localstorage: " + window.localStorage.getItem("a"));

    init();
  }, []);

  useEffect(() => {
    calculateSum();

    //saveToLocalStorage();

    // window.localStorage.setItem("a", JSON.stringify(inOutSequences));
    //   console.log("Saved to localstorage");
    //   console.log("Cross Check: " + window.localStorage.getItem("a"));
  }, [inOutSequences]);

  useEffect(() => {
    encode({
      title: projectName,
      framerate: framerate,
      indexedInOutSequences: inOutSequences
    }).then(code => {
      localStorage.setItem("timecoder", code);
    });
  }, [inOutSequences, projectName, framerate]);

  function init() {
    if (encodedData !== null) {
      decode(encodedData)
        .then((result) => {
          loadDecodedData(result.title, result.framerate, result.indexedInOutSequences);
        })
        .catch(e => {
          loadLocalStorage();
        });
    } else {
      loadLocalStorage();
    }
  }

  function loadLocalStorage() {
    const encodedData = localStorage.getItem("timecoder");

    if (encodedData) {
      decode(encodedData)
        .then((result) => {
          loadDecodedData(result.title, result.framerate, result.indexedInOutSequences);
        })
        .catch(e => {
          loadDefault();
        });
    } else {
      loadDefault();
    }
  }

  function loadDefault() {
    if (inOutSequences.length === 0)
      addSequence();
  }

  function loadDecodedData(title: string, framerate: Framerate, indexedInOutSequences: IndexedInOutSequence[]) {
    // Set title
    setProjectName(() => title);
    projectNameRef.current!.value = title;

    // Set framerate
    fpsSelectorFwd.current?.selectFramerate(framerate);
    setFramerate(() => framerate);

    // Set in out sequences
    setInOutSequences(() => indexedInOutSequences);
    // Set next id
    setNextID(() => indexedInOutSequences[indexedInOutSequences.length - 1].id + 1);

    // remove parameters
    router.replace(window.location.origin + window.location.pathname);
  }

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
      setCode(() => encodeURIComponent(code));
      shareModal.current?.showModal();
    });
  }

  return (
    <div>
      {/* Header */}
      <div id="header" className="flex justify-between flex-row items-center">
        <TimecoderLabel />
        <input
          onInput={(e: ChangeEvent<HTMLInputElement>) => setProjectName(() => e.target.value)}
          placeholder="Project name"
          className="text-center h-16 text-3xl w-1/2 text-white bg-zinc-900 p-2 rounded-xl drop-shadow-md focus:outline-none border border-transparent focus:border-zinc-200"
          type="text"
          ref={projectNameRef}>
        </input>
        <FpsSelector
          onChange={(newFramerate) => setFramerate(() => newFramerate)}
          initialValue={framerate}
          fwd={fpsSelectorFwd}
        />
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
              initialValue={e.inOutSequence}
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

      {/* ShareModal */}
      <ShareModal onDownloadClick={() => downloadCSV(projectName, framerate, inOutSequences, sumTimecode)} fwd={shareModal} code={code} />
    </div>
  );
}
