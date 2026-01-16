const stats = [
  {
    value: "24+",
    label: "We've been leaders in the field for over 24 years",
  },
  {
    value: "1000+",
    label: "Placed over 1000 leaders in 20 countries in Africa",
  },
  {
    value: "3,600+",
    label: "Had over 3,600 CEO and Board Candidate Conversations this year",
  },
];

const Stats = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-serif text-center text-foreground mb-12">
          See Why We've Been Ranked One of the Top Executive Search Firms
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
