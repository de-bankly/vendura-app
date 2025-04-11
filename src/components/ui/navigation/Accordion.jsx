import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Accordion component for expandable content sections.
 * Can be used individually or as part of an accordion group.
 */
const Accordion = ({
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
}) => {
  const theme = useTheme();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Use either controlled or uncontrolled expanded state
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;

  // Handle accordion change
  const handleChange = (event, newExpanded) => {
    if (expanded === undefined) {
      setInternalExpanded(newExpanded);
    }

    if (onChange) {
      onChange(event, newExpanded);
    }
  };

  return (
    <MuiAccordion
      expanded={isExpanded}
      onChange={handleChange}
      defaultExpanded={defaultExpanded}
      disabled={disabled}
      disableGutters={disableGutters}
      square={square}
      elevation={elevation}
      sx={{
        borderRadius: square ? 0 : 1,
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: 0,
        },
        ...sx,
      }}
      {...props}
    >
      <AccordionSummary
        expandIcon={icon}
        aria-controls="panel-content"
        id="panel-header"
        sx={{
          minHeight: 56,
          '&.Mui-expanded': {
            minHeight: 56,
          },
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
            '&.Mui-expanded': {
              margin: '12px 0',
            },
          },
          ...summaryProps.sx,
        }}
        {...summaryProps}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              fontWeight: 600,
              ...titleTypographyProps.sx,
            }}
            {...titleTypographyProps}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                ...subtitleTypographyProps.sx,
              }}
              {...subtitleTypographyProps}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          padding: theme.spacing(1, 3, 3),
          ...detailsProps.sx,
        }}
        {...detailsProps}
      >
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
};

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
