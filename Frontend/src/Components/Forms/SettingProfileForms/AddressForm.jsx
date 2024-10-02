import { useEffect, useState } from "react";
import {
  countryData,
  findCountryByCode,
} from "../../../Helpers/europian_countries";
import UserAddress from "../../../Redux/SlicesCalls/UserAddress";
import { states } from "country-cities";
import { FcCancel, FcCheckmark, FcSupport } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../Redux/Features/userAddress";
import { ImSpinner9 } from "react-icons/im";
import { onFinishAddressUpdate } from "../../../Helpers/Services/UserServicesCall";

const AddressForm = () => {
  const dispatch = useDispatch();
  const userAddressState = useSelector((state) => state.userAddress);
  UserAddress();

  const [updateAddress, setUpdateAddress] = useState(false);
  const [countryStates, setCountryStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [userAddress, setUserAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    password: "",
  });

  useEffect(() => {
    setUserAddress({
      city: userAddressState.value.city,
      state: userAddressState.value.state,
      country: userAddressState.value.country,
      street: userAddressState.value.street,
      zipCode: userAddressState.value.zipCode,
      password: "",
    });
  }, [userAddressState]);

  const handleCountryChange = (event) => {
    const selectedCountryCode = event;
    const selectedCountry = findCountryByCode(countryData, selectedCountryCode);
    if (selectedCountry) {
      setUserAddress({ ...userAddress, country: selectedCountry.name });
      setCountryStates(states.getByCountry(selectedCountry.code));
    }
  };

  const handleUpdateAddress = () => {
    setUpdateAddress((prevUpdateAddress) => !prevUpdateAddress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Reset error message
    try {
      const response = await onFinishAddressUpdate(
        userAddress.city,
        userAddress.street,
        userAddress.country,
        userAddress.state,
        userAddress.zipCode,
        userAddress.password
      );
      if (response.success === true) {
        dispatch(
          login({
            street: response.street,
            city: response.city,
            state: response.state,
            zipCode: response.zipCode,
            country: response.country,
          })
        );
      } else {
        setErrorMessage("Address update failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error updating address: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUserAddress({
      city: userAddressState.value.city,
      state: userAddressState.value.state,
      street: userAddressState.value.street,
      zipCode: userAddressState.value.zipCode,
      country: userAddressState.value.country,
      password: "",
    });
    handleUpdateAddress();
  };

  return (
    <form
      className="w-full max-w-3xl space-y-5 flex flex-col justify-start"
      onSubmit={handleSubmit}
    >
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}

      <div className="w-full space-y-5 md:space-y-0 md:space-x-5 flex flex-col md:flex-row">
        {/* Select country dropdown */}
        <select
          required
          disabled={!updateAddress}
          name="country"
          className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500 w-full md:w-1/3"
          onChange={(e) => handleCountryChange(e.target.value)}
          value={userAddress.country}
          style={{ cursor: !updateAddress ? "not-allowed" : "default" }}
        >
          {countryData.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>

        {/* Select state dropdown */}
        <select
          required
          disabled={!updateAddress}
          name="state"
          placeholder="Select State"
          className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500 w-full md:w-1/3"
          style={{ cursor: !updateAddress ? "not-allowed" : "default" }}
          value={userAddress.state}
          onChange={(e) =>
            setUserAddress({ ...userAddress, state: e.target.value })
          }
        >
          <option value="" className="opacity-10">
            {userAddress.state}
          </option>
          {countryStates.map((state) => (
            <option key={state.isoCode} value={state.name}>
              {state.name} ({state.isoCode})
            </option>
          ))}
        </select>

        {/* City input */}
        <input
          required
          disabled={!updateAddress}
          type="text"
          placeholder="City"
          value={userAddress.city}
          className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500 w-full md:w-1/3"
          style={{ cursor: !updateAddress ? "not-allowed" : "text" }}
          onChange={(e) =>
            setUserAddress({ ...userAddress, city: e.target.value })
          }
        />
      </div>
      <div className="w-full space-y-5 md:space-y-0 md:space-x-5 flex flex-col md:flex-row">
        {/* Street input */}
        <input
          required
          disabled={!updateAddress}
          type="text"
          placeholder="Street"
          value={userAddress.street}
          className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500 w-full md:w-full"
          style={{ cursor: !updateAddress ? "not-allowed" : "text" }}
          onChange={(e) =>
            setUserAddress({ ...userAddress, street: e.target.value })
          }
        />

        {/* Zip Code input */}
        <input
          required
          disabled={!updateAddress}
          type="text"
          placeholder="Zip Code"
          value={userAddress.zipCode}
          className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500 w-full md:w-full"
          style={{ cursor: !updateAddress ? "not-allowed" : "text" }}
          onChange={(e) =>
            setUserAddress({ ...userAddress, zipCode: e.target.value })
          }
        />
        {/* Password input */}
        {updateAddress && (
          <input
            required
            type="password"
            placeholder="Password"
            value={userAddress.password}
            className="ring-1 ring-gray-400 rounded-md text-md px-2 py-2 outline-none bg-gray-100 focus:placeholder-gray-500 w-full md:w-full"
            onChange={(e) =>
              setUserAddress({ ...userAddress, password: e.target.value })
            }
          />
        )}
        <div className=" flex flex-row justify-end space-x-5">
          <button
            type="button"
            className="p-2 border-2 rounded-lg"
            onClick={!updateAddress ? handleUpdateAddress : handleCancel}
          >
            {!updateAddress ? <FcSupport size={22} /> : <FcCancel size={22} />}
          </button>
          {updateAddress && (
            <button
              type="submit"
              className="p-2 border-2 rounded-lg"
              onClick={handleUpdateAddress}
            >
              {isLoading ? (
                <ImSpinner9
                  size={22}
                  className="text-green-500 animate-spin mx-auto"
                />
              ) : (
                <FcCheckmark size={22} />
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddressForm;
