import Bento from "@/components/Bento";
import Contact from "@/components/Contact";
import FilamentScene from "@/components/FilamentScene";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import PageMotion from "@/components/PageMotion";
import Process from "@/components/Process";
import SmoothScroll from "@/components/SmoothScroll";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <FilamentScene />
      <SmoothScroll />
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <Work />
        <Process />
        <Bento />
        <Contact />
      </main>
      <div aria-hidden className="grain" />
      <PageMotion />
    </>
  );
}
