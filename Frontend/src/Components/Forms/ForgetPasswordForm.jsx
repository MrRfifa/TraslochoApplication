import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaArrowCircleLeft } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AuthService from "../../Services/Auth/AuthServices";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ForgetPasswordForm = () => {
  const { t } = useTranslation("password");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onFinish(values) {
    try {
      setLoading(true);
      const response = await AuthService.forgetPassword(values.email);
      if (response.success) {
        toast.success(response.message, {
          duration: 4500,
          position: "top-right",
          icon: "🔥",
          className: "bg-green-500 text-white",
        });

        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        throw new Error("Password reset is failed");
      }
    } catch (error) {
      toast.error(
        error.message ||
          "An error occurred during password reset. Please try again later.",
        {
          duration: 2500,
          position: "top-right",
          icon: "💀",
          className: "bg-yellow-500 text-white",
        }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center justify-center h-screen dark">
        <div className="w-full max-w-md bg-black rounded-lg shadow-md p-6">
          <div className="flex flex-row justify-start mb-5">
            <Link to="/">
              <FaArrowCircleLeft size={40} color="#FCA311" />
            </Link>
            <h2 className="text-2xl pl-[25%] font-bold text-[#FCA311] mb-4">
              {t("forgetPasswordTitle")}
            </h2>
          </div>
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email(t("emailError"))
                .required(t("emailReq")),
            })}
            onSubmit={onFinish}
          >
            <Form className="flex flex-col ">
              <div className="-space-y-4">
                <Field
                  type="email"
                  name="email"
                  placeholder={t("email")}
                  className="bg-gray-700 text-gray-200 border-0 w-[100%] rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 pb-5 text-xs"
                />
              </div>

              <button
                disabled={loading}
                className="bg-[#14213D] text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-[#FCA311] transition ease-in-out duration-150"
                type="submit"
              >
                {loading ? (
                  <ImSpinner9
                    className="text-white animate-spin mx-auto"
                    size={25}
                  />
                ) : (
                  t("forgetButton")
                )}
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};
