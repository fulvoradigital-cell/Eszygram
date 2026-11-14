"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Mail, MessageSquare, Send } from "lucide-react";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg(
          json.data?.message ||
            "Thank you! Your message has been received. Our team will get back to you within 24 hours."
        );
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMsg(
          json.error?.message || "Something went wrong. Please check your fields."
        );
      }
    } catch {
      setErrorMsg("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="primary" dot>
              Get In Touch
            </Badge>
            <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
              Contact our creator team
            </h1>
            <p className="text-fluid-base text-slate-600 dark:text-slate-300">
              Have questions about UPI payouts, Instagram API setup, or volume
              pricing? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Details & Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card dark:border-canvas-darkBorder dark:bg-canvas-darkCard space-y-6">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  Support Channels
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Email Support
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        hello@ezsygram.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-50 text-mint-600 dark:bg-mint-900/40 dark:text-mint-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Response Time
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        Under 24 hours · Mon - Sat (IST)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral-50 text-coral-600 dark:bg-coral-700/20 dark:text-coral-300">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Priority Creator Support
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        Available on Pro &amp; Business plans
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-10 shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
                {successMsg ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-50 text-mint-600 dark:bg-mint-900/40 dark:text-mint-300">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      Message Sent!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                      {successMsg}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSuccessMsg(null)}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-700/50 dark:bg-rose-900/20 dark:text-rose-300">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        placeholder="Aarav Sharma"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="aarav@creator.in"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Subject"
                      placeholder="Question about Instagram Automation"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />

                    <Textarea
                      label="Your Message"
                      placeholder="Tell us what you are looking to build or sell..."
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      size="lg"
                      isLoading={loading}
                      rightIcon={<Send className="h-4 w-4" />}
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

