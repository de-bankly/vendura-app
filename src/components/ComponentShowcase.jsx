import React, { useState } from 'react';
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
} from '@mui/material';

// Import all UI components
import { Button, PrimaryButton, SecondaryButton, TextButton, IconButton } from './ui/buttons';

import { Card, CardWithHeader, CardWithActions, CompleteCard } from './ui/cards';

import { TextField, NumberField, Select, Checkbox, RadioGroup } from './ui/inputs';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

      {/* Placeholder for other tabs */}
      {activeTab === 3 && (
        <ComponentSection title="Forms">
          <Typography variant="body1">Form components will be displayed here.</Typography>
        </ComponentSection>
      )}

      {activeTab === 4 && (
        <ComponentSection title="Feedback">
          <Typography variant="body1">Feedback components will be displayed here.</Typography>
        </ComponentSection>
      )}

      {activeTab === 5 && (
        <ComponentSection title="Navigation">
          <Typography variant="body1">Navigation components will be displayed here.</Typography>
        </ComponentSection>
      )}

      {activeTab === 6 && (
        <ComponentSection title="Modals">
          <Typography variant="body1">Modal components will be displayed here.</Typography>
        </ComponentSection>
      )}
    </Container>
  );
};

export default ComponentShowcase;
