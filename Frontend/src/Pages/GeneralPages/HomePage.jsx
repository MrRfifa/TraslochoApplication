import Navbar from "../../Layout/Navbar";
import Main from "../../Layout/Main";
import ServiceSection from "../../Layout/ServiceSection";
import AboutSection from "../../Layout/AboutSection";
import ContactSection from "../../Layout/ContactSection";
import Footer from "../../Layout/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Main />
      <ServiceSection />
      <AboutSection />
      <ContactSection />
      {/* <Footer /> */}
    </>
  );
};

export default HomePage;
