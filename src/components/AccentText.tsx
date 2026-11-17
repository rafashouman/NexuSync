export function AccentText({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  if (words.length === 1) return <span className="text-champagne">{text}</span>;
  const split = words.length > 3 ? words.length - 2 : Math.max(1, words.length - 1);
  return <>{words.slice(0, split).join(" ")}{" "}<span className="text-champagne">{words.slice(split).join(" ")}</span></>;
}
