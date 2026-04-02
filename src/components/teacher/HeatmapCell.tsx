import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapCellProps {
  topic: string;
  format: string;
  studentCount: number;
  avgTurns: number;
  totalTurns: number;
}

function getHeatColour(totalTurns: number): string {
  if (totalTurns === 0) return 'bg-muted text-muted-foreground';
  if (totalTurns <= 2)  return 'bg-emerald-100 text-emerald-800';
  if (totalTurns <= 5)  return 'bg-emerald-300 text-emerald-900';
  if (totalTurns <= 10) return 'bg-emerald-500 text-white';
  return 'bg-emerald-700 text-white';
}

const FORMAT_ICONS: Record<string, string> = {
  game: '🎮', story: '📖', meme: '😂', puzzle: '🧩', short_film: '🎬'
};

export function HeatmapCell({ topic, format, studentCount, avgTurns, totalTurns }: HeatmapCellProps) {
  const colour = getHeatColour(totalTurns);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`h-12 w-full rounded-md flex items-center justify-center text-xs font-semibold cursor-default transition-all hover:opacity-80 ${colour}`}>
            {totalTurns > 0 ? totalTurns : '–'}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1 text-xs">
            <div className="font-bold">{FORMAT_ICONS[format]} {format.replace('_', ' ')} · {topic}</div>
            <div>Students: {studentCount}</div>
            <div>Avg turns: {avgTurns.toFixed(1)}</div>
            <div>Total engagement: {totalTurns} turns</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
