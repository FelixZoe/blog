/**
 * CSS-only hover tooltip bubble.
 *
 * Parent must have `group relative` classes.
 * Shows instantly on hover, hides instantly when the pointer leaves —
 * no JS state machine, no exit animation to fight.
 */
export default function HoverBubble({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 rounded-lg bg-black px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-lg group-hover:opacity-100 dark:bg-zinc-900 dark:text-zinc-100">
      {label}
      <span
        aria-hidden
        className="absolute -bottom-[3px] left-1/2 size-1.5 -translate-x-1/2 rotate-45 bg-black dark:bg-zinc-900"
      />
    </span>
  );
}
