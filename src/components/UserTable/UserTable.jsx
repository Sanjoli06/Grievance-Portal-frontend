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
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  alpha,
} from "@mui/material";
import { Edit, Delete, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  getAllUsers,
  updateUserDetails,
  deleteUser,
  getAllDepartments,
} from "../../utils/services/api";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete]=useState(false);
  const [formData, setFormData] = useState({ role: "", department: "" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const getRoleChip = (role) => {
  let label, bgColor, textColor;
  switch (role) {
    case 0:
      label = "Citizen";
      bgColor = "#E8F5E8"; // light green
      textColor = "#2E7D32"; // dark green
      break;
    case 1:
      label = "Gov Agent";
      bgColor = "#E3F2FD"; // light blue
      textColor = "#1565C0"; // dark blue
      break;
    case 2:
      label = "Admin";
      bgColor = "#F3E5F5"; // light purple
      textColor = "#4A148C"; // dark purple
      break;
    default:
      label = "Unknown";
      bgColor = "#F5F5F5"; // light grey
      textColor = "#6C757D"; // grey
  }
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        fontWeight: 500,
      }}
    />
  );
};

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data.users || []);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await getAllDepartments();
      setDepartments(res.data.departments || []);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      role: user.role,
      department: user.department?.name || "",
    });
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

  const iconSx = (colorPalette) => ({
    color: `${colorPalette}.main`,
    bgcolor: alpha(theme.palette[colorPalette].main, 0.12),
    "&:hover": {
      bgcolor: alpha(theme.palette[colorPalette].main, 0.24),
      color: `${colorPalette}.main`,
    },
    mx: 0.5,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Typography
        variant="h5"
        fontWeight={600}
        mb={3}
        textAlign={isMobile ? "center" : "left"}
      >
        User Management
      </Typography>

      {/* ✅ TABLE VIEW — for tablet and desktop */}
      {!isMobile ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            width: "100%",
            mx: "auto",
            overflowX: "hidden", // ✅ UPDATED: prevent unnecessary horizontal scroll
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: "100%",
              "& .MuiTableCell-root": {
                padding: "12px 16px",
                fontSize: "0.94rem",
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                  "& th": {
                    fontWeight: 600,
                    color: "#333",
                  },
                }}
              >
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell sx={{ pl: "0px" }}>
                  {" "}
                  {/* ✅ UPDATED spacing: reduced for Role */}
                  Role
                </TableCell>
                <TableCell sx={{ pl: "8px" }}>
                  {" "}
                  {/* ✅ UPDATED spacing: equalized for Department */}
                  Department
                </TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#fafafa",
                    },
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell sx={{ pl: "0px" }}>
                    {" "}
                    {/* ✅ UPDATED spacing */}
                    {getRoleChip(user.role)}
                  </TableCell>
                  <TableCell sx={{ pl: "8px" }}>
                    {" "}
                    {/* ✅ UPDATED spacing */}
                    {user.department?.name || "—"}
                  </TableCell>
                  <TableCell>{user.address?.City || "—"}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleEdit(user)}
                        sx={iconSx("primary")}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDelete(true);
                        }}
                        sx={iconSx("error")}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // ✅ MOBILE CARD VIEW — beautified
        <Box>
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Accordion
                sx={{
                  borderRadius: 3,
                  mb: 2,
                  // boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                  "&:before": { display: "none" },
                  "&.Mui-expanded": {
                    borderRadius: 3,
                    // boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.10)}`,
                  },
                  backgroundColor: "white",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMore
                      sx={{
                        color: theme.palette.primary.main,
                      }}
                    />
                  }
                  sx={{
                    px: 3,
                    py: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, white 100%)`,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    minHeight: 56,
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      display: "flex",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color={theme.palette.primary.main}
                    sx={{ flexGrow: 1 }}
                  >
                    {user.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: "#fafbff",
                    p: 3,
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Box display="flex" flexDirection="column" gap={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          backgroundColor: "white",
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ minWidth: 60 }}>
                          Email:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {user.email}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          backgroundColor: "white",
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ minWidth: 60 }}>
                          Role:
                        </Typography>
                        <Box>{getRoleChip(user.role)}</Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          backgroundColor: "white",
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ minWidth: 60 }}>
                          Department:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {user.department?.name || "—"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          backgroundColor: "white",
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ minWidth: 60 }}>
                          Address:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {user.address?.City || "—"}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap={2}
                        sx={{ pt: 1 }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(user)}
                            sx={iconSx("primary")}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenDelete(true);
                            }}
                            sx={iconSx("error")}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </motion.div>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      )}

      {/* ✅ BEAUTIFIED EDIT MODAL */}
      <Dialog 
        open={openEdit} 
        onClose={() => setOpenEdit(false)} 
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 6,
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.main,
            background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.grey[50]} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            py: 2,
          }}
        >
          Edit User Details
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: '#fafbff' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <TextField
              select
              label="Role"
              fullWidth
              margin="normal"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: Number(e.target.value) })
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                },
              }}
            >
              <MenuItem value={0}>Citizen</MenuItem>
              <MenuItem value={1}>Gov Agent</MenuItem>
              <MenuItem value={2}>Admin</MenuItem>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                },
              }}
            >
              {departments.map((dep) => (
                <MenuItem key={dep._id} value={dep.name}>
                  {dep.name}
                </MenuItem>
              ))}
            </TextField>
          </motion.div>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Button 
            onClick={() => setOpenEdit(false)} 
            variant="outlined"
            sx={{
              borderColor: alpha(theme.palette.grey[500], 0.5),
              color: theme.palette.grey[600],
              borderRadius: 2,
              px: 3,
              '&:hover': {
                borderColor: alpha(theme.palette.grey[500], 0.5),
                backgroundColor: alpha(theme.palette.grey[100], 0.5),
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              borderRadius: 2,
              px: 3,
              boxShadow: 2,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: 4,
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{selectedUser?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default UserTable;