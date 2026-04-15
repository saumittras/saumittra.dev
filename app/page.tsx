import Hero from "@/components/shared/Hero";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      {/* Dynamic sections can be added here */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for Dynamic Projects/Skills */}
          <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center min-h-75 text-slate-400">
            Latest Projects Section
          </div>
          <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center min-h-75 text-slate-400">
            Dynamic Skills Section
          </div>
          <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center min-h-75 text-slate-400">
            Recent Blog Posts
          </div>
        </div>
      </section>
    </div>
  );
}
