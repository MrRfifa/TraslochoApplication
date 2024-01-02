import AOS from "aos";
import "aos/dist/aos.css";
import contactImg from "../assets/home/contact.svg";

const ContactSection = () => {
  AOS.init({
    duration: 500,
    easing: "ease-in-out",
  });

  const animationConfig = {
    fadeUpRight: {
      "data-aos": "fade-up-right",
      "data-aos-offset": 200,
      "data-aos-delay": 50,
    },
    fadeDownRight: {
      "data-aos": "fade-down-right",
      "data-aos-offset": 200,
      "data-aos-delay": 50,
    },
  };

  return (
    <div
      id="contact"
      className="w-full h-screen bg-white py-8 lg:py-28 px-4 text-black"
    >
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 gap-5">
        <img
          {...animationConfig.fadeUpRight}
          className="w-[600px] mx-auto my-10"
          src={contactImg}
          alt="european union image"
        />
        <div className="flex flex-col justify-center space-y-5">
          <h1
            {...animationConfig.fadeDownRight}
            className="text-[#FCA311] md:text-3xl sm:text-2xl text-xl font-bold py-2"
          >
            Lorum Ipsum,
          </h1>
          <p
            {...animationConfig.fadeDownRight}
            className="md:text-5xl sm:text-3xl text-2xl font-bold py-2"
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
          <p
            {...animationConfig.fadeDownRight}
            className="md:text-xl sm:text-lg text-base font-bold py-2"
          >
            Veritatis repudiandae facilis quae quisquam culpa iste animi
            officiis eligendi velit reprehenderit nobis dolore accusamus modi
            magnam deserunt, nemo tempora, perferendis necessitatibus! Unde
            architecto optio error.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
