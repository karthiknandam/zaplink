export function timeAgo(dateString: Date) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffDay > 0) return rtf.format(-diffDay, "day");
  if (diffHour > 0) return rtf.format(-diffHour, "hour");
  if (diffMin > 0) return rtf.format(-diffMin, "minute");

  return "just now";
}

export function clearDate(date: Date) {
  const formated = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return formated;
}
