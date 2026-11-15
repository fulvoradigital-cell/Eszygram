"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileDown,
  GraduationCap,
  List,
  Lock,
  Menu,
  PlayCircle,
  Share2,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/providers/ToastProvider";
import type { CourseChapter, CourseLesson, CourseProgressDTO, ProductDTO } from "@/types";

interface CoursePlayerProps {
  product: ProductDTO;
  creator: {
    displayName: string;
    username: string;
    avatarUrl?: string;
  };
  initialProgress: CourseProgressDTO;
  hasAccess: boolean;
  buyerEmail?: string | null;
}

export function CoursePlayer({
  product,
  creator,
  initialProgress,
  hasAccess,
  buyerEmail,
}: CoursePlayerProps) {
  const { toast } = useToast();
  const chapters = product.courseContent || [];

  // Flatten lessons to navigate easily
  const allLessons: Array<{ chapterTitle: string; chapterIndex: number; lesson: CourseLesson }> =
    chapters.flatMap((ch, chIdx) =>
      (ch.lessons || []).map((l) => ({
        chapterTitle: ch.title,
        chapterIndex: chIdx + 1,
        lesson: l,
      }))
    );

  // Default active lesson
  const defaultLesson =
    allLessons.find((l) => l.lesson.id === initialProgress.lastAccessedLessonId) ||
    allLessons[0] ||
    null;

  const [activeItem, setActiveItem] = useState<typeof defaultLesson>(defaultLesson);
  const [completedIds, setCompletedIds] = useState<string[]>(
    initialProgress.completedLessonIds || []
  );
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Percent complete
  const totalLessons = allLessons.length;
  const completedCount = completedIds.length;
  const percentComplete =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Active lesson index in flattened list
  const currentIndex = allLessons.findIndex(
    (item) => item.lesson.id === activeItem?.lesson.id
  );
  const prevItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const isCurrentCompleted = activeItem
    ? completedIds.includes(activeItem.lesson.id)
    : false;

  // Toggle complete
  async function handleToggleComplete() {
    if (!activeItem || !hasAccess || !buyerEmail) return;

    const lessonId = activeItem.lesson.id;
    const nextCompleted = !isCurrentCompleted;

    // Optimistic update
    setCompletedIds((prev) =>
      nextCompleted ? [...prev, lessonId] : prev.filter((id) => id !== lessonId)
    );

    setIsUpdatingProgress(true);
    try {
      const res = await fetch("/api/buyer/course/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          lessonId,
          completed: nextCompleted,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update progress.");
      }

      toast.success(
        nextCompleted ? "Lesson Completed!" : "Lesson Marked Incomplete",
        nextCompleted
          ? `Progress: ${percentComplete}%`
          : "Updated course progress."
      );
    } catch {
      // Revert on error
      setCompletedIds((prev) =>
        !nextCompleted ? [...prev, lessonId] : prev.filter((id) => id !== lessonId)
      );
    } finally {
      setIsUpdatingProgress(false);
    }
  }

  // Helper to extract embed video URL
  function getVideoEmbedUrl(rawUrl?: string): { type: "embed" | "video"; url: string } | null {
    if (!rawUrl) return null;
    const url = rawUrl.trim();

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
      } else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split("?")[0] || "";
      }
      return videoId
        ? { type: "embed", url: `https://www.youtube.com/embed/${videoId}?rel=0` }
        : null;
    }

    // Vimeo
    if (url.includes("vimeo.com")) {
      const parts = url.split("/");
      const vimeoId = parts[parts.length - 1]?.split("?")[0];
      return vimeoId
        ? { type: "embed", url: `https://player.vimeo.com/video/${vimeoId}` }
        : null;
    }

    // Loom
    if (url.includes("loom.com/share/")) {
      const loomId = url.split("loom.com/share/")[1]?.split("?")[0];
      return loomId
        ? { type: "embed", url: `https://www.loom.com/embed/${loomId}` }
        : null;
    }

    // Direct MP4 / WebM
    return { type: "video", url };
  }

  const videoMeta = activeItem
    ? getVideoEmbedUrl(activeItem.lesson.videoUrl)
    : null;

  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#0B0B1A] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-black/70 backdrop-blur-md border-b border-slate-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-muted hover:text-navy shrink-0"
            >
              <Link href="/purchases">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>

            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-navy truncate font-display">
                {product.title}
              </h1>
              <p className="text-[11px] text-slate-muted truncate">
                by {creator.displayName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress Bar (Desktop) */}
            {hasAccess && totalLessons > 0 && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-muted">
                    {completedCount} of {totalLessons} completed ({percentComplete}%)
                  </span>
                  <div className="w-32 h-1.5 rounded-full bg-slate-border overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-brand-violet transition-all duration-300"
                      style={{ width: `${percentComplete}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Sidebar Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden h-8 px-2.5 gap-1.5 text-xs"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>Curriculum</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Video Player & Lesson Notes */}
        <div className="flex-1 space-y-6 min-w-0">
          {!hasAccess ? (
            /* Locked State */
            <Card className="p-8 sm:p-12 text-center border-slate-border bg-card shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-navy font-display">
                Course Enrollment Required
              </h2>
              <p className="text-xs sm:text-sm text-slate-muted max-w-md mx-auto">
                You do not have active access to <strong>{product.title}</strong> with this account.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="gradient" size="md">
                  <Link href={`/${creator.username}/p/${product.slug}`}>
                    <span>Enroll Now for ₹{product.priceInr}</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="md">
                  <Link href="/purchases/login">
                    <span>Log In to Access</span>
                  </Link>
                </Button>
              </div>
            </Card>
          ) : !activeItem ? (
            <Card className="p-10 text-center border-slate-border">
              <p className="text-xs text-slate-muted">
                No lessons published in this course yet.
              </p>
            </Card>
          ) : (
            <>
              {/* Video Player */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-md border border-slate-border">
                {videoMeta ? (
                  videoMeta.type === "embed" ? (
                    <iframe
                      src={videoMeta.url}
                      title={activeItem.lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      src={videoMeta.url}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-violet/20 to-indigo-900/40 text-white p-6 text-center">
                    <BookOpen className="w-12 h-12 text-brand-violet" />
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-display">
                        Reading &amp; Resource Lesson
                      </h3>
                      <p className="text-xs opacity-75 mt-1">
                        Read the lesson notes and download attached resources below.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Controls & Completion */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-slate-border">
                <div>
                  <span className="text-[11px] font-bold text-brand-violet uppercase tracking-wider">
                    Chapter {activeItem.chapterIndex}: {activeItem.chapterTitle}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-navy font-display mt-0.5">
                    {activeItem.lesson.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant={isCurrentCompleted ? "outline" : "gradient"}
                    size="sm"
                    disabled={isUpdatingProgress}
                    onClick={handleToggleComplete}
                    className={`gap-1.5 text-xs font-bold w-full sm:w-auto ${
                      isCurrentCompleted
                        ? "text-emerald-600 border-emerald-300 dark:border-emerald-800"
                        : ""
                    }`}
                  >
                    {isCurrentCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Mark as Complete</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Navigation Between Lessons */}
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevItem}
                  onClick={() => prevItem && setActiveItem(prevItem)}
                  className="gap-1.5 text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous Lesson</span>
                  <span className="sm:hidden">Prev</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!nextItem}
                  onClick={() => nextItem && setActiveItem(nextItem)}
                  className="gap-1.5 text-xs"
                >
                  <span className="hidden sm:inline">Next Lesson</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Lesson Notes & Description */}
              <Card className="p-6 border-slate-border space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-muted font-display">
                  Lesson Notes &amp; Overview
                </h3>
                <div className="text-sm leading-relaxed text-slate-text whitespace-pre-line">
                  {activeItem.lesson.notes ||
                    "No additional notes provided for this lesson."}
                </div>
              </Card>

              {/* Attachments (if any) */}
              {activeItem.lesson.attachments &&
                activeItem.lesson.attachments.length > 0 && (
                  <Card className="p-6 border-slate-border space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-muted font-display">
                      Lesson Downloads &amp; Attachments
                    </h3>
                    <div className="space-y-2">
                      {activeItem.lesson.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-subtle flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-navy truncate">
                            {att.name}
                          </span>
                          <span className="text-[11px] text-slate-muted">
                            {Math.round(att.size / 1024)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
            </>
          )}
        </div>

        {/* Right / Sidebar: Chapters & Lessons List */}
        <div
          className={`lg:w-80 shrink-0 ${
            mobileSidebarOpen
              ? "fixed inset-0 z-50 bg-black/50 p-4 flex justify-end"
              : "hidden lg:block"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileSidebarOpen(false);
          }}
        >
          <Card className="w-full max-w-sm lg:max-w-none h-full max-h-[85vh] lg:max-h-[calc(100vh-100px)] lg:sticky lg:top-20 flex flex-col border-slate-border bg-card shadow-sm overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-border flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy font-display">
                  Course Content
                </h3>
                <p className="text-[11px] text-slate-muted mt-0.5">
                  {totalLessons} lessons • {completedCount} completed
                </p>
              </div>

              {mobileSidebarOpen && (
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="lg:hidden text-slate-muted hover:text-navy"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Chapters & Lessons Accordion List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-border">
              {chapters.map((chapter, cIdx) => (
                <div key={chapter.id} className="py-2">
                  <div className="px-4 py-1.5 text-[11px] font-bold text-slate-muted uppercase tracking-wider">
                    Chapter {cIdx + 1}: {chapter.title}
                  </div>

                  <div className="space-y-0.5 mt-1">
                    {(chapter.lessons || []).map((lesson, lIdx) => {
                      const isSelected = activeItem?.lesson.id === lesson.id;
                      const isCompleted = completedIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            setActiveItem({
                              chapterTitle: chapter.title,
                              chapterIndex: cIdx + 1,
                              lesson,
                            });
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs transition-colors flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-brand-violet/10 text-brand-violet font-bold border-l-4 border-brand-violet"
                              : "hover:bg-slate-subtle text-slate-text font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <span className="shrink-0 text-slate-muted font-mono text-[11px]">
                              {cIdx + 1}.{lIdx + 1}
                            </span>
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 text-slate-muted">
                            {lesson.duration && (
                              <span className="font-mono text-[10px]">
                                {lesson.duration}
                              </span>
                            )}
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <PlayCircle className="w-3.5 h-3.5 opacity-60" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
