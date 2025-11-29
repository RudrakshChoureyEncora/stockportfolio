import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
const RegisterUserContext = createContext();

export const useRUContext = () => {
  const context = useContext(RegisterUserContext);
  if (!context) {
    throw new Error("useRUContext must be within a proider");
  }
  return context;
};

const initialState = {
  currentStep: 1,
  errors: {},
  isSubmitted: false,
  userId: "", // Primary Key
  email: "", // Secondary Index
  username: "",
  password: "",
  personalInfo: {},
  investmentProfile: {},
};

const RUReducer = (state, action) => {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case "UPDATE_PERSONAL_INFO":
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          ...action.payload,
        },
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
      return {
        ...state,
        errors: { ...state.errors, ...action.payload },
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: {},
      };

    case "SET_SUBMITTED":
      return {
        ...state,
        isSubmitted: action.payload,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export const RUProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RUReducer, initialState);

  //loading saved data if available from the local storage :
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

      // Restore simple fields
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

      // Restore nested objects
      dispatch({
        type: "UPDATE_PERSONAL_INFO",
        payload: personalInfo,
      });

      dispatch({
        type: "UPDATE_INVESTMENT_PROFILE",
        payload: investmentProfile,
      });

      // Restore step
      dispatch({
        type: "SET_STEP",
        payload: currentStep,
      });
    }
  }, []);

  //   similarly saving in local storage:
  useEffect(() => {
    // Only save if user has started filling OR moved steps
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

  const setErrors = (errors) => {
    dispatch({ type: "SET_ERRORS", payload: errors });
  };

  const clearErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" });
  };

  const updatePersonalInfo = (data) => {
    dispatch({ type: "UPDATE_PERSONAL_INFO", payload: data });
  };
  const updateField = (data) => {
    dispatch({ type: "UPDATE_FIELD", payload: data });
  };

  const updateInvestmentProfile = (data) => {
    dispatch({ type: "UPDATE_INVESTMENT_PROFILE", payload: data });
  };

  const validateCurrentStep = () => {
    const errors = {};

    switch (state.currentStep) {
      case 1: // Personal Info
        if (!state.personalInfo.firstName?.trim()) {
          errors.firstName = "First name is required";
        }
        if (!state.personalInfo.lastName?.trim()) {
          errors.lastName = "Last name is required";
        }
        if (!state.personalInfo.phone?.trim()) {
          errors.phone = "Phone number is required";
        } else if (
          !/^\d{10}$/.test(state.personalInfo.phone.replace(/\D/g, ""))
        ) {
          errors.phone = "Phone number must be 10 digits";
        }
        if (!state.personalInfo.dateOfBirth?.trim()) {
          errors.dateOfBirth = "Date of birth is required";
        }
        break;

      case 2: // Account Security
        if (!state.email?.trim()) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(state.email)) {
          errors.email = "Email is invalid";
        }
        if (!state.username?.trim()) {
          errors.username = "Username is required";
        }
        if (!state.password?.trim()) {
          errors.password = "Password is required";
        } else if (state.password.length < 6) {
          errors.password = "Password must be at least 6 characters";
        }
        break;

      case 3: // Investment Profile
        if (!state.investmentProfile.riskAppetite?.trim()) {
          errors.riskAppetite = "Risk appetite is required";
        }
        if (!state.investmentProfile.experience?.trim()) {
          errors.experience = "Experience level is required";
        }
        if (!state.investmentProfile.investmentGoal?.trim()) {
          errors.investmentGoal = "Investment goal is required";
        }
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

  const register = async () => {
    const allErrors = {};

    // Step 1: Personal Info
    if (!state.personalInfo.firstName?.trim()) {
      allErrors.firstName = "First name is required";
    }
    if (!state.personalInfo.lastName?.trim()) {
      allErrors.lastName = "Last name is required";
    }
    if (!state.personalInfo.phone?.trim()) {
      allErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(state.personalInfo.phone.replace(/\D/g, ""))) {
      allErrors.phone = "Phone number must be 10 digits";
    }
    if (!state.personalInfo.dateOfBirth?.trim()) {
      allErrors.dateOfBirth = "Date of birth is required";
    }

    // Step 2: Account Security

    if (!state.email?.trim()) {
      allErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      allErrors.email = "Email is invalid";
    }
    if (!state.username?.trim()) {
      allErrors.username = "Username is required";
    }
    if (!state.password?.trim()) {
      allErrors.password = "Password is required";
    } else if (state.password.length < 6) {
      allErrors.password = "Password must be at least 6 characters";
    }

    // Step 3: Investment Profile
    if (!state.investmentProfile.riskAppetite?.trim()) {
      allErrors.riskAppetite = "Risk appetite is required";
    }
    if (!state.investmentProfile.experience?.trim()) {
      allErrors.experience = "Experience level is required";
    }
    if (!state.investmentProfile.investmentGoal?.trim()) {
      allErrors.investmentGoal = "Investment goal is required";
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);

      // Navigate to first step with errors
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

    // Simulate API call or actual save to DynamoDB
    try {
      // Example: await userService.saveUser(state);
      const payload = {
        email: state.email,
        username: state.username,
        password: state.password,
        firstName: state.personalInfo.firstName,
        lastName: state.personalInfo.lastName,
        phone: state.personalInfo.phone.replace(/\D/g, ""), // remove formatting
        dateOfBirth: state.personalInfo.dateOfBirth,
        riskAppetite: state.investmentProfile.riskAppetite,
        experience: state.investmentProfile.experience,
        investmentGoal: state.investmentProfile.investmentGoal,
      };

      console.log("📤 Sending payload:", payload);

      const response = await axios.post("/api/register", payload);

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Registration success:", response.data);

        dispatch({ type: "SET_SUBMITTED", payload: true });

        // Clear any saved local data
        localStorage.removeItem("registerUserData");

        return true;
      } else {
        console.error("❌ Registration failed:", response);
        return false;
      }
    } catch (error) {
      console.error("User registration submission failed:", error);
      return false;
    }
  };

  const reset = () => {
    dispatch({ type: "RESET" });
    localStorage.removeItem("registerUserData");
  };

  const value = {
    // State
    currentStep: state.currentStep,
    errors: state.errors,
    isSubmitted: state.isSubmitted,

    // Personal Info
    personalInfo: state.personalInfo,

    // Account Security
    userId: state.userId,
    email: state.email,
    username: state.username,
    password: state.password,

    // Investment Profile
    investmentProfile: state.investmentProfile,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    updatePersonalInfo, // Function to update personalInfo
    updateField, // Function to update userId/email/username/password
    updateInvestmentProfile, // Function to update investmentProfile
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
