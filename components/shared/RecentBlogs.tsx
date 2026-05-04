"use client";

import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RecentBlogs() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await fetchApi("/blog-posts?limit=3&published=true");
        if (data?.data) {
          setBlogs(
            Array.isArray(data.data)
              ? data.data.slice(0, 3)
              : data.data.data?.slice(0, 3) || [],
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="h-40 flex items-center justify-center text-slate-400">
        Loading blogs...
      </div>
    );
  if (!blogs.length) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Thoughts & Writings</h2>
          <p className="text-slate-500">Latest from my blog</p>
        </div>
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-700 hidden sm:flex items-center space-x-1 font-medium pb-1"
        >
          <span>Read All</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog, idx) => (
          <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all"
            >
              {blog.imageUrl ? (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="h-40 bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 flex flex-col justify-between">
                  <span className="text-blue-600 dark:text-blue-400 p-3 bg-white dark:bg-slate-800 rounded-2xl w-max shadow-xs">
                    <PenIcon size={24} />
                  </span>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3 text-xs text-slate-500">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      {blog.category}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />{" "}
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                    {blog.excerpt ||
                      "Read more about this topic inside the post..."}
                  </p>
                </div>
                <div className="flex items-center text-blue-600 font-medium text-sm mt-auto">
                  <span>Read Article</span>
                  <ArrowUpRight
                    size={16}
                    className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <Link
        href="/blog"
        className="sm:hidden text-blue-600 flex items-center justify-center space-x-1 font-medium w-full py-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl"
      >
        <span>View All Articles</span>
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}

function PenIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
