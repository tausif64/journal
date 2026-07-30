"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type Journal = {
  id: string;
  name: string;
  issn: string;
  status: "ACTIVE" | "INACTIVE";
};

type VolumeRow = {
  id: string;
  volumeNumber: number;
  year: number;
  journal: {
    id: string;
    name: string;
    issn: string;
  };
};

export default function AdminIssueVolumePage() {
  const qc = useQueryClient();

  const [journalName, setJournalName] = useState("");
  const [journalIssn, setJournalIssn] = useState("");
  const [journalStatus, setJournalStatus] = useState<"ACTIVE" | "INACTIVE">(
    "ACTIVE"
  );
  const [volumeJournalId, setVolumeJournalId] = useState("");
  const [volumeDate, setVolumeDate] = useState(
    `${new Date().getFullYear()}-01-01`
  );

  const journalsQuery = useQuery<Journal[]>({
    queryKey: ["admin-journals"],
    queryFn: async () => {
      const res = await apiGet<ApiResponse<Journal[]>>("/api/admin/journals");
      return res.data ?? [];
    },
  });

  const volumesQuery = useQuery<VolumeRow[]>({
    queryKey: ["admin-volumes"],
    queryFn: async () => {
      const res = await apiGet<ApiResponse<VolumeRow[]>>("/api/admin/volumes");
      return res.data ?? [];
    },
  });

  const selectedYear = useMemo(() => {
    if (!volumeDate) return NaN;
    const parsed = new Date(volumeDate);
    return Number.isNaN(parsed.getTime()) ? NaN : parsed.getFullYear();
  }, [volumeDate]);

  const suggestedVolumeNumber = useMemo(() => {
    if (!volumeJournalId || !Number.isInteger(selectedYear)) return 1;
    const volsForYear = (volumesQuery.data ?? []).filter(
      (v) => v.year === selectedYear && v.journal.id === volumeJournalId
    );
    const maxForYear = volsForYear.reduce(
      (max, v) => Math.max(max, v.volumeNumber),
      0
    );
    return maxForYear + 1;
  }, [selectedYear, volumeJournalId, volumesQuery.data]);

  const createJournal = useMutation({
    mutationFn: () =>
      apiPost<
        ApiResponse<Journal>,
        { name: string; issn: string; status: "ACTIVE" | "INACTIVE" }
      >("/api/admin/journals", {
        name: journalName.trim(),
        issn: journalIssn.trim(),
        status: journalStatus,
      }),
    onSuccess: async () => {
      setJournalName("");
      setJournalIssn("");
      setJournalStatus("ACTIVE");
      toast.success("Journal created");
      await qc.invalidateQueries({ queryKey: ["admin-journals"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create journal"
      );
    },
  });

   const createVolume = useMutation({
     mutationFn: () =>
       apiPost<
         ApiResponse<VolumeRow>,
         { journalId: string; year: number }
       >("/api/admin/volumes", {
         journalId: volumeJournalId,
         year: selectedYear,
       }),
     onSuccess: async () => {
       toast.success("Volume created");
       await qc.invalidateQueries({ queryKey: ["admin-volumes"] });
     },
     onError: (error) => {
       toast.error(
         error instanceof Error ? error.message : "Failed to create volume"
       );
     },
   });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Volume & Issue Setup
          </h1>
          <p className="text-sm text-muted-foreground">
            Create journals and volumes. Use dedicated table page to manage and
            search journals/volumes.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/volumes">Open Volumes & Journals Tables</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Journal Name <span className="text-destructive">*</span>
            </p>
            <Input
              placeholder="Journal name"
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
            />
            <p className="text-xs font-medium text-muted-foreground">
              ISSN <span className="text-destructive">*</span>
            </p>
            <Input
              placeholder="ISSN"
              value={journalIssn}
              onChange={(e) => setJournalIssn(e.target.value)}
            />
            <p className="text-xs font-medium text-muted-foreground">
              Status <span className="text-destructive">*</span>
            </p>
            <Select
              value={journalStatus}
              onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                setJournalStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              disabled={
                createJournal.isPending ||
                !journalName.trim() ||
                !journalIssn.trim()
              }
              onClick={() => createJournal.mutate()}
            >
              {createJournal.isPending ? "Creating..." : "Create Journal"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Volume</CardTitle>
          </CardHeader>
           <CardContent className="space-y-3">
             <p className="text-xs font-medium text-muted-foreground">
               Journal <span className="text-destructive">*</span>
             </p>
             <Select
               value={volumeJournalId || undefined}
               onValueChange={setVolumeJournalId}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Select journal" />
               </SelectTrigger>
               <SelectContent>
                 {(journalsQuery.data ?? []).map((journal) => (
                   <SelectItem key={journal.id} value={journal.id}>
                     {journal.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <p className="text-xs font-medium text-muted-foreground">
               Year <span className="text-destructive">*</span>
             </p>
             <Input
               type="date"
               value={volumeDate}
               onChange={(e) => setVolumeDate(e.target.value)}
             />
             <Button
               className="w-full"
               disabled={
                 createVolume.isPending ||
                 !volumeJournalId ||
                 !Number.isInteger(selectedYear)
               }
               onClick={() => createVolume.mutate()}
             >
               {createVolume.isPending ? "Creating..." : "Create Volume"}
             </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
