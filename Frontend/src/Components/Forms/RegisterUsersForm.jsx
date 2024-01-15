import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { states } from "country-cities";
import { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";

import { countryData, findCountry } from "../../Helpers/europian_countries";
import { validateRegisterUsersForm } from "../../Helpers/FormsValidations";
import { OnFinishRegisterUsersForm } from "../../Helpers/FormsSubmits";
import { RegisterUserFormStates } from "../../Helpers/FormsStates";
import { dangerToast, errorToast, successToast } from "../Toasts";

const RegisterUsersForm = ({ transporter }) => {
  const [loading, setLoading] = useState(false);
  const [fieldValue, setFieldValue] = useState(8);
  const [countryStates, setCountryStates] = useState([]);
  const [country, setCountry] = useState("");

  const { formData, setFormData, errors, setErrors } = RegisterUserFormStates();

  const handleCountryChange = (event) => {
    const selectedCountryCode = parseInt(event.target.value);
    const selectedCountry = findCountry(countryData, selectedCountryCode);
    if (selectedCountry) {
      setFieldValue(selectedCountry.numberOfDigits);
      setCountry(selectedCountry.name);
      setFormData({
        ...formData,
        userCountryPrefix: selectedCountry.prefix,
      });
      setCountryStates(states.getByCountry(selectedCountry.code));

      console.log(country);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({
        ...formData,
        userProfileImage: event.target.files[0],
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    // console.log(formData);
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      userCountry: country,
    }));
  }, [country, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const isValid = validateRegisterUsersForm(formData, setErrors);

      if (isValid) {
        successToast("Form validation successful!");
        await OnFinishRegisterUsersForm(formData, transporter);
      } else {
        errorToast("Form validation failed");
      }
    } catch (error) {
      console.log(error);
      dangerToast("Error during form submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center justify-center h-screen dark">
        <div className="w-full max-w-lg bg-[#14213D] rounded-lg shadow-md p-6">
          <div className="flex flex-row justify-start mb-8">
            <Link to="/">
              <FaArrowCircleLeft
                className="hover:scale-125 duration-300 ease-in transform"
                size={40}
                color="#FCA311"
              />
            </Link>
            <h2 className="text-2xl pl-[25%] font-bold text-[#FCA311] mb-4">
              SIGN UP
            </h2>
          </div>
          <form
            className="flex flex-col"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="flex space-x-4 mb-2">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-white text-sm">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Jon"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <span className="text-red-500 text-sm">{errors.firstName}</span>
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-white text-sm">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <span className="text-red-500 text-sm">{errors.firstName}</span>
              </div>
            </div>

            <div className="flex space-x-4 mb-2">
              <div className="w-1/2">
                <label htmlFor="email" className="block text-white text-sm">
                  Email
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  placeholder="exam.exa@ex.com"
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <span className="text-red-500 text-sm">{errors.userEmail}</span>
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-white text-sm"
                >
                  Date of birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <span className="text-red-500 text-sm">
                  {errors.dateOfBirth}
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mb-2">
              <div className="w-1/2">
                <label htmlFor="password" className="block text-white text-sm">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  placeholder="Password"
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <span className="text-red-500 text-sm">{errors.password}</span>
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-sm"
                >
                  Retype Password
                </label>
                <input
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mb-2">
              <div className="w-1/3">
                {/* <label className="text-white text-xs block">Phone number</label> */}
                <select
                  type="text"
                  name="userCountryPrefix"
                  placeholder="Select Country"
                  className="bg-gray-700 text-gray-200 border-0 rounded-lg p-2 w-full focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  onChange={(e) => {
                    handleCountryChange(e);
                    handleChange(e);
                  }}
                >
                  <option value="" className="opacity-10">
                    Select Country
                  </option>
                  {countryData.map((country) => (
                    <option
                      key={country.code}
                      value={country.prefix}
                      // className={`fi fi-${country.code}`}
                    >
                      {country.name} (+{country.prefix})
                    </option>
                  ))}
                </select>
                <span className="text-red-500 text-sm">
                  {errors.userCountryPrefix}
                </span>
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  name="userPhoneNumber"
                  placeholder="12345789"
                  value={formData.userPhoneNumber}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-full focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  maxLength={fieldValue}
                />
                <span className="text-red-500 text-sm">
                  {errors.userPhoneNumber}
                </span>
              </div>
            </div>
            <div className="flex space-x-4 mb-2">
              <div className="w-1/3">
                <input
                  disabled={true}
                  value={country}
                  // name="userCountry"
                  // value={formData.userCountry}
                  // onChange={handleChange}
                  placeholder="Select Country"
                  className="bg-gray-700 opacity-60 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
              </div>
              <div className="w-1/3">
                <select
                  type="text"
                  name="userState"
                  value={formData.userState}
                  onChange={handleChange}
                  placeholder="state"
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                >
                  <option value="" className="opacity-10">
                    Select State
                  </option>
                  {countryStates.map((state) => (
                    <option
                      key={state.isoCode}
                      value={state.name}
                      // className={`fi fi-${country.code}`}
                    >
                      {state.name} ({state.isoCode})
                    </option>
                  ))}
                </select>
                <span className="text-red-500 text-sm">{errors.userState}</span>
              </div>
              <div className="w-1/3">
                <input
                  type="text"
                  name="userCity"
                  value={formData.userCity}
                  onChange={handleChange}
                  placeholder="City"
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-[100%] focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                />
                <span className="text-red-500 text-sm">{errors.userCity}</span>
              </div>
            </div>

            <div className="flex space-x-4 mb-2">
              <div className="w-1/3">
                <input
                  type="number"
                  name="userZipCode"
                  value={formData.userZipCode}
                  onChange={handleChange}
                  placeholder="ZIP Code"
                  className="bg-gray-700 text-gray-200 border-0 rounded-lg p-2 w-full focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  // onChange={(e) => handleCountryChange(e, setFieldValue)}
                />
                <span className="text-red-500 text-sm">
                  {errors.userZipCode}
                </span>
              </div>
              <div className="w-2/3">
                <input
                  type="text"
                  name="userStreet"
                  value={formData.userStreet}
                  onChange={handleChange}
                  placeholder="abc defgl 123 cw"
                  // value={phoneNumber}
                  // onChange={handlePhoneNumberChange}
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-full focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  // maxLength={fieldValue}
                />
                <span className="text-red-500 text-sm">
                  {errors.userStreet}
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mb-2">
              <div className="w-full">
                <label
                  htmlFor="userProfileImage"
                  className="text-white text-xs"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  id="userProfileImageId"
                  name="userProfileImage"
                  onChange={handleImageChange}
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-full  focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 file:px-5 file:mx-5 file:rounded-full file:bg-[#FCA311] file:cursor-pointer file:text-white "
                />
                <span className="text-red-500 text-sm">{errors.userLogo}</span>
              </div>
            </div>

            <p className="text-white mt-4">
              <Link
                to="/login"
                className="text-sm text-[#FCA311] -200 hover:underline mt-4"
              >
                Already have an account?
              </Link>
            </p>
            <button
              className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 transition ease-in-out duration-150"
              type="submit"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterUsersForm;

RegisterUsersForm.propTypes = {
  transporter: PropTypes.bool.isRequired,
};
