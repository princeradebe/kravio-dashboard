const files = import.meta.glob<string>("../assets/*", {
  eager: true,
  query: "?url",
  import: "default",
});

export function asset(name: string): string {
  const entry = Object.entries(files).find(
    ([key]) => key.replace(/^.*\//, "").replace(/\.\w+$/, "") === name,
  );
  if (!entry) throw new Error(`Missing asset: ${name}`);
  return entry[1];
}
