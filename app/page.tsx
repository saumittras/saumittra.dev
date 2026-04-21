import Hero from "@/components/shared/Hero";
import LatestProjects from "@/components/shared/LatestProjects";
import DynamicSkills from "@/components/shared/DynamicSkills";
import RecentBlogs from "@/components/shared/RecentBlogs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <Hero />

      {/* Dynamic sections */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full space-y-32">
          <LatestProjects />
          <DynamicSkills />
          <RecentBlogs />
      </section>
    </div>
  );
}
