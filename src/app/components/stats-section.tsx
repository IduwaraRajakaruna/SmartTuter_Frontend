interface StatsSectionProps {
  stats: Array<{
    value: string | number;
    label: string;
  }>;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <h3 className="text-4xl mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
