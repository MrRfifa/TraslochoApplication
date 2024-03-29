import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AuthService from "../../Services/Auth/AuthServices";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { useTranslation } from "react-i18next";

export const ResetPasswordForm = () => {
  const { t } = useTranslation("password");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function onFinish(values) {
    try {
      setLoading(true);
      const response = await AuthService.resetPassword(
        values.token,
        values.password,
        values.confirmPassword
      );
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
        toast.error(response.error || "Password reset is failed", {
          duration: 2500,
          position: "top-right",
          icon: "💀",
          className: "bg-yellow-500 text-white",
        });
        setLoading(false);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 3500);
      }
    } catch (error) {
      toast.error("An error occurred during login. Please try again later.", {
        duration: 2000,
        position: "top-right",
        icon: "🤌🏻",
        className: "bg-red-500 text-white",
      });
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
              {t("resetPasswordTitle")}
            </h2>
          </div>
          <Formik
            initialValues={{
              token: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              token: Yup.string().required(t("tokenReq")),
              password: Yup.string()
                .min(8, t("passwordLengthError"))
                .required(t("passReq"))
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("passwordError")),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], t("passwordMatch"))
                .required(t("confPassReq")),
            })}
            onSubmit={onFinish}
          >
            <Form className="flex flex-col">
              <div className="-space-y-4">
                <Field
                  type="text"
                  name="token"
                  placeholder={t("token")}
                  className="bg-gray-700 text-gray-200 border-0 w-[100%] rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <ErrorMessage
                  name="token"
                  component="div"
                  className="text-red-500 pb-5 text-xs"
                />
              </div>
              <div className="-space-y-4">
                <Field
                  type="password"
                  name="password"
                  placeholder={t("password")}
                  className="bg-gray-700 text-gray-200 border-0 rounded-md w-[100%] p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 pb-5 text-xs"
                />
              </div>

              <div className="-space-y-4">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder={t("confirmNewPassword")}
                  className="bg-gray-700 text-gray-200 border-0 w-[100%] rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <ErrorMessage
                  name="confirmPassword"
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
                  t("resetButton")
                )}
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};
