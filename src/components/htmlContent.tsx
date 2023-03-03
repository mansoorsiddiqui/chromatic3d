import { store } from "App";
// import { useEffect } from "react";

export default function HTMLContent() {
  const scrollProgress = store((state) => state.scrollProgress);
  const scroll = store((state) => state.scrollObject);
  const currentPage = store((state) => state.currentPage);
  const direction = store((state) => state.direction);
  // useEffect(() => {
  //   console.log(currentPage);
  // }, [currentPage]);
  return (
    <div className="pointer-events-none">
      <div
        style={{ opacity: currentPage === 1 ? "100" : "0" }}
        className="absolute bottom-60 left-60 flex flex-col justify-start w-screen mx-auto max-w-[1050px] transition-opacity ease-in-out duration-700"
      >
        <div className="border-b border-black w-32 translate-x-80 translate-y-5" />
        <h2 className="w-[400px] mt-30 text-5xl">THE REACTION</h2>
        <p className="w-[300px]">
          3D print industrial-strength elastomers anywhere, on anything — one
          part or one million
        </p>
      </div>
      <div
        style={{ opacity: currentPage === 2 ? "100" : "0" }}
        className="absolute bottom-60 right-60 flex flex-col justify-start items-end w-screen mx-auto text-right max-w-[1050px] transition-opacity ease-in-out duration-700"
      >
        <div className="border-b border-black w-32 -translate-x-80 translate-y-5" />
        <p className="w-[320px]">
          The liquid ingredients react as they travel out of our proprietary
          print heads.
        </p>
      </div>
      <div
        style={{ opacity: currentPage === 3 ? "100" : "0" }}
        className="absolute bottom-60 left-60 flex flex-col justify-start items-start w-screen mx-auto max-w-[1050px] transition-opacity ease-in-out duration-700"
      >
        <div className="border-b border-black w-32 translate-x-80 translate-y-5" />
        <p className="w-[320px]">
          We can print polymers and soft goods for any application ranging from
          industrials to aerospace
        </p>
      </div>
      <div
        style={{ opacity: currentPage === 4 ? "100" : "0" }}
        className="absolute bottom-60 right-60 flex flex-col justify-start items-end w-screen mx-auto text-right max-w-[1050px] transition-opacity ease-in-out duration-700"
      >
        <div className="border-b border-black w-32 -translate-x-80 translate-y-5" />
        <h2 className="w-[400px] mt-30 text-5xl">THE PRINT</h2>
        <p className="w-[380px]">
          Printed freeform on any substrate, and with properties that can vary
          across the print, we print the best materials made from a
          multiple-part mixture. Create with control: Skip the injection molds.
          With RX-AM you reduce turnaround times, iterate quickly and adjust
          volumes as needed.
        </p>
      </div>
    </div>
  );
}
