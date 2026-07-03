import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slide } from "react-awesome-reveal";

const resources = [
  {
    image: blog1,
    title: "The Anti-Playbook: What It Means To Lead Boldly in 2025",
    type: "Webinar",
    description:
      "Join our webinar to explore what it means to lead boldly in the ever-changing landscape of 2025. We'll discuss unconventional strategies and the future of leadership.",
  },
  {
    image: blog2,
    title:
      "Showing up, checked out: Why employee wellness checks are more important than ever",
    type: "News",
    description:
      "This article delves into the importance of employee wellness checks, especially in a post-pandemic world. Learn why it's crucial for business success.",
  },
  {
    image: blog3,
    title: "Candidate Experience Matters – Lose Talent, Lose Trust",
    type: "News",
    description:
      "A negative candidate experience can damage your brand and cost you talent. Find out how to create a positive experience and build trust with potential hires.",
  },
  {
    image: blog4,
    title:
      "Ronak Gopaldas on Africa's Brain Drain and the Case for Talent Return",
    type: "Podcast",
    description:
      "In this podcast, Ronak Gopaldas discusses the challenges of Africa's brain drain and makes a compelling case for initiatives that encourage talent to return to the continent.",
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
            <Slide direction="up" key={index}>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group bg-background rounded-2xl overflow-hidden shadow-sm ring-1 ring-teal-light/30 hover:ring-teal-light/60 hover:shadow-xl transition-all duration-300 cursor-pointer">
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
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{resource.title}</DialogTitle>
                    <DialogDescription>
                      <img
                        src={resource.image}
                        alt={resource.title}
                        className="w-full h-auto object-cover rounded-md my-4"
                      />
                      {resource.description}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </Slide>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
