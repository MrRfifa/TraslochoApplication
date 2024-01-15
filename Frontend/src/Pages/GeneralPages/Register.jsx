import { useSpring, animated } from "react-spring";
import {
  GeneralBlackCard,
  GeneralWhiteCard,
} from "../../Components/Cards/GeneralCard";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { LabelDestinationLinkButton } from "../../Components/Buttons/CustomizedButtons";

const Register = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-screen w-full">
      <animated.div style={fadeIn}>
        <div className="flex absolute items-center justify-center mt-3 ml-3">
          <LabelDestinationLinkButton
            label={<FaHome size={30} />}
            destination="/"
          />
        </div>

        <div className="hidden md:flex w-full h-full items-center justify-center bg-white">
          <GeneralWhiteCard />
          <img/>
        </div>

        <div className="block md:hidden w-full h-full  items-center justify-center bg-white text-black">
          <div className="text-white">Content for smaller screens</div>
        </div>
      </animated.div>

      <animated.div style={fadeIn}>
        <div className="hidden md:flex w-full h-full items-center justify-center bg-black">
          <GeneralBlackCard />
        </div>

        <div className="block md:hidden w-full h-full  items-center justify-center bg-black">
          <div className="text-white">Content for smaller screens</div>
        </div>
      </animated.div>
    </div>
  );
};

export default Register;
