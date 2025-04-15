import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  Grid,
  Paper,
  Tabs,
  Tab,
  useTheme,
  Button as MuiButton,
} from '@mui/material';

// Import all UI components
import { Button, PrimaryButton, SecondaryButton, TextButton, IconButton } from './ui/buttons';

import { Card, CardWithHeader, CardWithActions, CompleteCard } from './ui/cards';

import {
  TextField,
  NumberField,
  Select,
  SearchableDropdown,
  Checkbox,
  RadioGroup,
} from './ui/inputs';

import {
  Alert,
  Toast,
  ToastProvider,
  useToast,
  Badge,
  StatusBadge,
  ProgressIndicator,
  Table,
} from './ui/feedback';

import {
  Tabs as CustomTabs,
  TabPanel,
  Breadcrumbs,
  Pagination,
  Stepper,
  Accordion,
  AccordionGroup,
} from './ui/navigation';

import { Dialog, DialogSystem, Modal, Drawer, Popover, Tooltip } from './ui/modals';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';

// Toast Provider Wrapper
const ToastProviderWrapper = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};

// Component to demonstrate Toast usage
const ToastDemo = () => {
  const { showToast } = useToast();

  const handleShowToast = severity => {
    showToast({
      title: `${severity.charAt(0).toUpperCase() + severity.slice(1)} Toast`,
      message: `This is a ${severity} toast notification.`,
      severity: severity,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button onClick={() => handleShowToast('info')} startIcon={<InfoIcon />}>
          Info Toast
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={() => handleShowToast('success')} color="success" startIcon={<AddIcon />}>
          Success Toast
        </Button>
      </Grid>
      <Grid item>
        <Button
          onClick={() => handleShowToast('warning')}
          color="warning"
          startIcon={<WarningIcon />}
        >
          Warning Toast
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={() => handleShowToast('error')} color="error" startIcon={<ErrorIcon />}>
          Error Toast
        </Button>
      </Grid>
    </Grid>
  );
};

const ComponentShowcase = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRadio, setSelectedRadio] = useState('option1');
  const [checkboxState, setCheckboxState] = useState({
    option1: true,
    option2: false,
  });
  const [selectValue, setSelectValue] = useState('option1');
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('info');
  const [searchableValue, setSearchableValue] = useState(null);
  const [multiSearchableValue, setMultiSearchableValue] = useState([]);
  const [expandedAccordion, setExpandedAccordion] = useState(0);

  // Sample data for table
  const [tableData, setTableData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
    {
      id: 5,
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      role: 'Admin',
      status: 'Inactive',
    },
  ]);

  // Table columns definition
  const tableColumns = [
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'role', headerName: 'Role' },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: row => (
        <StatusBadge status={row.status === 'Active' ? 'success' : 'error'} label={row.status} />
      ),
    },
  ];

  // Sample data for searchable dropdown
  const dropdownOptions = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3' },
    { id: 4, label: 'Another Option' },
    { id: 5, label: 'Last Option' },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRadioChange = event => {
    setSelectedRadio(event.target.value);
  };

  const handleCheckboxChange = event => {
    setCheckboxState({
      ...checkboxState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectChange = event => {
    setSelectValue(event.target.value);
  };

  const handleOpenDialog = type => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAccordionChange = index => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? index : -1);
  };

  const ComponentSection = ({ title, children }) => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );

  const ExampleCard = ({ title, description, children }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      <Box sx={{ mt: 3 }}>{children}</Box>
    </Paper>
  );

  return (
    <ToastProviderWrapper>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h2" gutterBottom sx={{ color: 'primary.main' }}>
            Vendura UI Component Library
          </Typography>
          <Typography variant="body1" paragraph>
            This showcase demonstrates all available UI components with examples and documentation.
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="component categories">
            <Tab label="Buttons" />
            <Tab label="Cards" />
            <Tab label="Inputs" />
            <Tab label="Forms" />
            <Tab label="Feedback" />
            <Tab label="Navigation" />
            <Tab label="Modals" />
          </Tabs>
        </Box>

        {/* Buttons Section */}
        {activeTab === 0 && (
          <ComponentSection title="Buttons">
            <ExampleCard
              title="Standard Button"
              description="The base Button component that extends MUI Button with additional functionality like loading state and consistent styling."
            >
              <Grid container spacing={2}>
                <Grid item>
                  <Button>Default Button</Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined">Outlined</Button>
                </Grid>
                <Grid item>
                  <Button color="secondary">Secondary</Button>
                </Grid>
                <Grid item>
                  <Button loading>Loading</Button>
                </Grid>
                <Grid item>
                  <Button disabled>Disabled</Button>
                </Grid>
                <Grid item>
                  <Button startIcon={<AddIcon />}>With Icon</Button>
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Primary Button"
              description="Pre-configured button with primary styling."
            >
              <Grid container spacing={2}>
                <Grid item>
                  <PrimaryButton>Primary Button</PrimaryButton>
                </Grid>
                <Grid item>
                  <PrimaryButton loading>Loading</PrimaryButton>
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Secondary Button"
              description="Pre-configured button with secondary styling."
            >
              <Grid container spacing={2}>
                <Grid item>
                  <SecondaryButton>Secondary Button</SecondaryButton>
                </Grid>
                <Grid item>
                  <SecondaryButton loading>Loading</SecondaryButton>
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Text Button"
              description="Button with text-only styling for less prominent actions."
            >
              <Grid container spacing={2}>
                <Grid item>
                  <TextButton>Text Button</TextButton>
                </Grid>
                <Grid item>
                  <TextButton color="secondary">Secondary</TextButton>
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Icon Button"
              description="Button that contains only an icon for compact UI elements."
            >
              <Grid container spacing={2}>
                <Grid item>
                  <IconButton icon={<AddIcon />} aria-label="add" />
                </Grid>
                <Grid item>
                  <IconButton icon={<DeleteIcon />} aria-label="delete" color="error" />
                </Grid>
                <Grid item>
                  <IconButton icon={<EditIcon />} aria-label="edit" color="secondary" />
                </Grid>
              </Grid>
            </ExampleCard>
          </ComponentSection>
        )}

        {/* Cards Section */}
        {activeTab === 1 && (
          <ComponentSection title="Cards">
            <ExampleCard
              title="Basic Card"
              description="Simple card component for displaying content in a contained format."
            >
              <Card>
                <Typography variant="body1">
                  This is a basic card component that can contain any content.
                </Typography>
              </Card>
            </ExampleCard>

            <ExampleCard
              title="Card With Header"
              description="Card with a dedicated header section for titles or actions."
            >
              <CardWithHeader title="Card Title" subheader="Card Subtitle">
                <Typography variant="body1">
                  This card includes a header with title and subtitle.
                </Typography>
              </CardWithHeader>
            </ExampleCard>

            <ExampleCard
              title="Card With Actions"
              description="Card with action buttons in the footer."
            >
              <CardWithActions
                actions={
                  <>
                    <Button size="small">Action 1</Button>
                    <Button size="small" color="secondary">
                      Action 2
                    </Button>
                  </>
                }
              >
                <Typography variant="body1">
                  This card includes action buttons in the footer.
                </Typography>
              </CardWithActions>
            </ExampleCard>

            <ExampleCard
              title="Complete Card"
              description="Full-featured card with header, content, and actions."
            >
              <CompleteCard
                title="Complete Card"
                subheader="With all features"
                actions={
                  <>
                    <Button size="small">Save</Button>
                    <Button size="small" color="secondary">
                      Cancel
                    </Button>
                  </>
                }
              >
                <Typography variant="body1">
                  This is a complete card with header, content area, and action buttons.
                </Typography>
              </CompleteCard>
            </ExampleCard>
          </ComponentSection>
        )}

        {/* Inputs Section */}
        {activeTab === 2 && (
          <ComponentSection title="Inputs">
            <ExampleCard
              title="Text Field"
              description="Enhanced text input with validation and helper text support."
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Standard Text Field"
                    value={textValue}
                    onChange={e => setTextValue(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="With Helper Text" helperText="This is helper text" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="With Error"
                    error
                    helperText="This field has an error"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Disabled" disabled fullWidth />
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Number Field"
              description="Specialized input for numeric values with validation."
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <NumberField
                    label="Number Input"
                    value={numberValue}
                    onChange={e => setNumberValue(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <NumberField
                    label="With Min/Max"
                    min={0}
                    max={100}
                    helperText="Value between 0-100"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Select"
              description="Dropdown selection input for choosing from a list of options."
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Select
                    label="Select Option"
                    value={selectValue}
                    onChange={handleSelectChange}
                    options={[
                      { value: 'option1', label: 'Option 1' },
                      { value: 'option2', label: 'Option 2' },
                      { value: 'option3', label: 'Option 3' },
                    ]}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Select
                    label="Disabled Select"
                    disabled
                    options={[
                      { value: 'option1', label: 'Option 1' },
                      { value: 'option2', label: 'Option 2' },
                    ]}
                    value="option1"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Searchable Dropdown"
              description="Enhanced dropdown with search functionality for finding options quickly."
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SearchableDropdown
                    label="Searchable Dropdown"
                    options={dropdownOptions}
                    value={searchableValue}
                    onChange={newValue => setSearchableValue(newValue)}
                    placeholder="Search options..."
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SearchableDropdown
                    label="Multiple Selection"
                    options={dropdownOptions}
                    value={multiSearchableValue}
                    onChange={newValue => setMultiSearchableValue(newValue)}
                    placeholder="Select multiple..."
                    multiple
                    fullWidth
                  />
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Checkbox"
              description="Checkbox input for boolean or multiple selection."
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Checkbox
                    label="Option 1"
                    name="option1"
                    checked={checkboxState.option1}
                    onChange={handleCheckboxChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Checkbox
                    label="Option 2"
                    name="option2"
                    checked={checkboxState.option2}
                    onChange={handleCheckboxChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Checkbox label="Disabled Option" disabled />
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Radio Group"
              description="Radio button group for single selection from multiple options."
            >
              <RadioGroup
                name="radio-group-example"
                value={selectedRadio}
                onChange={handleRadioChange}
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3', disabled: true },
                ]}
              />
            </ExampleCard>
          </ComponentSection>
        )}

        {/* Forms Section */}
        {activeTab === 3 && (
          <ComponentSection title="Forms">
            <Typography variant="body1">Form components will be displayed here.</Typography>
          </ComponentSection>
        )}

        {/* Feedback Section */}
        {activeTab === 4 && (
          <ComponentSection title="Feedback">
            <ExampleCard
              title="Alert"
              description="Alert component for displaying important messages."
            >
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <Alert severity="info" title="Information">
                    This is an information alert.
                  </Alert>
                </Grid>
                <Grid item>
                  <Alert severity="success" title="Success">
                    This is a success alert.
                  </Alert>
                </Grid>
                <Grid item>
                  <Alert severity="warning" title="Warning">
                    This is a warning alert.
                  </Alert>
                </Grid>
                <Grid item>
                  <Alert severity="error" title="Error">
                    This is an error alert.
                  </Alert>
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Toast Notifications"
              description="Toast notifications for temporary feedback."
            >
              <ToastDemo />
            </ExampleCard>

            <ExampleCard
              title="Progress Indicator"
              description="Progress indicators for showing loading states."
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ProgressIndicator type="circular" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ProgressIndicator type="linear" value={60} />
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard title="Badge" description="Badge for showing counts or status indicators.">
              <Grid container spacing={3}>
                <Grid item>
                  <Badge count={5}>
                    <Button>Notifications</Button>
                  </Badge>
                </Grid>
                <Grid item>
                  <Badge count={0} showZero>
                    <Button>Empty</Button>
                  </Badge>
                </Grid>
                <Grid item>
                  <Badge count={99} max={99}>
                    <Button>Max Count</Button>
                  </Badge>
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Status Badge"
              description="Status badges for indicating status of items."
            >
              <Grid container spacing={3}>
                <Grid item>
                  <StatusBadge status="success" label="Active" />
                </Grid>
                <Grid item>
                  <StatusBadge status="warning" label="Pending" />
                </Grid>
                <Grid item>
                  <StatusBadge status="error" label="Failed" />
                </Grid>
                <Grid item>
                  <StatusBadge status="info" label="Processing" />
                </Grid>
              </Grid>
            </ExampleCard>

            <ExampleCard
              title="Table"
              description="Enhanced table component with sorting, filtering, and pagination."
            >
              <Table
                columns={tableColumns}
                data={tableData}
                title="Users Table"
                searchable
                selectable
                onRowSelect={selectedIds => {}}
              />
            </ExampleCard>
          </ComponentSection>
        )}

        {/* Navigation Section */}
        {activeTab === 5 && (
          <ComponentSection title="Navigation">
            <ExampleCard
              title="Tabs"
              description="Tab navigation for organizing content into sections."
            >
              <CustomTabs
                value={0}
                onChange={(e, val) => {}}
                tabs={[
                  { label: 'Tab 1', id: 'tab-1' },
                  { label: 'Tab 2', id: 'tab-2' },
                  { label: 'Tab 3', id: 'tab-3' },
                ]}
              />
            </ExampleCard>

            <ExampleCard
              title="Breadcrumbs"
              description="Breadcrumb navigation for showing the current location."
            >
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '#' },
                  { label: 'Category', href: '#' },
                  { label: 'Current Page', current: true },
                ]}
              />
            </ExampleCard>

            <ExampleCard
              title="Pagination"
              description="Pagination controls for navigating through pages of content."
            >
              <Pagination count={10} page={1} onChange={(e, page) => {}} />
            </ExampleCard>

            <ExampleCard
              title="Stepper"
              description="Stepper for guiding users through a multi-step process."
            >
              <Stepper
                steps={[
                  { label: 'Step 1', completed: true },
                  { label: 'Step 2', completed: true },
                  { label: 'Step 3', active: true },
                  { label: 'Step 4' },
                ]}
              />
            </ExampleCard>

            <ExampleCard
              title="Accordion"
              description="Expandable content sections for organizing information."
            >
              <Accordion
                title="Single Accordion"
                subtitle="Click to expand/collapse"
                expanded={expandedAccordion === 0}
                onChange={handleAccordionChange(0)}
              >
                <Typography variant="body2">
                  This is the content of the accordion. It can contain any elements.
                </Typography>
              </Accordion>
            </ExampleCard>

            <ExampleCard
              title="Accordion Group"
              description="Group of accordions with controlled expansion."
            >
              <AccordionGroup>
                <Accordion title="First Section" subtitle="Important information">
                  <Typography variant="body2">Content for the first accordion section.</Typography>
                </Accordion>
                <Accordion title="Second Section" subtitle="More details">
                  <Typography variant="body2">Content for the second accordion section.</Typography>
                </Accordion>
                <Accordion title="Third Section" subtitle="Additional information">
                  <Typography variant="body2">Content for the third accordion section.</Typography>
                </Accordion>
              </AccordionGroup>
            </ExampleCard>
          </ComponentSection>
        )}

        {/* Modals Section */}
        {activeTab === 6 && (
          <ComponentSection title="Modals">
            <ExampleCard
              title="Dialog"
              description="Standard dialog for displaying information or requesting input."
            >
              <Grid container spacing={2}>
                <Grid item>
                  <Button onClick={() => handleOpenDialog('info')}>Open Info Dialog</Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => handleOpenDialog('warning')} color="warning">
                    Open Warning Dialog
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => handleOpenDialog('error')} color="error">
                    Open Error Dialog
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => handleOpenDialog('confirm')} color="primary">
                    Open Confirm Dialog
                  </Button>
                </Grid>
              </Grid>

              <DialogSystem
                open={dialogOpen}
                onClose={handleCloseDialog}
                type={dialogType}
                title={`${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)} Dialog`}
                message={`This is a ${dialogType} dialog with customizable content and actions.`}
                onConfirm={handleCloseDialog}
                onCancel={handleCloseDialog}
              />
            </ExampleCard>

            <ExampleCard
              title="Tooltip"
              description="Tooltip for displaying additional information on hover."
            >
              <Grid container spacing={2}>
                <Grid item>
                  <Tooltip title="This is a tooltip">
                    <Button>Hover Me</Button>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Tooltip with custom placement" placement="right">
                    <Button>Right Tooltip</Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </ExampleCard>
          </ComponentSection>
        )}
      </Container>
    </ToastProviderWrapper>
  );
};

export default ComponentShowcase;
