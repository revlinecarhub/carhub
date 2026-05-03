"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatDateLabel(d: Date | undefined): string {
  if (!d) return "Choisir une date";
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toIsoLocal(d: Date | undefined, time: string): string {
  if (!d) return "";
  const [hh, mm] = time.split(":");
  const out = new Date(d);
  out.setHours(Number(hh) || 0, Number(mm) || 0, 0, 0);
  return out.toISOString();
}

export function DateTimePicker({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (iso: string) => void;
}) {
  const initialDate = value ? new Date(value) : undefined;
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [time, setTime] = useState<string>(
    initialDate ? `${pad(initialDate.getHours())}:${pad(initialDate.getMinutes())}` : "12:00"
  );
  const [open, setOpen] = useState(false);

  function update(newDate: Date | undefined, newTime: string) {
    setDate(newDate);
    setTime(newTime);
    onChange(toIsoLocal(newDate, newTime));
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input type="hidden" name={name} value={toIsoLocal(date, time)} />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="inline-flex flex-1 items-center justify-start gap-2 rounded border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-left text-sm font-normal hover:border-[var(--color-fg)]"
        >
          <CalendarIcon className="h-4 w-4" />
          {formatDateLabel(date)}
        </PopoverTrigger>
        <PopoverContent className="w-auto border-[var(--color-border)] bg-[var(--color-card)] p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              update(d, time);
              setOpen(false);
            }}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-card)] p-2 text-sm">
        <input
          type="number"
          min={0}
          max={23}
          value={time.split(":")[0]}
          onChange={(e) => {
            const h = Math.max(0, Math.min(23, Number(e.target.value) || 0));
            update(date, `${pad(h)}:${time.split(":")[1] ?? "00"}`);
          }}
          className="no-spin w-12 bg-transparent text-center outline-none"
          aria-label="Heure (0-23)"
        />
        <span className="text-[var(--color-muted)]">:</span>
        <input
          type="number"
          min={0}
          max={59}
          value={time.split(":")[1] ?? "00"}
          onChange={(e) => {
            const m = Math.max(0, Math.min(59, Number(e.target.value) || 0));
            update(date, `${time.split(":")[0] ?? "00"}:${pad(m)}`);
          }}
          className="no-spin w-12 bg-transparent text-center outline-none"
          aria-label="Minutes (0-59)"
        />
      </div>
    </div>
  );
}
