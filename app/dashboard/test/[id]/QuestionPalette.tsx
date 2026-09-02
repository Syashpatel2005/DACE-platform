"use client";

type PaletteItem = {
  position: number;
  isAnswered: boolean;
  isVisited: boolean;
  isMarkedReview: boolean;
};

function getPaletteState(item: PaletteItem): {
  label: string;
  className: string;
} {
  if (item.isMarkedReview && item.isAnswered) {
    return {
      label: "Answered and marked for review",
      className: "bg-purple-600 text-white border-purple-700",
    };
  }
  if (item.isMarkedReview) {
    return {
      label: "Marked for review",
      className: "bg-purple-200 text-purple-900 border-purple-400 dark:bg-purple-900 dark:text-purple-100",
    };
  }
  if (item.isAnswered) {
    return {
      label: "Answered",
      className: "bg-green-600 text-white border-green-700",
    };
  }
  if (item.isVisited) {
    return {
      label: "Not answered",
      className: "bg-red-500 text-white border-red-600",
    };
  }
  return {
    label: "Not visited",
    className: "bg-surface-muted text-text-secondary border-border-default",
  };
}

export default function QuestionPalette({
  palette,
  currentPosition,
  onNavigate,
}: {
  palette: PaletteItem[];
  currentPosition: number;
  onNavigate: (position: number) => void;
}) {
  return (
    <nav aria-label="Question navigation palette" className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2" role="group" aria-label="Question numbers">
        {palette.map((item) => {
          const state = getPaletteState(item);
          const isCurrent = item.position === currentPosition;
          return (
            <button
              key={item.position}
              type="button"
              onClick={() => onNavigate(item.position)}
              aria-label={`Question ${item.position}: ${state.label}${isCurrent ? ", current question" : ""}`}
              aria-current={isCurrent ? "true" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${state.className} ${
                isCurrent ? "ring-2 ring-brand-blue ring-offset-2 ring-offset-surface" : ""
              }`}
            >
              {item.position}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-text-secondary" aria-hidden="true">
        <LegendRow className="bg-surface-muted border border-border-default" label="Not Visited" />
        <LegendRow className="bg-red-500" label="Not Answered" />
        <LegendRow className="bg-green-600" label="Answered" />
        <LegendRow className="bg-purple-200 dark:bg-purple-900" label="Marked for Review" />
        <LegendRow className="bg-purple-600" label="Answered + Marked" />
      </div>
    </nav>
  );
}

function LegendRow({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${className}`} />
      <span>{label}</span>
    </div>
  );
}