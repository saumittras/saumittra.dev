"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 font-medium text-sm inline-block"
            >
              Available for Hire
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Crafting <br />
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Digital Experiences
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              I am a Full-Stack Developer passionate about building
              high-performance, responsive web applications that solve
              real-world problems.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:shadow-xl hover:shadow-blue-500/20 transition-all flex items-center space-x-2"
            >
              <span>Hire Me</span>
              <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center space-x-2">
              <Download size={20} />
              <span>Download CV</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative hidden lg:block"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-3xl rotate-6 opacity-10" />
            <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl -rotate-3 opacity-10" />
            <div className="relative h-full w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 flex items-center justify-center">
              <span className="text-slate-300 dark:text-slate-600 text-9xl font-bold">
                JD
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
