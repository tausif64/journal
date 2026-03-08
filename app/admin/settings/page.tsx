"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical } from "lucide-react";
import type { CarouselSlide } from "@/lib/carousel-settings";

type CarouselResponse = {
  success: boolean;
  data?: CarouselSlide[];
  error?: string;
};

type UploadResponse = {
  success: boolean;
  data?: { url: string };
  error?: string;
};

type CarouselTableRow = {
  index: number;
  slide: CarouselSlide;
};

type StatusFilter = "ALL" | CarouselSlide["status"];

function createEmptySlide(): CarouselSlide {
  return {
    image: "",
    title: "",
    description: "",
    buttons: [{ label: "", link: "" }],
    status: "DRAFT",
    sortOrder: 0,
  };
}

function SlidePreview({ slide }: { slide: CarouselSlide }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div
        className="relative mx-auto flex h-[540px] w-[960px] max-w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="relative z-10 w-full rounded bg-background/20 p-8 text-center backdrop-blur-md max-w-[60%]">
          <h2 className="mb-4 text-2xl font-semibold md:text-4xl">
            {slide.title || "Slide title"}
          </h2>
          <p className="mb-6 text-base">
            {slide.description || "Slide description"}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {slide.buttons.map((btn, i) => (
              <Button
                key={i}
                type="button"
                size="lg"
                className="pointer-events-none"
              >
                {btn.label || "Button"}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`cursor-grab border-b transition-colors hover:bg-muted/50 active:cursor-grabbing ${
        isDragging ? "opacity-70 bg-muted" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      {children}
    </tr>
  );
}

export default function AdminSettingsPage() {
  const [draftSlides, setDraftSlides] = useState<CarouselSlide[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(
    null,
  );
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(
    null,
  );
  const [previewSlideIndex, setPreviewSlideIndex] = useState<number | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSlide, setNewSlide] = useState<CarouselSlide>(createEmptySlide());
  const [isUploadingNewSlideImage, setIsUploadingNewSlideImage] =
    useState(false);

  const carouselQuery = useQuery<CarouselSlide[]>({
    queryKey: ["admin-carousel-settings"],
    queryFn: async () => {
      const res = await apiGet<CarouselResponse>(
        "/api/admin/settings/carousel",
      );
      return res.data ?? [];
    },
  });

  const sourceSlides = carouselQuery.data ?? [];
  const slides = isDirty ? draftSlides : sourceSlides;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const editSlides = (
    updater: (current: CarouselSlide[]) => CarouselSlide[],
  ) => {
    setDraftSlides((prev) => {
      const base = isDirty ? prev : sourceSlides;
      return updater(base);
    });
    if (!isDirty) setIsDirty(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () =>
      apiPut<CarouselResponse, { slides: CarouselSlide[] }>(
        "/api/admin/settings/carousel",
        { slides },
      ),
    onSuccess: (res) => {
      toast.success("Carousel settings updated");
      setDraftSlides(res.data ?? slides);
      setIsDirty(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update carousel",
      );
    },
  });

  const updateSlide = (index: number, patch: Partial<CarouselSlide>) => {
    editSlides((current) => {
      const next = [...current];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const updateButton = (
    slideIndex: number,
    buttonIndex: number,
    patch: { label?: string; link?: string },
  ) => {
    editSlides((current) => {
      const next = [...current];
      const buttons = [...next[slideIndex].buttons];
      buttons[buttonIndex] = { ...buttons[buttonIndex], ...patch };
      next[slideIndex] = { ...next[slideIndex], buttons };
      return next;
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/settings/carousel/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const json = (await res.json()) as UploadResponse;
    if (!res.ok || !json.success || !json.data?.url) {
      throw new Error(json.error ?? "Failed to upload image");
    }

    return json.data.url;
  };

  const uploadSlideImage = async (slideIndex: number, file: File) => {
    setUploadingSlideIndex(slideIndex);
    try {
      const imageUrl = await uploadImage(file);
      updateSlide(slideIndex, { image: imageUrl });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingSlideIndex(null);
    }
  };

  const uploadNewSlideImage = async (file: File) => {
    setIsUploadingNewSlideImage(true);
    try {
      const imageUrl = await uploadImage(file);
      setNewSlide((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploadingNewSlideImage(false);
    }
  };

  const createSlideFromDialog = () => {
    if (
      !newSlide.image.trim() ||
      !newSlide.title.trim() ||
      !newSlide.description.trim()
    ) {
      toast.error("Fill all required fields before creating the slide");
      return;
    }

    if (newSlide.buttons.length < 1 || newSlide.buttons.length > 2) {
      toast.error("Slide must have between 1 and 2 buttons");
      return;
    }

    const hasInvalidButton = newSlide.buttons.some(
      (btn) => !btn.label.trim() || !btn.link.trim(),
    );
    if (hasInvalidButton) {
      toast.error("Each button must have label and link");
      return;
    }

    editSlides((current) => [
      ...current,
      {
        ...newSlide,
        sortOrder: current.length,
      },
    ]);
    setIsAddDialogOpen(false);
    setNewSlide(createEmptySlide());
    toast.success("Slide added");
  };

  const tableData = useMemo<CarouselTableRow[]>(() => {
    const filtered =
      statusFilter === "ALL"
        ? slides
        : slides.filter((slide) => slide.status === statusFilter);
    return filtered.map((slide) => ({
      index: slides.indexOf(slide),
      slide,
    }));
  }, [slides, statusFilter]);

  const sortableIds = useMemo(
    () => tableData.map((row) => `slide-${row.index}`),
    [tableData],
  );

  const onDragEnd = (event: DragEndEvent) => {
    if (statusFilter !== "ALL") return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(String(active.id).replace("slide-", ""));
    const newIndex = Number(String(over.id).replace("slide-", ""));

    if (Number.isNaN(oldIndex) || Number.isNaN(newIndex)) return;

    editSlides((current) =>
      arrayMove(current, oldIndex, newIndex).map((slide, index) => ({
        ...slide,
        sortOrder: index,
      })),
    );
  };

  const columns: ColumnDef<CarouselTableRow>[] = [
    {
      id: "drag",
      header: "",
      cell: () => (
        <span className="inline-flex items-center text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </span>
      ),
    },
    {
      id: "slideIndex",
      header: "Slide",
      cell: ({ row }) => row.original.index + 1,
    },
    {
      header: "Title",
      cell: ({ row }) => row.original.slide.title || "Untitled",
    },
    {
      header: "Description",
      cell: ({ row }) =>
        row.original.slide.description
          ? `${row.original.slide.description.slice(0, 70)}${
              row.original.slide.description.length > 70 ? "..." : ""
            }`
          : "-",
    },
    {
      id: "button",
      header: "Buttons",
      cell: ({ row }) => row.original.slide.buttons.length,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => row.original.slide.status,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setEditingSlideIndex(row.original.index)}
          >
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setPreviewSlideIndex(row.original.index)}
          >
            Preview
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={slides.length <= 1}
            onClick={() =>
              editSlides((current) =>
                current.filter((_, i) => i !== row.original.index),
              )
            }
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const editingSlide =
    editingSlideIndex === null ? null : (slides[editingSlideIndex] ?? null);
  const previewSlide =
    previewSlideIndex === null ? null : (slides[previewSlideIndex] ?? null);

  if (carouselQuery.isLoading) {
    return <div className="rounded-lg border p-6">Loading settings...</div>;
  }

  if (carouselQuery.isError) {
    return <div className="text-destructive">Failed to load settings</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage homepage carousel content.
          </p>
        </div>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || slides.length === 0}
        >
          {saveMutation.isPending ? "Saving..." : "Save Carousel"}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Carousel Slides</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="HIDE">Hide</SelectItem>
                <SelectItem value="SHOW">Show</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNewSlide(createEmptySlide());
                setIsAddDialogOpen(true);
              }}
            >
              Add Slide
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sortableIds}
              strategy={verticalListSortingStrategy}
            >
              <Table className="table-fixed [&_th]:whitespace-normal [&_td]:whitespace-normal">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={
                            header.column.id === "drag"
                              ? "w-10"
                              : header.column.id === "slideIndex"
                                ? "w-14"
                                : header.column.id === "button"
                                  ? "w-15"
                                  : header.column.id === "status"
                                    ? "w-14"
                                    : ""
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {statusFilter !== "ALL" ? (
                    <TableRow>
                      <TableCell
                        className="text-xs text-muted-foreground"
                        colSpan={6}
                      >
                        Switch filter to <strong>All</strong> to drag and
                        reorder slides.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) =>
                      statusFilter === "ALL" ? (
                        <SortableRow
                          key={row.id}
                          id={`slide-${row.original.index}`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className={`p-2 align-middle ${
                                cell.column.id === "drag"
                                  ? "w-10"
                                  : cell.column.id === "slideIndex"
                                    ? "w-14"
                                    : ""
                              }`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </SortableRow>
                      ) : (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={
                                cell.column.id === "drag"
                                  ? "w-10"
                                  : cell.column.id === "slideIndex"
                                    ? "w-14"
                                    : ""
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ),
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No slides available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setNewSlide(createEmptySlide());
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Slide</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Image <span className="text-destructive">*</span>
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  void uploadNewSlideImage(file);
                  e.currentTarget.value = "";
                }}
                disabled={isUploadingNewSlideImage}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Title <span className="text-destructive">*</span>
              </p>
              <Input
                value={newSlide.title}
                onChange={(e) =>
                  setNewSlide((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Slide title"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Description <span className="text-destructive">*</span>
              </p>
              <Textarea
                value={newSlide.description}
                onChange={(e) =>
                  setNewSlide((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Slide description"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Status <span className="text-destructive">*</span>
              </p>
              <Select
                value={newSlide.status}
                onValueChange={(value) =>
                  setNewSlide((prev) => ({
                    ...prev,
                    status: value as CarouselSlide["status"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="HIDE">Hide</SelectItem>
                  <SelectItem value="SHOW">Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  Buttons <span className="text-destructive">*</span> (Min 1,
                  Max 2)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={newSlide.buttons.length >= 2}
                  onClick={() =>
                    setNewSlide((prev) => ({
                      ...prev,
                      buttons: [...prev.buttons, { label: "", link: "" }],
                    }))
                  }
                >
                  Add Button
                </Button>
              </div>

              {newSlide.buttons.map((button, buttonIndex) => (
                <div key={buttonIndex} className="grid gap-2 sm:grid-cols-2">
                  <Input
                    value={button.label}
                    onChange={(e) =>
                      setNewSlide((prev) => {
                        const buttons = [...prev.buttons];
                        buttons[buttonIndex] = {
                          ...buttons[buttonIndex],
                          label: e.target.value,
                        };
                        return { ...prev, buttons };
                      })
                    }
                    placeholder="Button label *"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={button.link}
                      onChange={(e) =>
                        setNewSlide((prev) => {
                          const buttons = [...prev.buttons];
                          buttons[buttonIndex] = {
                            ...buttons[buttonIndex],
                            link: e.target.value,
                          };
                          return { ...prev, buttons };
                        })
                      }
                      placeholder="Button link *"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={newSlide.buttons.length <= 1}
                      onClick={() =>
                        setNewSlide((prev) => ({
                          ...prev,
                          buttons: prev.buttons.filter(
                            (_, i) => i !== buttonIndex,
                          ),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={createSlideFromDialog}>
                Create Slide
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingSlideIndex !== null}
        onOpenChange={(open) => {
          if (!open) setEditingSlideIndex(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlideIndex === null
                ? "Edit Slide"
                : `Edit Slide ${editingSlideIndex + 1}`}
            </DialogTitle>
          </DialogHeader>

          {editingSlide && editingSlideIndex !== null ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Image <span className="text-destructive">*</span>
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    void uploadSlideImage(editingSlideIndex, file);
                    e.currentTarget.value = "";
                  }}
                  disabled={uploadingSlideIndex === editingSlideIndex}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Title <span className="text-destructive">*</span>
                </p>
                <Input
                  value={editingSlide.title}
                  onChange={(e) =>
                    updateSlide(editingSlideIndex, { title: e.target.value })
                  }
                  placeholder="Slide title"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Description <span className="text-destructive">*</span>
                </p>
                <Textarea
                  value={editingSlide.description}
                  onChange={(e) =>
                    updateSlide(editingSlideIndex, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Slide description"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Status <span className="text-destructive">*</span>
                </p>
                <Select
                  value={editingSlide.status}
                  onValueChange={(value) =>
                    updateSlide(editingSlideIndex, {
                      status: value as CarouselSlide["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="HIDE">Hide</SelectItem>
                    <SelectItem value="SHOW">Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Buttons <span className="text-destructive">*</span> (Min 1,
                    Max 2)
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={editingSlide.buttons.length >= 2}
                    onClick={() =>
                      updateSlide(editingSlideIndex, {
                        buttons: [
                          ...editingSlide.buttons,
                          { label: "", link: "" },
                        ],
                      })
                    }
                  >
                    Add Button
                  </Button>
                </div>

                {editingSlide.buttons.map((button, buttonIndex) => (
                  <div key={buttonIndex} className="grid gap-2 sm:grid-cols-2">
                    <Input
                      value={button.label}
                      onChange={(e) =>
                        updateButton(editingSlideIndex, buttonIndex, {
                          label: e.target.value,
                        })
                      }
                      placeholder="Button label *"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={button.link}
                        onChange={(e) =>
                          updateButton(editingSlideIndex, buttonIndex, {
                            link: e.target.value,
                          })
                        }
                        placeholder="Button link *"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={editingSlide.buttons.length <= 1}
                        onClick={() =>
                          updateSlide(editingSlideIndex, {
                            buttons: editingSlide.buttons.filter(
                              (_, i) => i !== buttonIndex,
                            ),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={previewSlideIndex !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewSlideIndex(null);
        }}
      >
        <DialogTitle></DialogTitle>
        <DialogContent className="max-h-[80vh] max-w-[94vw] p-0 sm:min-w-[70vw]! top-80">
          {previewSlide ? <SlidePreview slide={previewSlide} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
