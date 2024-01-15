import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

import registerImg from "../../assets/Generals/sign-in-up/register-transporter.jpg";
import RegisterTransporterForm from "../../Components/Forms/RegisterTransporterForm";

const RegisterCompany = () => {
  const [loaded, setLoaded] = useState(false);

  const fadeIn = useSpring({
    opacity: loaded ? 1 : 0,
    from: { opacity: 0 },
    config: { duration: 1500 },
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <animated.div style={fadeIn}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-screen w-full">
        <RegisterTransporterForm />
        <div className="hidden sm:block">
          <img
            className="w-full h-full object-cover"
            src={registerImg}
            alt="regiter cam image"
          />
        </div>
      </div>
    </animated.div>
  );
};

export default RegisterCompany;
