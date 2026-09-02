"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PaletteItem = {
  position: number;
  isAnswered: boolean;
  isVisited: boolean;
  isMarkedReview: boolean;
};

function summarize(palette: PaletteItem[]) {
  let answered = 0;
  let markedForReview = 0;
  let notVisited = 0;
  let unanswered = 0;

  for (const item of palette) {
    if (item.isMarkedReview) markedForReview++;
    if (item.isAnswered) {
      answered++;
    } else if (!item.isVisited) {
      notVisited++;
    } else {
      unanswered++;
    }
  }

  return { answered, unanswered, markedForReview, notVisited };
}

export default function SubmitConfirmDialog({
  open,
  onOpenChange,
  palette,
  timeRemainingLabel,
  onConfirm,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  palette: PaletteItem[];
  timeRemainingLabel: string;
  onConfirm: () => void;
  submitting: boolean;
}) {
  const stats = summarize(palette);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Test?</DialogTitle>
          <DialogDescription>
            Review your progress before submitting. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          <StatRow label="Answered" value={stats.answered} color="text-green-600" />
          <StatRow label="Unanswered" value={stats.unanswered} color="text-red-500" />
          <StatRow label="Marked for Review" value={stats.markedForReview} color="text-purple-600" />
          <StatRow label="Not Visited" value={stats.notVisited} color="text-text-secondary" />
        </div>

        <p className="text-sm font-medium text-text-primary">
          Time Remaining: <span className="font-mono">{timeRemainingLabel}</span>
        </p>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={submitting}
            className="bg-brand-blue hover:bg-brand-navy"
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border-default p-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  );
}