import Navbar from "../../Layout/Navbar";
import Main from "../../Layout/Main";
import ServiceSection from "../../Layout/ServiceSection";
import AboutSection from "../../Layout/AboutSection";
import ContactSection from "../../Layout/ContactSection";
import Footer from "../../Layout/Footer";
import { useSpring, animated } from "react-spring";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [loaded, setLoaded] = useState(false);

  const fadeIn = useSpring({
    opacity: loaded ? 1 : 0,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <>
      <animated.div style={fadeIn}>
        <Navbar />
        <Main />
        <ServiceSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </animated.div>
    </>
  );
};

export default HomePage;
