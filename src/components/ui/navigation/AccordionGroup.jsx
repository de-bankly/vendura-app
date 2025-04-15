import { Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, Children, cloneElement, isValidElement } from 'react';

import Accordion from './Accordion';

/**
 * AccordionGroup component that manages a group of Accordion components.
 * Supports single or multiple expanded accordions.
 */
const AccordionGroup = ({
  children,
  allowMultiple = false,
  defaultExpanded = [],
  onChange,
  divider = true,
  sx = {},
  ...props
}) => {
  // Initialize expanded state
  const [expandedItems, setExpandedItems] = useState(
    Array.isArray(defaultExpanded) ? defaultExpanded : defaultExpanded ? [defaultExpanded] : []
  );

  const theme = useTheme();

  // Handle accordion change
  const handleAccordionChange = index => (event, isExpanded) => {
    let newExpanded;

    if (allowMultiple) {
      // For multiple mode, toggle the clicked accordion
      newExpanded = isExpanded
        ? [...expandedItems, index]
        : expandedItems.filter(item => item !== index);
    } else {
      // For single mode, only expand the clicked accordion
      newExpanded = isExpanded ? [index] : [];
    }

    setExpandedItems(newExpanded);

    if (onChange) {
      onChange(newExpanded);
    }
  };

  // Clone children with additional props
  const accordions = Children.map(children, (child, index) => {
    if (!isValidElement(child) || child.type !== Accordion) {
      console.warn('AccordionGroup children should be Accordion components');
      return child;
    }

    return cloneElement(child, {
      expanded: expandedItems.includes(index),
      onChange: handleAccordionChange(index),
      disableGutters: true,
      square: true,
      elevation: 0,
      sx: {
        borderBottom: divider ? `1px solid ${theme.palette.divider}` : 'none',
        '&:last-child': {
          borderBottom: 'none',
        },
        ...child.props.sx,
      },
    });
  });

  return (
    <Box
      sx={{
        border: divider ? `1px solid ${theme.palette.divider}` : 'none',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {accordions}
    </Box>
  );
};

AccordionGroup.propTypes = {
  /** Accordion components to be rendered */
  children: PropTypes.node.isRequired,
  /** If true, multiple accordions can be expanded at the same time */
  allowMultiple: PropTypes.bool,
  /** The index or array of indices of the initially expanded accordion(s) */
  defaultExpanded: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  /** Callback fired when the expanded state changes */
  onChange: PropTypes.func,
  /** If true, dividers will be shown between accordions */
  divider: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default AccordionGroup;
