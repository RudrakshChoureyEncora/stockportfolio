import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterUserContext = createContext();

// ---------------------- //
//   CUSTOM CONTEXT HOOK
// ---------------------- //
export const useRUContext = () => {
  const context = useContext(RegisterUserContext);
  if (!context) {
    throw new Error("useRUContext must be used inside RUProvider");
  }
  return context;
};

// ---------------------- //
//     INITIAL STATE
// ---------------------- //
const initialState = {
  currentStep: 1,
  errors: {},
  isSubmitted: false,
  userId: "",
  email: "",
  username: "",
  password: "",
  personalInfo: {},
  investmentProfile: {},
};

// ---------------------- //
//        REDUCER
// ---------------------- //
const RUReducer = (state, action) => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "UPDATE_FIELD":
      return { ...state, [action.payload.key]: action.payload.value };

    case "UPDATE_PERSONAL_INFO":
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      };

    case "UPDATE_INVESTMENT_PROFILE":
      return {
        ...state,
        investmentProfile: {
          ...state.investmentProfile,
          ...action.payload,
        },
      };

    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.payload } };

    case "CLEAR_ERRORS":
      return { ...state, errors: {} };

    case "SET_SUBMITTED":
      return { ...state, isSubmitted: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

// ---------------------- //
//        PROVIDER
// ---------------------- //
export const RUProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RUReducer, initialState);
  const navigate = useNavigate(); // ✅ Correct usage

  // ----------------------------------- //
  // Load saved data from localStorage
  // ----------------------------------- //
  useEffect(() => {
    const savedUser = localStorage.getItem("registerUserData");
    if (savedUser) {
      const {
        userId,
        email,
        username,
        password,
        personalInfo,
        investmentProfile,
        currentStep,
      } = JSON.parse(savedUser);

      dispatch({
        type: "UPDATE_FIELD",
        payload: { key: "userId", value: userId },
      });
      dispatch({
        type: "UPDATE_FIELD",
        payload: { key: "email", value: email },
      });
      dispatch({
        type: "UPDATE_FIELD",
        payload: { key: "username", value: username },
      });
      dispatch({
        type: "UPDATE_FIELD",
        payload: { key: "password", value: password },
      });

      dispatch({ type: "UPDATE_PERSONAL_INFO", payload: personalInfo });
      dispatch({
        type: "UPDATE_INVESTMENT_PROFILE",
        payload: investmentProfile,
      });

      dispatch({ type: "SET_STEP", payload: currentStep });
    }
  }, []);

  // ----------------------------------- //
  // Save data to localStorage
  // ----------------------------------- //
  useEffect(() => {
    const hasData =
      state.email ||
      state.username ||
      Object.keys(state.personalInfo).length > 0 ||
      Object.keys(state.investmentProfile).length > 0;

    if (hasData || state.currentStep > 1) {
      localStorage.setItem(
        "registerUserData",
        JSON.stringify({
          userId: state.userId,
          email: state.email,
          username: state.username,
          password: state.password,
          personalInfo: state.personalInfo,
          investmentProfile: state.investmentProfile,
          currentStep: state.currentStep,
        })
      );
    }
  }, [
    state.userId,
    state.email,
    state.username,
    state.password,
    state.personalInfo,
    state.investmentProfile,
    state.currentStep,
  ]);

  // ---------------------- //
  //   STEP HANDLERS
  // ---------------------- //
  const nextStep = () => {
    if (state.currentStep < 4) {
      dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 4) {
      dispatch({ type: "SET_STEP", payload: step });
    }
  };

  const setErrors = (errors) =>
    dispatch({ type: "SET_ERRORS", payload: errors });
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" });

  const updatePersonalInfo = (data) =>
    dispatch({ type: "UPDATE_PERSONAL_INFO", payload: data });

  const updateField = (data) =>
    dispatch({ type: "UPDATE_FIELD", payload: data });

  const updateInvestmentProfile = (data) =>
    dispatch({ type: "UPDATE_INVESTMENT_PROFILE", payload: data });

  // ---------------------- //
  //    VALIDATION LOGIC
  // ---------------------- //
  const validateCurrentStep = () => {
    const errors = {};

    switch (state.currentStep) {
      case 1:
        if (!state.personalInfo.firstName?.trim())
          errors.firstName = "First name is required";

        if (!state.personalInfo.lastName?.trim())
          errors.lastName = "Last name is required";

        if (!state.personalInfo.phone?.trim()) {
          errors.phone = "Phone number is required";
        } else if (
          !/^\d{10}$/.test(state.personalInfo.phone.replace(/\D/g, ""))
        ) {
          errors.phone = "Phone number must be 10 digits";
        }

        if (!state.personalInfo.dateOfBirth?.trim())
          errors.dateOfBirth = "Date of birth is required";
        break;

      case 2:
        if (!state.email?.trim()) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(state.email)) {
          errors.email = "Email is invalid";
        }

        if (!state.username?.trim()) errors.username = "Username is required";

        if (!state.password?.trim()) {
          errors.password = "Password is required";
        } else if (state.password.length < 6) {
          errors.password = "Password must be at least 6 characters";
        }
        break;

      case 3:
        if (!state.investmentProfile.riskAppetite?.trim())
          errors.riskAppetite = "Risk appetite is required";

        if (!state.investmentProfile.experience?.trim())
          errors.experience = "Experience level is required";

        if (!state.investmentProfile.investmentGoal?.trim())
          errors.investmentGoal = "Investment goal is required";
        break;

      default:
        break;
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }

    clearErrors();
    return true;
  };

  // ---------------------- //
  //     SUBMIT LOGIC
  // ---------------------- //
  const register = async () => {
    const allErrors = {};

    // Validate Step 1
    if (!state.personalInfo.firstName?.trim())
      allErrors.firstName = "First name is required";
    if (!state.personalInfo.lastName?.trim())
      allErrors.lastName = "Last name is required";

    if (!state.personalInfo.phone?.trim()) {
      allErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(state.personalInfo.phone.replace(/\D/g, ""))) {
      allErrors.phone = "Phone must be 10 digits";
    }

    if (!state.personalInfo.dateOfBirth?.trim())
      allErrors.dateOfBirth = "Date of birth is required";

    // Validate Step 2
    if (!state.email?.trim()) allErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(state.email))
      allErrors.email = "Invalid email";

    if (!state.username?.trim()) allErrors.username = "Username is required";

    if (!state.password?.trim()) allErrors.password = "Password is required";
    else if (state.password.length < 6)
      allErrors.password = "Password too short";

    // Validate Step 3
    if (!state.investmentProfile.riskAppetite?.trim())
      allErrors.riskAppetite = "Risk appetite required";

    if (!state.investmentProfile.experience?.trim())
      allErrors.experience = "Experience required";

    if (!state.investmentProfile.investmentGoal?.trim())
      allErrors.investmentGoal = "Goal required";

    // Return errors
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);

      if (
        allErrors.firstName ||
        allErrors.lastName ||
        allErrors.phone ||
        allErrors.dateOfBirth
      ) {
        dispatch({ type: "SET_STEP", payload: 1 });
      } else if (allErrors.email || allErrors.username || allErrors.password) {
        dispatch({ type: "SET_STEP", payload: 2 });
      } else {
        dispatch({ type: "SET_STEP", payload: 3 });
      }

      return false;
    }

    // FINALLY SUBMIT TO API
    try {
      const payload = {
        email: state.email,
        username: state.username,
        password: state.password,
        firstName: state.personalInfo.firstName,
        lastName: state.personalInfo.lastName,
        phone: state.personalInfo.phone.replace(/\D/g, ""),
        dateOfBirth: state.personalInfo.dateOfBirth,
        riskAppetite: state.investmentProfile.riskAppetite,
        experience: state.investmentProfile.experience,
        investmentGoal: state.investmentProfile.investmentGoal,
      };

      const response = await axios.post(
        "http://13.235.70.253:8080/api/register",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        dispatch({ type: "SET_SUBMITTED", payload: true });
        localStorage.removeItem("registerUserData");
        return true;
      } else {
        navigate("/output", {
          state: { success: false, error: response.data },
        });
        return false;
      }
    } catch (error) {
      navigate("/output", {
        state: {
          success: false,
          error:
            error.toString() ===
            "AxiosError: Request failed with status code 409"
              ? "User with same email already exist"
              : error.toString(),
        },
      });
      return false;
    }
  };

  const reset = () => {
    dispatch({ type: "RESET" });
    localStorage.removeItem("registerUserData");
  };

  // ---------------------- //
  //      EXPORT API
  // ---------------------- //
  const value = {
    currentStep: state.currentStep,
    errors: state.errors,
    isSubmitted: state.isSubmitted,

    personalInfo: state.personalInfo,
    userId: state.userId,
    email: state.email,
    username: state.username,
    password: state.password,
    investmentProfile: state.investmentProfile,

    nextStep,
    prevStep,
    goToStep,
    updatePersonalInfo,
    updateField,
    updateInvestmentProfile,
    validateCurrentStep,
    register,
    reset,
  };

  return (
    <RegisterUserContext.Provider value={value}>
      {children}
    </RegisterUserContext.Provider>
  );
};
