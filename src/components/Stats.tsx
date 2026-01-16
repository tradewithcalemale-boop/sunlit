const stats = [
  {
    value: "20+",
    label: "New job opportunities posted every day",
  },
  {
    value: "500+",
    label: "Active job listings across various sectors",
  },
  {
    value: "10,000+",
    label: "Successful placements and counting",
  },
];

const Stats = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-serif text-center text-foreground mb-12">
          Jobs are always posted everyday over 20+ jobs listed
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-5xl md:text-6xl font-serif font-bold text-teal-dark mb-4">
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
