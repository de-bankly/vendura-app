import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
  Box,
  useTheme,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// --- Styled Components --- //

const StyledAccordion = styled(MuiAccordion, {
  shouldForwardProp: prop => prop !== 'square',
})(({ theme, square }) => ({
  borderRadius: square ? 0 : theme.shape.borderRadius,
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}));

const StyledAccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  minHeight: 56,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  '&.Mui-expanded': {
    minHeight: 56,
  },
  '& .MuiAccordionSummary-content': {
    margin: theme.spacing(1.5, 0),
    '&.Mui-expanded': {
      margin: theme.spacing(1.5, 0),
    },
  },
}));

const StyledAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1, 3, 3),
}));

/**
 * Enhanced Accordion component using styled components.
 */
const Accordion = React.forwardRef(
  (
    {
      title,
      subtitle,
      children,
      expanded,
      onChange,
      defaultExpanded = false,
      disabled = false,
      disableGutters = false,
      square = false,
      elevation = 1,
      icon = <ExpandMoreIcon />,
      titleTypographyProps = {},
      subtitleTypographyProps = {},
      summaryProps = {},
      detailsProps = {},
      sx = {},
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

    const isExpanded = expanded !== undefined ? expanded : internalExpanded;

    const handleChange = (event, newExpanded) => {
      if (expanded === undefined) {
        setInternalExpanded(newExpanded);
      }
      if (onChange) {
        onChange(event, newExpanded);
      }
    };

    return (
      <StyledAccordion
        ref={ref}
        expanded={isExpanded}
        onChange={handleChange}
        disabled={disabled}
        disableGutters={disableGutters}
        square={square}
        elevation={elevation}
        sx={sx}
        {...props}
      >
        <StyledAccordionSummary
          expandIcon={icon}
          aria-controls="panel-content"
          id="panel-header"
          {...summaryProps}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: 600 }}
              {...titleTypographyProps}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
                {...subtitleTypographyProps}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </StyledAccordionSummary>

        <StyledAccordionDetails {...detailsProps}>{children}</StyledAccordionDetails>
      </StyledAccordion>
    );
  }
);

Accordion.displayName = 'Accordion';

Accordion.propTypes = {
  /** The title of the accordion */
  title: PropTypes.node.isRequired,
  /** The subtitle of the accordion */
  subtitle: PropTypes.node,
  /** The content of the accordion */
  children: PropTypes.node.isRequired,
  /** If true, the accordion is expanded */
  expanded: PropTypes.bool,
  /** Callback fired when the accordion is expanded/collapsed */
  onChange: PropTypes.func,
  /** If true, the accordion will be expanded by default */
  defaultExpanded: PropTypes.bool,
  /** If true, the accordion will be disabled */
  disabled: PropTypes.bool,
  /** If true, the accordion will not have padding */
  disableGutters: PropTypes.bool,
  /** If true, rounded corners are disabled */
  square: PropTypes.bool,
  /** The elevation of the accordion */
  elevation: PropTypes.number,
  /** The icon to display in the accordion summary */
  icon: PropTypes.node,
  /** Additional props for the title Typography component */
  titleTypographyProps: PropTypes.object,
  /** Additional props for the subtitle Typography component */
  subtitleTypographyProps: PropTypes.object,
  /** Additional props for the AccordionSummary component */
  summaryProps: PropTypes.object,
  /** Additional props for the AccordionDetails component */
  detailsProps: PropTypes.object,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Accordion;
