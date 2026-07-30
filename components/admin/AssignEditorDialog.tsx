"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAssignEditor } from "@/hooks/useAssignEditor";
import { useAdminEditors } from "@/hooks/useAdminEditors";

type CurrentEditor = {
  id: string;
  name: string | null;
  email: string;
};

type Props = {
  articleId: string;
  currentEditor?: CurrentEditor | null;
};

export function AssignEditorDialog({ articleId, currentEditor }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedEditorId, setSelectedEditorId] = useState<string>(
    currentEditor?.id ?? ""
  );

  const { data: editors = [], isLoading } = useAdminEditors();
  const mutation = useAssignEditor(articleId);

  const filteredEditors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return editors;
    return editors.filter((editor) => {
      const name = (editor.name ?? "").toLowerCase();
      const email = editor.email.toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [editors, query]);

  const selectedEditor =
    filteredEditors.find((editor) => editor.id === selectedEditorId) ??
    editors.find((editor) => editor.id === selectedEditorId) ??
    null;

  const handleAssign = () => {
    if (!selectedEditorId) return;
    mutation.mutate(selectedEditorId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setQuery("");
          setSelectedEditorId(currentEditor?.id ?? "");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          {currentEditor ? "Change Editor" : "Assign Editor"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {currentEditor ? "Change Assigned Editor" : "Assign Editor"}
          </DialogTitle>
          <DialogDescription>
            Search editors and assign exactly one editor to this article.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Current editor</p>
            {currentEditor ? (
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm font-medium">
                  {currentEditor.name ?? currentEditor.email}
                </p>
                <Badge variant="secondary">{currentEditor.email}</Badge>
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                No editor assigned.
              </p>
            )}
          </div>

          <Input
            placeholder="Search editor by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="text-xs font-medium text-muted-foreground">
            Select Editor <span className="text-destructive">*</span>
          </p>

          <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-2">
            {isLoading ? (
              <p className="p-2 text-sm text-muted-foreground">
                Loading editors...
              </p>
            ) : filteredEditors.length === 0  ? (
              <p className="p-2 text-sm text-muted-foreground">
                No matching editors found.
              </p>
            ) : (
              filteredEditors.map((editor) => (
                <button
                  key={editor.id}
                  type="button"
                  onClick={() => setSelectedEditorId(editor.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left transition ${
                    selectedEditorId === editor.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/60"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {editor.name ?? "Unnamed Editor"}
                  </p>
                  <p className="text-xs text-muted-foreground">{editor.email}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={
              mutation.isPending ||
              !selectedEditorId ||
              selectedEditorId === currentEditor?.id
            }
          >
            {mutation.isPending
              ? "Saving..."
              : currentEditor
              ? "Update Editor"
              : "Assign Editor"}
          </Button>
        </DialogFooter>

        {selectedEditor && (
          <p className="text-xs text-muted-foreground">
            Selected: {selectedEditor.name ?? selectedEditor.email} (
            {selectedEditor.email})
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
