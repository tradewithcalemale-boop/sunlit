
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const CVDatabase = () => {
  return (
    <div className="bg-background text-foreground">
      <TopBar />
      <Navbar />
      <Hero title="CV Database" imageSrc="https://i.ibb.co/rKjQDb7q/image.png" />
      <section className="container mx-auto px-4 py-16">
        <div className="prose lg:prose-xl max-w-none">
          <h2 className="text-3xl font-serif mb-4">CV Writing Services</h2>
          <p>
            Have you been applying for online and newspaper job adverts and not
            getting any interviews?
          </p>
          <p>
            You have the qualifications, experiences and skills but are not
            getting interview invitation then your CV could be the problem.
          </p>
          <p>
            We have helped many Kenyan professionals get new and better jobs
            through our CV writing and job placement service.
          </p>
          <p>
            <strong>Try our CV writing expertise today.</strong>
          </p>

          <h3 className="text-2xl font-serif mt-8 mb-4">How it works</h3>
          <ul className="list-disc pl-6">
            <li>Send your CV to us in MS Word format.</li>
            <li>
              An experienced HR consultant will study and review your CV and
              re-write to a new design, layout and add key pertinent
              information relevant to your qualifications
            </li>
            <li>
              The CV is made as specific to you as possible such that a person
              reading it will feel you are competent enough.
            </li>
            <li>
              The new CV is added to our database where we consider you for new
              job openings.
            </li>
          </ul>

          <h3 className="text-2xl font-serif mt-8 mb-4">
            CV Writing Categories And Charges
          </h3>
          <p>
            The charges for CV writing vary according to the work experience
            that you have.
          </p>
          <p>
            Through Mpesa Buy Goods Number which will be shared to the candidate
            when the CV Writing starts
          </p>
          <p>
            After your CV has been done, we add it to our database for future
            job openings.
          </p>

          <h3 className="text-2xl font-serif mt-8 mb-4">
            What is required from the candidate?
          </h3>
          <p>You are required to send a copy of your current CV.</p>

          <h3 className="text-2xl font-serif mt-8 mb-4">
            How to contact us for a professional CV
          </h3>
          <p>
            Email your CV (Ms Word) to{' '}
            <a href="mailto:info@sunlitcentrekenya.co.ke">
              info@sunlitcentrekenya.co.ke
            </a>{' '}
            with subject line CV Writing
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CVDatabase;
