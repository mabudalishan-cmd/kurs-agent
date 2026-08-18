"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type TeamMember = {
  id: string;
  photo_url: string | null;
  role: string;
  first_name: string;
  last_name: string;
  first_name_en: string | null;
  last_name_en: string | null;
  bio_en: string | null;
  first_name_ru: string | null;
  last_name_ru: string | null;
  bio_ru: string | null;
  bio: string | null;
  email: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
};

export default function TeamSection() {
  const { lang } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function fetchMembers() {
      const { data } = await supabase
        .from("team_members")
        .select(
          "id, photo_url, role, first_name, last_name, first_name_en, last_name_en, bio_en, first_name_ru, last_name_ru, bio_ru, bio, email, linkedin_url, facebook_url, instagram_url"
        )
        .order("display_order", { ascending: true });

      if (data) setMembers(data as TeamMember[]);
    }
    fetchMembers();
  }, []);

  if (members.length === 0) return null;

  const getLocalizedFirstName = (m: TeamMember) => {
    if (lang === "ru" && m.first_name_ru?.trim()) return m.first_name_ru;
    return m.first_name;
  };

  const getLocalizedLastName = (m: TeamMember) => {
    if (lang === "ru" && m.last_name_ru?.trim()) return m.last_name_ru;
    return m.last_name;
  };

  const getLocalizedBio = (m: TeamMember) => {
    if (lang === "ru" && m.bio_ru?.trim()) return m.bio_ru;
    return m.bio || "";
  };

  return (
    <div className="mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          {lang === "ru" ? (
            <>
              Наша <span className="gradient-text">команда</span>
            </>
          ) : (
            <>
              Bizim <span className="gradient-text">komandamız</span>
            </>
          )}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="card-glow group flex flex-col items-center overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center transition-all hover:border-violet-500/40"
          >
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10">
              {member.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo_url}
                  alt={member.first_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-[var(--accent)]">
                  {member.first_name.charAt(0)}
                  {member.last_name.charAt(0)}
                </span>
              )}
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              {getLocalizedFirstName(member)} {getLocalizedLastName(member)}
            </h3>

            <p className="mt-1 text-sm font-medium text-[var(--accent)]">
              {member.role}
            </p>

            {getLocalizedBio(member) && (
              <p className="mt-3 text-sm text-[var(--muted)]">
                {getLocalizedBio(member)}
              </p>
            )}

            <div className="mt-4 flex items-center justify-center gap-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--muted)] transition-colors hover:border-violet-500/40 hover:text-[var(--accent)]"
                  title="Email"
                >
                  <Mail size={14} />
                </a>
              )}
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--muted)] transition-colors hover:border-violet-500/40 hover:text-[var(--accent)]"
                  title="LinkedIn"
                >
                  <Globe size={14} />
                </a>
              )}
              {member.facebook_url && (
                <a
                  href={member.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--muted)] transition-colors hover:border-violet-500/40 hover:text-[var(--accent)]"
                  title="Facebook"
                >
                  <Globe size={14} />
                </a>
              )}
              {member.instagram_url && (
                <a
                  href={member.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--muted)] transition-colors hover:border-violet-500/40 hover:text-[var(--accent)]"
                  title="Instagram"
                >
                  <Globe size={14} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}