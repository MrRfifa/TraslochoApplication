import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import loginImage1 from "../../assets/Generals/sign-in-up/login-owner.jpg";
import loginImage2 from "../../assets/Generals/sign-in-up/login-transporter.jpg";
import SignInForm from "../../Components/Forms/Login/SignInForm";
import LoginSmallScreen from "../../Components/Forms/Login/LoginSmallScreen";

const LoginPage = () => {
  const [loaded, setLoaded] = useState(false);

  const fadeIn = useSpring({
    opacity: loaded ? 1 : 0,
    from: { opacity: 0 },
    config: { duration: 1500 },
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const randomImage = Math.random() < 0.5 ? loginImage1 : loginImage2;

  return (
    <animated.div style={fadeIn}>
      <div className="flex flex-col sm:flex-row h-screen w-full bg-[#E5E5E5]">
        {/* Large screens */}
        <div className="hidden sm:flex flex-1">
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover"
              src={randomImage}
              alt="register cam image"
            />
            <div className="absolute inset-0  items-center justify-center">
              <SignInForm />
            </div>
          </div>
        </div>

        {/* Small/ Medium screens */}
        <div className="sm:hidden flex-1 bg-gray-50 text-white">
          <div className="h-full flex items-center justify-center">
            <LoginSmallScreen />
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default LoginPage;
