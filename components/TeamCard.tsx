"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/CountUp";
import { satisfactionLabel } from "@/lib/satisfaction";
import { getTeamTheme } from "@/lib/teams";
import type { TeamWithMax } from "@/lib/types";

interface TeamCardProps {
  team: TeamWithMax;
  index?: number;
}

export function TeamCard({ team, index = 0 }: TeamCardProps) {
  const reduceMotion = useReducedMotion();
  const theme = getTeamTheme(team.slug);
  const label = satisfactionLabel(team.satisfaction);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 32, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        reduceMotion
          ? {}
          : {
              y: -8,
              scale: 1.02,
              boxShadow: `0 20px 40px ${theme.primary}44`,
            }
      }
      className="group relative overflow-hidden rounded-2xl border-2 border-amber-300/25 shadow-xl ring-1 ring-white/10"
      style={{
        background: `linear-gradient(145deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`,
        transformPerspective: 800,
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${theme.accent}22 50%, transparent 60%)`,
        }}
        animate={
          reduceMotion
            ? {}
            : { x: ["-100%", "200%"] }
        }
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5 }}
      />
      <motion.div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl"
        style={{ background: theme.accent }}
        animate={reduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <motion.span
              className="inline-block text-3xl"
              animate={reduceMotion ? {} : { y: [0, -5, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            >
              {theme.emoji}
            </motion.span>
            <h2 className="mt-2 text-xl font-bold text-white">{team.nameAr}</h2>
          </div>
          <motion.span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: `${theme.primary}88`, color: theme.accent }}
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: index * 0.1 + 0.2 }}
          >
            {label}
          </motion.span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <motion.div
            className="rounded-lg bg-black/25 p-3"
            whileHover={reduceMotion ? {} : { scale: 1.03 }}
          >
            <p className="text-white/60">جلدر</p>
            <p className="text-lg font-bold" style={{ color: theme.accent }}>
              <CountUp value={team.geldr} /> 🪙
            </p>
          </motion.div>
          <motion.div
            className="rounded-lg bg-black/25 p-3"
            whileHover={reduceMotion ? {} : { scale: 1.03 }}
          >
            <p className="text-white/60">الرضا</p>
            <p className="text-lg font-bold" style={{ color: theme.accent }}>
              <CountUp value={team.satisfaction} />%
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mb-4 flex flex-wrap gap-2 text-xs text-white/75"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.3 },
            },
          }}
        >
          {[
            { icon: "🏠", val: team.houses },
            { icon: "🛒", val: team.markets },
            { icon: "🌱", val: team.crops },
          ].map((chip) => (
            <motion.span
              key={chip.icon}
              className="rounded-md bg-black/20 px-2 py-1"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={reduceMotion ? {} : { y: -2 }}
            >
              {chip.icon} {chip.val}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          whileHover={reduceMotion ? {} : { scale: 1.02 }}
          whileTap={reduceMotion ? {} : { scale: 0.98 }}
        >
          <Link
            href={`/teams/${team.slug}`}
            className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl py-2.5 text-sm font-semibold"
            style={{
              background: theme.primary,
              color: "#fff",
            }}
          >
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">ادخل القرية ←</span>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}
