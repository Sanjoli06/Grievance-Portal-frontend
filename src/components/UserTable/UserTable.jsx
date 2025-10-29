import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  getAllUsers,
  updateUserDetails,
  deleteUser,
  getAllDepartments,
} from "../../utils/services/api";
import { toast } from "react-toastify";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState(["hey","hi"]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [formData, setFormData] = useState({ role: "", department: "" });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      console.log("res---", res);
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getAllDepartments();
      setDepartments(res.data.departments); // assuming API returns { departments: [...] }
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ role: user.role, department: user.department?.name || "" });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await updateUserDetails(selectedUser._id, formData);
      toast.success("User updated successfully");
      setOpenEdit(false);
      fetchUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser._id);
      toast.success("User deleted successfully");
      setOpenDelete(false);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Typography variant="h5" fontWeight={600} mb={2}>
        User Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>
                <b>Department</b>
              </TableCell>
              <TableCell>
                <b>Address</b>
              </TableCell>
              <TableCell align="center">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 0
                    ? "Citizen"
                    : user.role === 1
                    ? "Gov Agent"
                    : "Admin"}
                </TableCell>
                <TableCell>{user.department?.name || "—"}</TableCell>
                <TableCell>{user.address?.City || "—"}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenDelete(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Role"
            fullWidth
            margin="normal"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: Number(e.target.value) })
            }
          >
            <MenuItem value={0}>Citizen</MenuItem>
            <MenuItem value={1}>Gov Agent</MenuItem>
          </TextField>
          <TextField
            select
            label="Department"
            fullWidth
            margin="normal"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          >
            {departments.map((dep) => (
              <MenuItem key={dep._id} value={dep.name}>
                {dep.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{selectedUser?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default UserTable;
