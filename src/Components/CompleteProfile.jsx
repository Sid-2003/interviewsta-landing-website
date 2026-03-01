import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoInterview } from "../Contexts/VideoInterviewContext";
import { Loader2 } from "lucide-react";
import Logo from "../assets/logo.png";
import PhoneInputWithCountry from "./Common/PhoneInputWithCountry";
import CountrySelect from "./Common/CountrySelect";

/**
 * Shown after OAuth sign-in when user has no phone/country on profile.
 * Captures phone number and country/region, then redirects to dashboard.
 */
const CompleteProfile = () => {
  const navigate = useNavigate();
  const { state, updateProfile } = useVideoInterview();
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role") || state?.auth?.role || "student";

  const redirectByRole = (r) => {
    if (r === "teacher") navigate("/teacher/classes", { replace: true });
    else if (r === "admin") navigate("/admin/dashboard", { replace: true });
    else navigate("/manage", { replace: true });
  };

  useEffect(() => {
    const hasPhone = state?.auth?.user?.phone;
    const hasCountry = state?.auth?.user?.country;
    if (hasPhone && hasCountry) {
      if (role === "teacher") navigate("/teacher/classes", { replace: true });
      else if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/manage", { replace: true });
    }
  }, [state?.auth?.user?.phone, state?.auth?.user?.country, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPhone = (phone && typeof phone === "string" ? phone : "").trim();
    const trimmedCountry = (country || "").trim().toUpperCase();
    if (!trimmedPhone) {
      setError("Please enter your phone number.");
      return;
    }
    if (!trimmedCountry || trimmedCountry.length !== 2) {
      setError("Please select your country or region.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const result = await updateProfile({ phone: trimmedPhone, country: trimmedCountry });
      if (result.success) {
        redirectByRole(role);
      } else {
        setError(result.error?.phone?.[0] || result.error?.country?.[0] || result.error || "Failed to save. Try again.");
        setSubmitting(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <img src={Logo} alt="Interviewsta" className="h-12 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Complete your profile</h1>
          <p className="text-gray-600 mt-1">
            Add your phone number and country so we can reach you when needed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone number
            </label>
            <div className={submitting ? "opacity-50 pointer-events-none" : ""}>
              <PhoneInputWithCountry
                id="phone"
                value={phone}
                onChange={(v) => setPhone(v || "")}
                onCountryChange={(c) => setCountry(c || "")}
                defaultCountry="US"
                disabled={submitting}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country / Region
            </label>
            <CountrySelect
              id="country"
              value={country}
              onChange={setCountry}
              disabled={submitting}
              placeholder="Select your country or region"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          You can skip and add it later from your account settings.
        </p>
        <button
          type="button"
          onClick={() => redirectByRole(role)}
          className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;
