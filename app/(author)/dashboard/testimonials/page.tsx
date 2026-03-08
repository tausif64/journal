"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type UserTestimonial = {
  id: string;
  quote: string;
  designation: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

type UserTestimonialsResponse = {
  success: boolean;
  data?: UserTestimonial[];
  error?: string;
};

export default function UserTestimonialsPage() {
  const qc = useQueryClient();
  const [quote, setQuote] = useState("");
  const [designation, setDesignation] = useState("");

  const { data = [], isLoading } = useQuery<UserTestimonial[]>({
    queryKey: ["user-testimonials"],
    queryFn: async () => {
      const res = await apiGet<UserTestimonialsResponse>("/api/testimonials/user");
      return res.data ?? [];
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () =>
      apiPost("/api/testimonials/user", {
        quote: quote.trim(),
        designation: designation.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Testimonial submitted for admin review");
      setQuote("");
      setDesignation("");
      void qc.invalidateQueries({ queryKey: ["user-testimonials"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Submit Review</h1>
        <p className="text-sm text-muted-foreground">
          Share your testimonial. New submissions start in pending status and
          appear on website after admin approval.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Testimonial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Designation <span className="text-destructive">*</span>
            </p>
            <Input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Assistant Professor, Research Scholar, etc."
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Review Quote <span className="text-destructive">*</span>
            </p>
            <Textarea
              rows={5}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Write your publication experience..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading submissions...</p>
          ) : data.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have not submitted any testimonial yet.
            </p>
          ) : (
            <div className="space-y-3">
              {data.map((item) => (
                <div key={item.id} className="rounded-md border p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge variant="outline">{item.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{item.designation ?? "-"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.quote}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
