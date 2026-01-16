
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const services = [
  {
    id: "human-resource-consulting",
    title: "Human Resource Consulting",
    description: "Tailored HR services to meet your unique needs, increasing competitiveness and operational efficiency.",
    content: "We always purpose to understand the needs of our clients and effectively collaborate with our clients to tailor their HR services to meet their unique needs. This ultimately increases the competitiveness of the company within the industry since they are able to address the gaps and act on weak areas as they leverage their strengths. More so the client is able to fully engage its resource in the areas where they suit and thus cut on the overall cost brought about by inefficiency, wastage, delays, which saves on overall operational costs.",
    subServices: [
      "Job Analysis and Evaluation",
      "Staff Training and Development",
      "Performance Management Review",
      "HR Policies and Procedures Development",
      "Market / Salary Surveys",
      "Employee Satisfaction Surveys",
      "Human Resource Audit",
      "Human Resource Information System",
      "Organizational Development/Restructuring",
    ],
  },
  {
    id: "employee-recruitment",
    title: "Employee Recruitment, Selection & Retention",
    description: "Finding and retaining the best talent through a thorough and integrity-driven selection process.",
    content: "We measure our success in terms of our clients’ return on investment in talent attraction and retention. A successful selection produces candidates of high quality and results from a selection process with thoroughness and integrity our clients can testify to. While following our thorough selection process, we pay attention to detail and emphasize open, honest, and ongoing communication with the client. Without the right people, strategies are just papers on shelves. We can put your mind at rest by getting the best person for the job and at the same time make sure that you do everything by the book from a legal perspective. We can help you with your one-off appointments or major recruitment drives by completing the whole process or a part of the process like writing a particular job description or selection criteria -no job is too big or small.",
    subServices: [],
  },
  {
    id: "outsourced-hr-services",
    title: "Outsourced HR Services",
    description: "Comprehensive HR management, from recruitment to payroll, so you can focus on your core business.",
    content: "We offer employee outsourcing to local and non-local companies. We take all the HR responsibilities as the client focuses on the core functions of the business. We carry out the staff recruitment and selection, staff induction, issue employment contracts under our name, process the staff payroll, make payment distribution, remit employee’s taxes and statutory payments, issue payslips, and ensure day to day employee engagement and management on behalf of the client. Every company must measure, manage, and improve its performance if it is to survive and your business is no exception.",
    subServices: [
      "Payroll Administration",
      "Ad-hoc Support (i.e. Market Research & Surveys)",
      "HR Helplines",
      "HR Advice",
      "Certain Amount Of Days On Site Per Month",
      "Benefits Administration",
      "HR Systems",
      "HR Materials",
      "Personnel Administration among others",
    ],
  },
  {
    id: "head-hunting",
    title: "Head Hunting/Executive Search",
    description: "Finding, attracting, and retaining the best people in the market to give your business a competitive edge.",
    content: "People. People. People. The only treasure businesses ride on. They are the face of the business and therefore without them, strategies are just papers on shelves. Businesses that have recognized their human resources as valuable assets have a comprehensive competitive advantage over others. Top talent cannot be sourced through adverts and thus we step in to deliver the most committed and competent talent and while we help your business attain this status. Our core business on executive search is to help you find, attract, motivate, and retain the best people in the market.",
    subServices: [],
  },
  {
    id: "training-development",
    title: "Training & Development",
    description: "Optimizing human capital through need-based training and development programs.",
    content: "We recognize that in order to optimize human capital, need-based training is vital. We offer an unrivaled range of training and development services. Our team will also help you with projects such as designing competency frameworks, training plans, training needs analysis, training department set up and training consulting. We thus collaborate with clients to understand their strategic focus and help them to design a training program that helps them to attain the desired outcome. We also recognize that some training is required in order to meet legal legislation and thus to ensure compliance, we assist in such training i.e OSH training (fire marshals training, First Aid Training, and Occupational Safety and Health training) in consultation with OSH experts.",
    subServices: [
        "Team Work & Team Building training",
        "Leadership training",
        "Emotional Intelligence training",
        "Strategic Management in the Public Sector training",
        "Successful Female Leader training",
        "Advanced Presentation Skills training",
        "Best Foot Forward training",
        "Sales training",
        "Finance training",
    ],
  },
  {
    id: "psychometric-assessments",
    title: "Psychometric Assessments",
    description: "Enhancing the recruitment process by providing evidence of ability, potential, and culture fit.",
    content: "Psychometric tests greatly enhance the recruitment process by providing evidence of ability or potential in a particular area that may not have been captured during the normal interview process. This mostly assists companies to identify a culture match which is very vital for new employee’s adoption of the company and also his future performance. At Sunlit Centre Kenya, we provide this service at an affordable rate and also share a report which summarizes the candidate’s cognitive abilities, behavioral traits, and interests. These tools further provide additional particular traits as per the job description of the job as specified by the client.",
    subServices: [],
  },
  {
    id: "content-marketing",
    title: "Content Marketing",
    description: "Connecting you with your target audience through meaningful, data-driven content marketing solutions.",
    content: "Make your connection more meaningful with Sunlit Centre Kenya’s content marketing solutions. Powered by AI and machine learning, it automatically puts the right messages in front of a aRandom rand()om people – guiding them down the recruiting funnel toward conversion quickly, seamlessly, and efficiently. Want to reach people in Marketing and Advertising? We over modern solutions for a marketing strategy company depending on the demographics and relevant targeted audience. Unlike most out of home advertisers, Sunlit Centre Kenya allows advertisers to select dayparts down to the week(s), rotating ads and targeting lifestyles.",
    subServices: [],
  },
];

const OurServices = () => {
  const scrollToService = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-background text-foreground">
      <TopBar />
      <Navbar />
      <Hero title="What we offer" imageSrc="https://i.ibb.co/RTYskxLv/image.png" />

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-serif bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">Our Services</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => scrollToService(service.id)}
            >
              <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
              <span className="text-cta font-semibold flex items-center">
                Learn More <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Services Section */}
      <div className="container mx-auto px-4">
        {services.map((service, index) => (
          <section
            key={service.id}
            id={service.id}
            className={`py-16 ${index < services.length - 1 ? 'border-b' : ''}`}
          >
            <h2 className="text-3xl font-serif mb-4">{service.title}</h2>
            <p className="text-muted-foreground mb-6 whitespace-pre-line">{service.content}</p>
            {service.subServices.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3">Key areas include:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {service.subServices.map((sub) => (
                    <li key={sub}>{sub}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default OurServices;
