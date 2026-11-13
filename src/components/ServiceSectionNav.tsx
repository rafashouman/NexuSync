"use client";

type ServiceSectionNavProps = {
  items: ReadonlyArray<{ href: `#${string}`; label: string }>;
  contained?: boolean;
};

export function ServiceSectionNav({
  items,
  contained = false,
}: ServiceSectionNavProps) {
  return (
    <nav
      aria-label="Navegação por tópicos"
      className="sticky top-20 z-40 border-y border-border bg-background/90 backdrop-blur-xl"
    >
      <ul
        className={`${contained ? "w-full" : "container-luxe"} flex min-w-full gap-2 overflow-x-auto py-3`}
      >
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="block whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-violet-300/30 hover:text-violet-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
