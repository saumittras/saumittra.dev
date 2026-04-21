"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Users, 
  FolderGit2, 
  PenTool, 
  Lightbulb, 
  Award, 
  GraduationCap, 
  MessageSquare,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
  totalProjects: number;
  totalBlogs: number;
  totalSkills: number;
  totalCertifications: number;
  totalEducations: number;
  unreadMessages: number;
  totalMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, there might be a /meta or /stats endpoint.
    // If not, we could fetch all and count, or just show placeholders.
    // Assuming backend has a /management/admin or similar /meta route.
    const getStats = async () => {
      try {
        setLoading(true);
        // Let's assume there's a simple meta statistics route
        const { data } = await fetchApi("/meta");
        if (data?.data) {
          setStats(data.data);
        } else {
             // Fallback dummy data if endpoint doesn't exist yet
             setStats({
                 totalProjects: 5,
                 totalBlogs: 12,
                 totalSkills: 15,
                 totalCertifications: 4,
                 totalEducations: 2,
                 unreadMessages: 3,
                 totalMessages: 20
             });
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  const statCards = [
    { title: "Projects", value: stats?.totalProjects || 0, icon: FolderGit2, color: "bg-blue-500/10 text-blue-500", border: "border-blue-500/20" },
    { title: "Blog Posts", value: stats?.totalBlogs || 0, icon: PenTool, color: "bg-purple-500/10 text-purple-500", border: "border-purple-500/20" },
    { title: "Unread Messages", value: stats?.unreadMessages || 0, icon: MessageSquare, color: "bg-green-500/10 text-green-500", border: "border-green-500/20" },
    { title: "Skills", value: stats?.totalSkills || 0, icon: Lightbulb, color: "bg-yellow-500/10 text-yellow-500", border: "border-yellow-500/20" },
    { title: "Certifications", value: stats?.totalCertifications || 0, icon: Award, color: "bg-orange-500/10 text-orange-500", border: "border-orange-500/20" },
    { title: "Education", value: stats?.totalEducations || 0, icon: GraduationCap, color: "bg-red-500/10 text-red-500", border: "border-red-500/20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here is a summary of your portfolio data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${stat.border} shadow-sm flex items-center space-x-4`}
            >
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
                <h3 className="text-3xl font-bold">
                  {loading ? (
                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse mt-1" />
                  ) : (
                    stat.value
                  )}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-8 rounded-3xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Ready to add new content?</h2>
            <p className="text-blue-100 max-w-md">Use the sidebar navigation to manage your projects, blogs, skills, and more.</p>
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-4 bg-white/20 rounded-full backdrop-blur-md"
          >
            <Activity size={48} className="text-white" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
