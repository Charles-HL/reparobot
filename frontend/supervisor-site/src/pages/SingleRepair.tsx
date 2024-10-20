import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { fetchRepairById, updateRepair } from '../utils/api';
import { useAuth } from '../hooks/AuthProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import '../styles/SingleRepair.css';

const SingleRepair = () => {
  const auth = useAuth();
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL.
  const [repair, setRepair] = useState<null | any>(null); // State to hold repair data.
  const [loading, setLoading] = useState(true); // Loading state.
  const [editableFields, setEditableFields] = useState<{
    [key: string]: boolean;
  }>({}); // Track which fields are editable.
  const [editableSections, setEditableSections] = useState<{
    [key: string]: boolean;
  }>({}); // Track which sections are editable.

  useEffect(() => {
    if (!id) {
      alert('ID invalide');
      return;
    }
    const fetchData = async () => {
      try {
        const repairData = await fetchRepairById(id, auth.token);
        setRepair(repairData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repair:', error);
        alert("Une erreur s'est produite lors de la récupération des données");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepair({ ...repair, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (newValue: any) => {
    setRepair({ ...repair, working_time: newValue });
  };

  const toggleEditableField = (field: string) => {
    setEditableFields({ ...editableFields, [field]: !editableFields[field] });
  };

  const toggleEditableSection = (section: string, fields: string[]) => {
    const isSectionEditable = !editableSections[section];
    setEditableSections({ ...editableSections, [section]: isSectionEditable });

    // Update each field in the section based on the section toggle
    fields.forEach((field) => {
      setEditableFields((prev) => ({ ...prev, [field]: isSectionEditable }));
    });
  };

  const handleUpdate = async () => {
    try {
      await updateRepair(id!, repair);
      alert('Repair updated successfully');
    } catch (error) {
      console.error('Error updating repair:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const renderField = (
    label: string,
    name: string,
    value: string,
    isMultiline: boolean = false,
  ) => (
    <Grid item xs={isMultiline ? 12 : 6}>
      {editableFields[name] ? (
        <TextField
          sx={{ margin: '5px 0' }}
          fullWidth
          label={label}
          name={name}
          value={value || ''}
          onChange={handleChange}
          multiline={isMultiline}
          rows={isMultiline ? 4 : 1}
        />
      ) : (
        <Box
          display={'flex'}
          flexDirection={'row'}
          gap={'10px'}
          margin={'5px 0'}
        >
          <Typography variant="subtitle1">{label} : </Typography>
          <Typography variant="subtitle1">{value || ''}</Typography>
        </Box>
      )}
    </Grid>
  );

  const renderTimePicker = (label: string, name: string, value: string) => (
    <Grid item xs={6}>
      {editableFields[name] ? (
        <TimePicker
          label={label}
          value={value ? dayjs(value) : null}
          onChange={handleTimeChange}
          renderInput={(parmas: any) => (
            <TextField {...params} sx={{ margin: '5px 0' }} fullWidth />
          )}
        />
      ) : (
        <Box
          display={'flex'}
          flexDirection={'row'}
          gap={'10px'}
          margin={'5px 0'}
        >
          <Typography variant="subtitle1">{label} : </Typography>
          <Typography variant="subtitle1">{value || ''}</Typography>
        </Box>
      )}
    </Grid>
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        {repair.repair_or_maintenance} n°{id}
      </Typography>
      {repair && (
        <Grid container spacing={2}>
          {/* Client Information Section */}
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Typography variant="h6">Coordonnées du client</Typography>
                <IconButton
                  onClick={() =>
                    toggleEditableSection('clientInfo', [
                      'first_name',
                      'last_name',
                      'address',
                      'phone',
                      'email',
                    ])
                  }
                >
                  {editableSections['clientInfo'] ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} display={'flex'} gap={'10px'}>
              {renderField('First Name', 'first_name', repair.first_name)}
              {renderField('Last Name', 'last_name', repair.last_name)}
            </Grid>
            <Grid item xs={12} display={'flex'} gap={'10px'}>
              {renderField('Address', 'address', repair.address)}
              {renderField('Phone', 'phone', repair.phone)}
            </Grid>
            <Grid item xs={12} display={'flex'} gap={'10px'}>
              {renderField('Email', 'email', repair.email)}
            </Grid>
          </Grid>
          {/* Repair Details Section */}
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Typography variant="h6">Détails</Typography>
                <IconButton
                  onClick={() =>
                    toggleEditableSection('repairDetails', [
                      'machine_type',
                      'repair_or_maintenance',
                      'fault_description',
                      'robot_code',
                    ])
                  }
                >
                  {editableSections['repairDetails'] ? (
                    <SaveIcon />
                  ) : (
                    <EditIcon />
                  )}
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} display={'flex'} gap={'10px'}>
              {renderField(
                'Type de machine',
                'machine_type',
                repair.machine_type,
              )}
              {renderField(
                'Type',
                'repair_or_maintenance',
                repair.repair_or_maintenance,
              )}
            </Grid>
            <Grid item xs={12} display={'flex'} gap={'10px'}>
              {renderField(
                'Code du robot',
                'robot_code',
                repair.robot_code || '',
              )}
            </Grid>
            <Grid item xs={12} display={'flex'}>
              {renderField(
                'Description',
                'fault_description',
                repair.fault_description,
                true,
              )}
            </Grid>
          </Grid>
          {/* Technical Information Section */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6">Technical Information</Typography>
              <IconButton
                onClick={() =>
                  toggleEditableSection('technicalInfo', [
                    'file_url',
                    'bucket_name',
                    'working_time',
                    'replaced_part_list',
                  ])
                }
              >
                {editableSections['technicalInfo'] ? (
                  <SaveIcon />
                ) : (
                  <EditIcon />
                )}
              </IconButton>
            </Box>
          </Grid>
          {renderField('File URL', 'file_url', repair.file_url)}
          {renderField('Bucket Name', 'bucket_name', repair.bucket_name)}
          {renderTimePicker(
            'Working Time',
            'working_time',
            repair.working_time,
          )}
          {renderField(
            'Replaced Parts',
            'replaced_part_list',
            repair.replaced_part_list?.join(', ') || '',
          )}

          {/* Save All Changes Button */}
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleUpdate}>
              Save All Changes
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SingleRepair;
