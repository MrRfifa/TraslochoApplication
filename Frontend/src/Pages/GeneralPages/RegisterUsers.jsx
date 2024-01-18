import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

import registerTransporter from "../../assets/Generals/sign-in-up/register-transporter.jpg";
import registerOwner from "../../assets/Generals/sign-in-up/register-owner.jpg";
import RegisterUsersForm from "../../Components/Forms/RegisterUsersForm";
import { useLocation } from "react-router-dom";

const RegisterUsers = () => {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname === "/register-private";

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
        {currentPath ? (
          <>
            <div>
              <RegisterUsersForm transporter={currentPath} />
            </div>
            <div className="hidden sm:block">
              <img
                className="w-full h-full object-cover"
                src={registerTransporter}
                alt="register cam image"
              />
            </div>
          </>
        ) : (
          <>
            <div className="hidden sm:block">
              <img
                className="w-full h-full object-cover"
                src={registerOwner}
                alt="register cam image"
              />
            </div>
            <div>
              <RegisterUsersForm transporter={currentPath} />
            </div>
          </>
        )}
      </div>
    </animated.div>
  );
};

export default RegisterUsers;
