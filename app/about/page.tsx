"use client";

import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Award, Calendar, GraduationCap, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [education, setEducation] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eduRes, certRes] = await Promise.all([
          fetchApi("/educations"),
          fetchApi("/certifications"),
        ]);

        if (eduRes.data?.data) {
          setEducation(
            Array.isArray(eduRes.data.data)
              ? eduRes.data.data
              : eduRes.data.data.data || [],
          );
        }
        if (certRes.data?.data) {
          setCertifications(
            Array.isArray(certRes.data.data)
              ? certRes.data.data
              : certRes.data.data.data || [],
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Intro */}
        <section className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
          >
            About <span className="text-blue-600">Me</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed"
          >
            I'm a dedicated Full-Stack Developer focused on building robust and
            scalable web applications. My journey involves continuous learning
            to stay at the forefront of modern technologies.
          </motion.p>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-16">
            {/* Education Timeline */}
            <section>
              <div className="flex items-center space-x-3 mb-10">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <GraduationCap size={28} />
                </div>
                <h2 className="text-3xl font-bold">Education</h2>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                {education.map((edu, idx) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xs z-10">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow">
                      <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium mb-3">
                        <Calendar size={14} />
                        <span>
                          {edu.startYear} - {edu.endYear || "Present"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                        {edu.institution}
                      </p>
                      {edu.description && (
                        <p className="text-slate-500 text-sm">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Certifications & Training */}
            <section>
              <div className="flex items-center space-x-3 mb-10">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl">
                  <Award size={28} />
                </div>
                <h2 className="text-3xl font-bold">Certifications</h2>
              </div>

              <div className="space-y-6">
                {certifications.map((cert, idx) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/30 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">{cert.title}</h3>
                        <p className="text-orange-600 dark:text-orange-400 font-medium">
                          {cert.provider}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500">
                        {cert.year}
                      </span>
                    </div>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Certificate
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
