"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Compass size={36} className="text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-xl font-semibold text-foreground">Page not found</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Looks like you took a wrong turn in your learning journey. The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row justify-center gap-3"
        >
          <Link href="/" className="btn-primary px-6 py-2.5 rounded-xl text-sm justify-center">
            <Home size={14} />
            Go Home
          </Link>
          <Link href="/roadmap" className="btn-secondary px-6 py-2.5 rounded-xl text-sm justify-center">
            <Search size={14} />
            Browse Roadmaps
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-muted-foreground"
        >
          Every developer gets lost sometimes. Just pick another path 🚀
        </motion.p>
      </div>
    </div>
  );
}
