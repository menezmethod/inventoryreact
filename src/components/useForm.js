import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function useForm(
  initialValues,
  validateOnChange = false,
  validate
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (validateOnChange) validate({ [name]: value });
    //console.log(values)
  };
  return { values, errors, setValues, setErrors, handleInputChange };
}
