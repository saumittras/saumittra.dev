"use client";

import { useEffect, useState, use } from "react";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Loader2, User } from "lucide-react";

// For Next.js App Router dynamic params with TypeScript
export default function BlogPostPage( props: { params: Promise<{ slug: string }> } ) {
  const params = use(props.params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Assume API has a way to fetch by slug or ID
        const { data, error: apiError } = await fetchApi(`/blogPosts/${params.slug}`);
        if (apiError) throw new Error(apiError);
        
        // If the backend doesn't support fetching by slug natively, 
        // fallback might be needed but assuming standard REST implementation
        if (data?.data) {
           setPost(data.data);
        } else {
           throw new Error("Post not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-6">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <p className="text-slate-500 mb-8">{error}</p>
        <Link href="/blog" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium">Back to Blog</Link>
      </div>
    );
  }

  // A very basic renderer for HTML content stored in database
  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
         <Link href="/blog" className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-600 mb-12 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">All Articles</span>
         </Link>

         <header className="space-y-6 mb-12">
            <div className="flex items-center space-x-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
               <span className="text-blue-600">{post.category}</span>
               <span>•</span>
               <span className="flex items-center space-x-1"><Calendar size={16}/> <span>{new Date(post.createdAt).toLocaleDateString()}</span></span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">{post.title}</h1>
            
            <div className="flex items-center space-x-3 pt-6 border-t border-slate-200 dark:border-slate-800">
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                  <User size={24} />
               </div>
               <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Saumittra</p>
                  <p className="text-sm text-slate-500">Author</p>
               </div>
            </div>
         </header>

         {post.imageUrl && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative w-full aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl"
            >
               <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
            </motion.div>
         )}

         {/* Note: In production you should sanitize HTML before using dangerouslySetInnerHTML */}
         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500"
            dangerouslySetInnerHTML={{ __html: post.content }}
         />
      </div>
    </article>
  );
}
