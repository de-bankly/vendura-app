import React from 'react';
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  Box,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Stepper component that extends MUI Stepper with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Stepper = ({
  activeStep,
  steps = [],
  orientation = 'horizontal',
  variant = 'standard',
  nonLinear = false,
  alternativeLabel = false,
  connector = null,
  onStepClick,
  sx = {},
  ...props
}) => {
  // Determine if the stepper is clickable
  const isClickable = nonLinear && !!onStepClick;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <MuiStepper
        activeStep={activeStep}
        orientation={orientation}
        nonLinear={nonLinear}
        alternativeLabel={alternativeLabel}
        connector={connector}
        {...props}
      >
        {steps.map((step, index) => {
          const stepProps = {
            completed: step.completed,
            disabled: step.disabled,
            expanded: activeStep === index && orientation === 'vertical',
            ...step.stepProps,
          };

          const labelProps = {
            optional: step.optional ? (
              <Typography variant="caption" color="text.secondary">
                {step.optional}
              </Typography>
            ) : null,
            error: step.error,
            ...step.labelProps,
          };

          // Render the appropriate step component based on configuration
          return (
            <Step key={step.label} {...stepProps}>
              {isClickable ? (
                <StepButton onClick={() => onStepClick(index)} {...step.buttonProps}>
                  {step.label}
                </StepButton>
              ) : (
                <StepLabel {...labelProps}>{step.label}</StepLabel>
              )}

              {orientation === 'vertical' && step.content && (
                <StepContent>{step.content}</StepContent>
              )}
            </Step>
          );
        })}
      </MuiStepper>

      {/* Render content for horizontal stepper */}
      {orientation === 'horizontal' && activeStep < steps.length && steps[activeStep]?.content && (
        <Box sx={{ mt: 2 }}>{steps[activeStep].content}</Box>
      )}
    </Box>
  );
};

Stepper.propTypes = {
  /** The active step index */
  activeStep: PropTypes.number.isRequired,
  /** Array of step objects */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      /** The label of the step */
      label: PropTypes.node.isRequired,
      /** The content to display when the step is active */
      content: PropTypes.node,
      /** If true, the step is marked as completed */
      completed: PropTypes.bool,
      /** If true, the step is disabled */
      disabled: PropTypes.bool,
      /** Optional text to display below the step label */
      optional: PropTypes.node,
      /** If true, the step is marked as having an error */
      error: PropTypes.bool,
      /** Additional props for the Step component */
      stepProps: PropTypes.object,
      /** Additional props for the StepLabel component */
      labelProps: PropTypes.object,
      /** Additional props for the StepButton component */
      buttonProps: PropTypes.object,
    })
  ),
  /** The orientation of the stepper */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** The variant to use */
  variant: PropTypes.oneOf(['standard', 'dots']),
  /** If true, the stepper is non-linear */
  nonLinear: PropTypes.bool,
  /** If true, the step label is displayed underneath the step icon */
  alternativeLabel: PropTypes.bool,
  /** Custom connector component */
  connector: PropTypes.node,
  /** Callback fired when a step is clicked */
  onStepClick: PropTypes.func,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Stepper;
