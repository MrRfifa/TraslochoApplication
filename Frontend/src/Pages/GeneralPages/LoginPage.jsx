import { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import SignInForm from "../../Components/Forms/SignInForm";
import loginImage1 from "../../assets/Generals/sign-in-up/login-owner.jpg";
import loginImage2 from "../../assets/Generals/sign-in-up/login-transporter.jpg";

const LoginPage = () => {
  const randomDecimal = Math.random();
  const randomNumber = Math.round(randomDecimal);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-screen w-full bg-[#E5E5E5]">
        <SignInForm />
        <div className="hidden sm:block">
          {randomNumber ? (
            <img
              className="w-full h-full object-cover"
              src={loginImage1}
              alt="regiter cam image"
            />
          ) : (
            <img
              className="w-full h-full object-cover"
              src={loginImage2}
              alt="regiter cam image"
            />
          )}
        </div>
      </div>
    </animated.div>
  );
};

export default LoginPage;
