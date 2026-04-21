"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Loader2, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await fetchApi("/blogPosts?published=true");
        if (data?.data) {
             setBlogs(Array.isArray(data.data) ? data.data : data.data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
          >
            Read <span className="text-blue-600">My Blog</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 dark:text-slate-400"
          >
            Insights, tutorials, and my journey in software development.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`}>
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.1 }}
                   className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all"
                 >
                   {blog.imageUrl ? (
                      <div className="relative h-56 overflow-hidden">
                        <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                      </div>
                   ) : (
                      <div className="h-48 bg-slate-100 dark:bg-slate-800 p-6 flex items-center justify-center">
                         <span className="text-4xl text-slate-300 dark:text-slate-700 font-bold tracking-tighter mix-blend-overlay">BLOG</span>
                      </div>
                   )}
                   <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                          <div className="flex items-center space-x-3 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              <span className="text-blue-600 dark:text-blue-400">{blog.category}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1"><Calendar size={14}/> <span>{new Date(blog.createdAt).toLocaleDateString()}</span></span>
                          </div>
                          <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h3>
                          <p className="text-slate-500 mb-6 line-clamp-3">{blog.excerpt || "Click to read the full article..."}</p>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium text-sm mt-auto">
                          <span>Read Article</span>
                          <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                   </div>
                 </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
