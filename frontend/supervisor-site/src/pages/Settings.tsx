import { Box, Tabs, Tab } from '@mui/material';
import React from 'react';
import EditRepairedPart from '../components/settings/EditRepairedPart';
import EditUser from '../components/settings/EditUser';
import EditEntity from '../components/settings/EditEntity';
import {
  addBrand,
  addRepairer,
  deleteBrand,
  deleteRepairer,
  fetchBrands,
  fetchRepairers,
} from '../utils/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
const Settings = (): JSX.Element => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Onglets des paramètres"
        >
          <Tab label="Pièces à remplacer" {...a11yProps(0)} />
          <Tab label="Utilisateurs" {...a11yProps(1)} />
          <Tab label="Réparateur" {...a11yProps(2)} />
          <Tab label="Marques" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <EditRepairedPart />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EditUser />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <EditEntity
          entityName="Réparateur"
          fetchEntities={fetchRepairers}
          addEntity={addRepairer}
          deleteEntity={deleteRepairer}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <EditEntity
          entityName="Marque"
          fetchEntities={fetchBrands}
          addEntity={addBrand}
          deleteEntity={deleteBrand}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default Settings;
