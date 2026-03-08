"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { apiGet } from "@/lib/api";
import type {
  ArticleCreateDTO,
  ApiResponse,
  UserLookupDTO,
} from "@/types/dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useUserArticles, useUserSearchSuggestions } from "@/hooks/use-user";
import { toast } from "sonner";

/* ----------------------------- */
/* Types & Zod schema            */
/* ----------------------------- */

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title is too long"),
  abstract: z
    .string()
    .min(50, "Abstract must be at least 50 characters")
    .max(5000, "Abstract is too long"),
  fileUrl: z
    .string()
    .min(1, "PDF file is required")
    .regex(/^\/uploads\/articles\/.+\.pdf$/i, "Upload a PDF file first"),
  keywords: z.string().optional().nullable(),
  // we store the selected author emails here for validation
  authorEmails: z
    .array(z.string().email("Invalid email format"))
    .min(1, "At least 1 author is required")
    .max(4, "Maximum 4 authors allowed"),
});

type FormValues = z.infer<typeof formSchema>;

/* ----------------------------- */
/* Component                     */
/* ----------------------------- */

export default function SubmitArticleForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [authorSearchEmail, setAuthorSearchEmail] = useState("");
  const [authorSearchError, setAuthorSearchError] = useState<string | null>(
    null
  );
  const [selectedAuthors, setSelectedAuthors] = useState<UserLookupDTO[]>([]);
  const [authorCount, setAuthorCount] = useState<1 | 2 | 3 | 4>(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [initializedMainAuthor, setInitializedMainAuthor] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);

  const { submitArticle } = useUserArticles();

  const { data: session } = authClient.useSession();
  const { suggestions, isLoading: suggestionLoading } =
    useUserSearchSuggestions(authorSearchEmail);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      abstract: "",
      fileUrl: "",
      keywords: "",
      authorEmails: [],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setValue,
    getValues,
    watch,
  } = form;
  const uploadedFileUrl = watch("fileUrl");

  /* ----------------------------- */
  /* Auto-add main submitting user */
  /* ----------------------------- */

  useEffect(() => {
    if (initializedMainAuthor) return;
    if (!session?.user?.email) return;

    const mainUser: UserLookupDTO = {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email,
    };

    setSelectedAuthors((prev) => {
      // avoid duplicates
      if (
        prev.some((a) => a.email.toLowerCase() === mainUser.email.toLowerCase())
      ) {
        return prev;
      }
      return [mainUser, ...prev].slice(0, 4);
    });

    const current = getValues("authorEmails");
    if (
      !current.some((e) => e.toLowerCase() === mainUser.email.toLowerCase())
    ) {
      setValue("authorEmails", [mainUser.email, ...current].slice(0, 4), {
        shouldValidate: true,
      });
    }

    setAuthorCount(1);
    setInitializedMainAuthor(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, initializedMainAuthor]);

  /* ----------------------------- */
  /* Select suggestion              */
  /* ----------------------------- */

  function handleSelectSuggestion(user: UserLookupDTO) {
    setAuthorSearchError(null);

    // limit to 4 authors total
    if (selectedAuthors.length >= 4) {
      setAuthorSearchError("You cannot add more than 4 authors.");
      return;
    }

    // avoid duplicates
    if (
      selectedAuthors.some(
        (a) => a.email.toLowerCase() === user.email.toLowerCase()
      )
    ) {
      setAuthorSearchError("This author is already added.");
      return;
    }

    setSelectedAuthors((prev) => [...prev, user]);

    const currentEmails = getValues("authorEmails");
    if (
      !currentEmails.some((e) => e.toLowerCase() === user.email.toLowerCase())
    ) {
      setValue("authorEmails", [...currentEmails, user.email], {
        shouldValidate: true,
      });
    }

    const newCount = Math.max(
      1,
      Math.min(4, (selectedAuthors.length + 1) as 1 | 2 | 3 | 4)
    );
    setAuthorCount(newCount as 1 | 2 | 3 | 4);

    setAuthorSearchEmail("");
  }

  async function handleAddAuthor() {
    setAuthorSearchError(null);
    const emailRaw = authorSearchEmail.trim().toLowerCase();

    if (!emailRaw) {
      setAuthorSearchError("Please enter an email.");
      return;
    }

    // simple client-side email format check first
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
      setAuthorSearchError("Please enter a valid email address.");
      return;
    }

    // no duplicates
    if (selectedAuthors.some((a) => a.email.toLowerCase() === emailRaw)) {
      setAuthorSearchError("This author is already added.");
      return;
    }

    // limit to 4 authors
    if (selectedAuthors.length >= 4) {
      setAuthorSearchError("You cannot add more than 4 authors.");
      return;
    }

    try {
      setSearchLoading(true);

      // Fallback exact lookup endpoint:
      // GET /api/users/by-email?email=...
      const res = await apiGet<ApiResponse<UserLookupDTO>>(
        `/api/articles/user/by-email?email=${encodeURIComponent(emailRaw)}`
      );

      if (!res.success || !res.data) {
        setAuthorSearchError(
          res.success ? "User not found." : res.error || "Author lookup failed."
        );
        return;
      }

      handleSelectSuggestion(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthorSearchError(err.message);
      } else {
        setAuthorSearchError("Something went wrong while searching.");
      }
    } finally {
      setSearchLoading(false);
    }
  }

  function handleRemoveAuthor(email: string) {
    // Don't allow removing main (submitting) author
    const mainEmail = session?.user?.email?.toLowerCase();
    if (mainEmail && email.toLowerCase() === mainEmail) {
      return;
    }

    const filtered = selectedAuthors.filter(
      (a) => a.email.toLowerCase() !== email.toLowerCase()
    );
    setSelectedAuthors(filtered);

    const updatedEmails = getValues("authorEmails").filter(
      (e) => e.toLowerCase() !== email.toLowerCase()
    ) as string[];

    setValue("authorEmails", updatedEmails, { shouldValidate: true });

    const newCount = Math.max(1, Math.min(4, filtered.length || 1));
    setAuthorCount(newCount as 1 | 2 | 3 | 4);
  }

  function handleAuthorCountChange(value: string) {
    const num = Number(value) as 1 | 2 | 3 | 4;
    setAuthorCount(num);

    // If count is reduced below selected authors, trim the list
    if (selectedAuthors.length > num) {
      const trimmed = selectedAuthors.slice(0, num);
      setSelectedAuthors(trimmed);
      setValue(
        "authorEmails",
        trimmed.map((a) => a.email),
        { shouldValidate: true }
      );
    }
  }

  async function handlePdfUpload(file: File) {
    setPdfUploading(true);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/articles/user/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const json = (await res.json()) as {
        success: boolean;
        data?: { url: string };
        error?: string;
      };

      if (!res.ok || !json.success || !json.data?.url) {
        throw new Error(json.error ?? "Failed to upload PDF");
      }

      setValue("fileUrl", json.data.url, { shouldValidate: true });
      toast.success("PDF uploaded");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "PDF upload failed";
      setMsg(message);
      toast.error(message);
    } finally {
      setPdfUploading(false);
    }
  }

  /* ----------------------------- */
  /* Submit handler                */
  /* ----------------------------- */

  async function onSubmit(values: FormValues) {
    setMsg(null);

    if (selectedAuthors.length === 0) {
      setMsg("Please add at least one author by email.");
      return;
    }

    const payload: ArticleCreateDTO = {
      title: values.title.trim(),
      abstract: values.abstract.trim(),
      fileUrl: values.fileUrl.trim(),
      keywords: values.keywords?.trim() || null,
      coverImage: null,
      authors: selectedAuthors,
    };

    try {
      
      await submitArticle.mutateAsync(payload);
      setMsg("Article submitted successfully!");
      toast.success("Article submitted successfully!");

      // reset form + authors; main author will be re-added via useEffect
      form.reset({
        title: "",
        abstract: "",
        fileUrl: "",
        keywords: "",
        authorEmails: [],
      });
      setSelectedAuthors([]);
      setAuthorCount(1);
      setInitializedMainAuthor(false);
    } catch (err: unknown) {
      if (err instanceof Error) setMsg(err.message);
      else setMsg("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-3xl mx-auto"
      >
        {msg && (
          <div
            className={`rounded-lg border px-4 py-2 text-sm ${
              msg.startsWith("✅")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {msg}
          </div>
        )}

        {/* Title */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Article Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your research article title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Abstract */}
        <FormField
          control={control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <FormControl>
                <Textarea
                  rows={7}
                  placeholder="Summarize your article in 5–8 sentences"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PDF Upload */}
        <FormField
          control={control}
          name="fileUrl"
          render={() => (
            <FormItem>
              <FormLabel>PDF File</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="application/pdf,.pdf"
                    disabled={pdfUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      void handlePdfUpload(file);
                      e.currentTarget.value = "";
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Keywords */}
        <FormField
          control={control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords (comma separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="AI, Machine Learning, Data Science"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Author count dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Target number of authors
          </label>
          <Select
            value={String(authorCount)}
            onValueChange={handleAuthorCountChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Author</SelectItem>
              <SelectItem value="2">2 Authors</SelectItem>
              <SelectItem value="3">3 Authors</SelectItem>
              <SelectItem value="4">4 Authors</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            You can add up to 4 authors. Each co-author must have a registered
            account with that email.
          </p>
        </div>

        {/* Author search + list */}
        <FormField
          control={control}
          name="authorEmails"
          render={() => (
            <FormItem>
              <FormLabel>Authors</FormLabel>
              <div className="space-y-3">
                {/* Search bar */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    placeholder="Search author by email or name"
                    value={authorSearchEmail}
                    onChange={(e) => setAuthorSearchEmail(e.target.value)}
                    className="sm:flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAuthor}
                    disabled={searchLoading}
                  >
                    {searchLoading ? "Adding..." : "Add author by email"}
                  </Button>
                </div>
                {authorSearchError && (
                  <p className="text-xs text-red-600">{authorSearchError}</p>
                )}

                {/* Suggestions */}
                {suggestionLoading && authorSearchEmail.trim() && (
                  <p className="text-xs text-muted-foreground">
                    Searching users...
                  </p>
                )}
                {!suggestionLoading && suggestions.length > 0 && (
                  <div className="rounded-md border bg-white shadow-sm divide-y">
                    {suggestions.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(user)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 text-left"
                      >
                        <span className="font-medium">
                          {user.name ?? "Unnamed"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected authors list */}
                {selectedAuthors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedAuthors.map((a) => {
                      const isMain =
                        session?.user?.email &&
                        a.email.toLowerCase() ===
                          session.user.email.toLowerCase();

                      return (
                        <Badge
                          key={a.email}
                          variant={isMain ? "default" : "secondary"}
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          <span>
                            {isMain ? "You" : a.name ?? "Unnamed"} ({a.email})
                            {isMain && " (Corresponding)"}
                          </span>
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAuthor(a.email)}
                              className="ml-1 inline-flex"
                              aria-label="Remove author"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No authors added yet. Add yourself and your co-authors by
                    email.
                  </p>
                )}

                {/* Validation message from Zod (authorEmails) */}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Submit button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || pdfUploading}
            className="px-6"
          >
            {isSubmitting && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isSubmitting ? "Submitting..." : "Submit Article"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
