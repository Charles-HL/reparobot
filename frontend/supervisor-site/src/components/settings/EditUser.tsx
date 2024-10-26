import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../utils/api';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../hooks/AuthProvider';
import { useTheme } from '@mui/material/styles';
import type { ColDef } from '@ag-grid-community/core/dist/types/src/entities/colDef';
import { toast } from 'react-toastify';

export interface User {
  id: string;
  username: string;
  role: 'OPERATOR' | 'SUPERVISOR';
}

const EditUser = () => {
  const auth = useAuth();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [role, setRole] = useState<'OPERATOR' | 'SUPERVISOR' | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchUsers(auth.token);
      setUsers(result);
    };
    fetchData();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setUsername(null);
    setPassword(null);
    setRole(null);
    setOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUsername(user.username);
    setPassword(null);
    setRole(user.role);
    setOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    const answer = window.confirm(
      'Êtes-vous sûr de vouloir supprimer cet utilisateur?',
    );
    if (answer) {
      try {
        await deleteUser(auth.token, user.id);
        toast.success('Utilisateur supprimé');
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error(
          "Une erreur s'est produite lors de la suppression de l'utilisateur",
        );
      }
      const result = await fetchUsers(auth.token);
      setUsers(result);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (selectedUser) {
        await updateUser(auth.token, selectedUser.id, {
          username,
          password,
          role,
        });
      } else {
        await addUser(auth.token, { username, password, role });
      }
      toast.success('Utilisateur sauvegardé');
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error(
        "Une erreur s'est produite lors de la sauvegarde de l'utilisateur",
      );
    }
    const result = await fetchUsers(auth.token);
    setUsers(result);
    setOpen(false);
  };

  const columns: any = [
    { headerName: 'Utilisateur', field: 'username' },
    { headerName: 'Rôle', field: 'role' },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: (params: any) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditUser(params.data)}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteUser(params.data)}
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddUser}
        sx={{ mb: 2 }}
      >
        Ajouter un utilisateur
      </Button>
      <div
        className={`ag-theme-quartz${theme.palette.mode === 'dark' ? '-dark' : ''}`}
        style={{ height: 400, width: '100%' }}
      >
        <AgGridReact
          rowData={users}
          columnDefs={columns}
          autoSizeStrategy={{
            type: 'fitGridWidth',
          }}
          rowHeight={50}
        />
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSave}>
          <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              type="text"
              required
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete={'username'}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={'new-password'}
            />
            <TextField
              select
              margin="dense"
              label="Role"
              fullWidth
              value={role}
              required
              onChange={(e) =>
                setRole(e.target.value as 'OPERATOR' | 'SUPERVISOR')
              }
            >
              <MenuItem value="OPERATOR">OPERATEUR</MenuItem>
              <MenuItem value="SUPERVISOR">SUPERVISEUR</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default EditUser;