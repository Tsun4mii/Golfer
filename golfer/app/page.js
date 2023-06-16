import Image from "next/image";
import Settings from "./components/Settings";

export default function Home() {
  return (
    <main className="">
      <div className="flex gap-4">
        <Settings />
      </div>
    </main>
  );
}
