import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';

/**
 * FormValidation component that extends the Form component with validation
 * capabilities.
 */
const FormValidation = ({
  children,
  onSubmit,
  initialValues = {},
  validationSchema = null,
  validateOnChange = true,
  validateOnBlur = true,
  ...props
}) => {
  // State for form values, errors, and touched fields
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate a single field
  const validateField = (name, value) => {
    if (!validationSchema) return '';

    try {
      // Validate just this field
      validationSchema.validateSyncAt(name, { [name]: value });
      return '';
    } catch (error) {
      return error.message;
    }
  };

  // Validate the entire form
  const validateForm = async () => {
    if (!validationSchema) return true;

    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};

      if (validationErrors.inner) {
        validationErrors.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  // Handle field change
  const handleChange = event => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue,
    }));

    if (validateOnChange) {
      const fieldError = validateField(name, fieldValue);

      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    }
  };

  // Handle field blur
  const handleBlur = event => {
    const { name } = event.target;

    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));

    if (validateOnBlur) {
      const fieldError = validateField(name, values[name]);

      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async event => {
    event.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(allTouched);

    // Validate the form
    const isValid = await validateForm();

    if (isValid && onSubmit) {
      onSubmit(values, { setValues, setErrors, setTouched });
    }
  };

  // Create form context value
  const formContext = {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isSubmitting: false,
  };

  // Clone children with form context
  const renderChildren = () => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          formContext,
          ...child.props,
        });
      }
      return child;
    });
  };

  return (
    <Form onSubmit={handleSubmit} {...props}>
      {renderChildren()}
    </Form>
  );
};

FormValidation.propTypes = {
  /** The form fields */
  children: PropTypes.node,
  /** Callback fired when the form is submitted */
  onSubmit: PropTypes.func,
  /** Initial values for the form */
  initialValues: PropTypes.object,
  /** Validation schema for the form (e.g., Yup schema) */
  validationSchema: PropTypes.object,
  /** Whether to validate fields on change */
  validateOnChange: PropTypes.bool,
  /** Whether to validate fields on blur */
  validateOnBlur: PropTypes.bool,
};

export default FormValidation;
