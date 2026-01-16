import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";

const resources = [
  {
    image: blog1,
    title: "The Anti-Playbook: What It Means To Lead Boldly in 2025",
    type: "Webinar",
  },
  {
    image: blog2,
    title: "Showing up, checked out: Why employee wellness checks are more important than ever",
    type: "News",
  },
  {
    image: blog3,
    title: "Candidate Experience Matters – Lose Talent, Lose Trust",
    type: "News",
  },
  {
    image: blog4,
    title: "Ronak Gopaldas on Africa's Brain Drain and the Case for Talent Return",
    type: "Podcast",
  },
];

const Resources = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-center text-foreground mb-16">
          Leadership Insights & Hiring Resources
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <a
              key={index}
              href="#"
              className="group bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-teal-dark uppercase tracking-wide">
                  {resource.type}
                </span>
                <h3 className="font-serif font-semibold text-foreground mt-2 line-clamp-2 group-hover:text-teal-dark transition-colors">
                  {resource.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
