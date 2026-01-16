import { Zoom } from "react-awesome-reveal";

const About = () => {
  return (
    <section className="py-20 bg-[#f7a41d]">
      <Zoom>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Strategic Advisory
            </h2>
            <div className="text-white/90 space-y-4 text-left">
              <p>
                Understanding of the future direction of your business is a
                perquisite for success. This future is built through growth and
                change. We at Sunlit Centre Kenya are ready to partner with you in
                order to assist your business move to the next level. This can
                only be possible through sound and sustainable strategies that
                will ignite innovation and creativity, motivation, positive
                change and growth while minimizing the downside.
              </p>
              <p>
                Our experienced partners apply the “Pareto Principle” and
                acknowledge that understanding your business is a vital
                ingredient in strategy implementation. By taking off to think
                together, undertaking an operational review of your business, its
                environment and the challenges it faces, our strategy team will
                embark on a swift journey of well researched, experienced and
                knowledge-based solutions.
              </p>
            </div>
          </div>
        </div>
      </Zoom>
    </section>
  );
};

export default About;
