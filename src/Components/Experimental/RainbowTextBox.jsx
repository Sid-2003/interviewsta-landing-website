import { useState, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { EllipsisVertical } from "lucide-react";

export default function RainbowTextbox() {
  const [active, setActive] = useState(false);
  const [isStreaming,setIsStreaming] = useState(true);
  useEffect(() => {
    const p = async () => {
      await new Promise(resolve => setTimeout(resolve,2000));
      setIsStreaming(false);
    }
    p();
  },[])
  const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ratione laboriosam et, repellendus illum sed earum asperiores ad odit inventore possimus ipsam ut optio iure fugiat nostrum numquam maxime vel!" + 
"Qui reiciendis alias hic dignissimos quibusdam, fuga rem vitae nemo dolorum deleniti necessitatibus ab error illum nostrum, iste eos, ratione facere! Consectetur, tenetur commodi corporis numquam sed quis natus nulla." +
"Laudantium corrupti ipsa illum impedit, adipisci debitis voluptatibus placeat ab nihil vel, dolorum officiis sit aliquid quas. Quis, beatae consequatur dolores magnam provident sit, hic enim architecto minus quod sapiente!";

  return (
    <div className="min-h-40 flex items-center justify-center p-8">
      <div className="relative">
        {/* Animated ring layer */}
        <div
          className={[
            "pointer-events-none absolute -inset-1 rounded-xl",
            "opacity-0 transition-opacity duration-300",
            active ? "opacity-100" : "opacity-0",
            // rotating conic gradient ring
            "after:absolute after:-inset-39",
            "after:bg-[conic-gradient(from_0deg,theme(colors.red.500),theme(colors.orange.500),theme(colors.yellow.400),theme(colors.green.500),theme(colors.blue.500),theme(colors.indigo.500),theme(colors.purple.500),theme(colors.red.500))]",
            "after:animate-rainbow-spin",
            // mask so only the border shows (hole for the inner box)
            "mask-[linear-gradient(#fff_0_0)]",
            "p-[2px]",
          ].join(" ")}
        />

        {/* Text input box */}
        <div className="relative rounded-xl bg-white shadow border border-slate-200">
          <input
            type="text"
            placeholder="Type here…"
            className="w-80 rounded-xl px-4 py-3 outline-none bg-transparent"
          />
        </div>
      </div>

      <button
        onClick={() => setActive((v) => !v)}
        className="ml-4 rounded-lg px-3 py-2 text-sm bg-slate-900 text-white bg-testpink"
      >
        Toggle ring
      </button>
      <MessageBubble text={lorem} isStreaming={isStreaming}/>
    </div>
  );
}


