"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LatestProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await fetchApi("/projects?limit=3&featured=true");
        if (data?.data) {
             setProjects(Array.isArray(data.data) ? data.data.slice(0,3) : data.data.data?.slice(0,3) || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-slate-400">Loading projects...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
          <p className="text-slate-500">Some of my recent work</p>
        </div>
        <Link href="/projects" className="text-blue-600 hover:text-blue-700 hidden sm:flex items-center space-x-1 font-medium pb-1">
          <span>View All</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-blue-500/50 transition-all cursor-pointer"
          >
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center p-6 text-slate-400">
               {/* Replace with actual image later */}
               {project.imageUrl ? (
                   <Image src={project.imageUrl} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
               ) : (
                 <span className="text-xl font-bold bg-linear-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                   {project.title.substring(0, 2).toUpperCase()}
                 </span>
               )}
            </div>
            <div className="p-6">
              <span className="text-xs font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-3 inline-block">
                {project.category}
              </span>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4">{project.description || "No description available."}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.techStack?.slice(0, 3).map((tech: string) => (
                  <span key={tech} className="text-xs text-slate-500 dark:text-slate-400">#{tech}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
            No projects available right now.
          </div>
        )}
      </div>
      
      <Link href="/projects" className="sm:hidden text-blue-600 flex items-center justify-center space-x-1 font-medium w-full py-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
        <span>View All Projects</span>
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
