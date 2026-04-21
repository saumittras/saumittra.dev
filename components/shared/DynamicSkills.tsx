"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";

export default function DynamicSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await fetchApi("/skills");
        if (data?.data) {
             setSkills(Array.isArray(data.data) ? data.data : data.data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) return null;
  if (!skills.length) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Technical Arsenal</h2>
        <p className="text-slate-500">Skills and technologies I use daily</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill, idx) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="group px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all flex flex-col min-w-[120px]"
          >
            <span className="text-sm font-medium">{skill.name}</span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: `${skill.proficiency}%` }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.5 + (idx * 0.05), duration: 1 }}
                   className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
                 />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
