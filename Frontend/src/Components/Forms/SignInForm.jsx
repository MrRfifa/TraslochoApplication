import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { FaArrowCircleLeft } from "react-icons/fa";
import { dangerToast } from "../Toasts";
import { OnFinishLoginUsersForm } from "../../Helpers/FormsSubmits";
import { Toaster } from "react-hot-toast";

const SignInForm = () => {
  const [loading, setLoading] = useState(false);

  async function onFinish(values) {
    try {
      setLoading(true);
      await OnFinishLoginUsersForm(values.email, values.password);
      window.location.reload("/shipments");
    } catch (error) {
      console.error(error);
      dangerToast("Error during form submission");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster />
      <div className="relative flex flex-col rounded-xl items-center justify-center h-screen dark">
        <div className="w-full max-w-md bg-black rounded-lg shadow-md p-6">
          <div className="flex flex-row justify-start mb-10">
            <Link
              className="hover:scale-125 duration-300 ease-in transform"
              to="/"
            >
              <FaArrowCircleLeft size={40} color="#FCA311" />
            </Link>
            <h2 className="text-2xl pl-[25%] font-bold text-[#FCA311] mb-4">
              SIGN IN
            </h2>
          </div>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
            })}
            onSubmit={onFinish}
          >
            <Form className="flex flex-col">
              <div className="flex flex-col justify-start -space-y-4">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="bg-gray-700 text-gray-200 border-0 w-[100%] rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 pb-5 text-xs"
                />
              </div>

              <div className="flex flex-col justify-start -space-y-4">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="bg-gray-700 text-gray-200 border-0 rounded-md w-[100%] p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div className="flex flex-col">
                <p className="text-white mt-4">
                  <Link
                    to="/register"
                    className="text-sm text-[#FCA311] -200 hover:underline mt-4"
                  >
                    Don&apos;t have an account?
                  </Link>
                </p>
                <p className="text-white mt-4">
                  <Link
                    to="/forget-password"
                    className="text-sm text-[#FCA311] -200 hover:underline mt-4"
                  >
                    Forget your password?
                  </Link>
                </p>
              </div>
              <button
                className="bg-[#14213D] text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-[#FCA311] transition ease-in-out duration-150"
                type="submit"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default SignInForm;