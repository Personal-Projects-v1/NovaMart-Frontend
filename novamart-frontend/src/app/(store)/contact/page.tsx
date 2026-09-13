"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/common/button";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/constants/site";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  }

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Contact Us</h1>
      <p className="mb-8 text-sm text-muted">We&apos;d love to hear from you. Reach out with any questions.</p>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-white p-6">
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 size={40} className="mb-3 text-success" />
              <h2 className="text-lg font-bold">Message Sent</h2>
              <p className="mt-1 text-sm text-muted">Thanks for reaching out — our team will respond within 24 hours.</p>
              <Button variant="outline" className="mt-5" onClick={() => setSubmitted(false)}>Send Another Message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Name</span><input {...register("name")} className="input" />{errors.name && <span className="text-xs text-brand">{errors.name.message}</span>}</label>
                <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Email</span><input {...register("email")} className="input" />{errors.email && <span className="text-xs text-brand">{errors.email.message}</span>}</label>
              </div>
              <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Subject</span><input {...register("subject")} className="input" />{errors.subject && <span className="text-xs text-brand">{errors.subject.message}</span>}</label>
              <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold">Message</span><textarea rows={5} {...register("message")} className="rounded-xl border border-border p-3 text-sm outline-none focus:border-brand" />{errors.message && <span className="text-xs text-brand">{errors.message.message}</span>}</label>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Message"}</Button>
            </form>
          )}
        </div>
        <aside className="flex h-fit flex-col gap-4 rounded-2xl bg-surface p-6 text-sm">
          <div className="flex items-center gap-2"><Mail size={16} className="text-brand" /> {SUPPORT_EMAIL}</div>
          <div className="flex items-center gap-2"><Phone size={16} className="text-brand" /> {SUPPORT_PHONE}</div>
          <div className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-brand" /> KG 7 Ave, Kigali Heights, Kigali, Rwanda</div>
        </aside>
      </div>
    </div>
  );
}
