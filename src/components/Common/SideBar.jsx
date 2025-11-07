import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  NoteAdd as NoteAddIcon,
  ReceiptLong as ReceiptLongIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  ViewList as ViewListIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = ({ role, onLogout }) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));
  const [hovered, setHovered] = useState(false);

  const citizenMenu = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "File Complaint", icon: NoteAddIcon, path: "/file-complaint" },
    { label: "My Complaints", icon: ReceiptLongIcon, path: "/my-complaints" },
    { label: "Profile", icon: PersonIcon, path: "/profile" },
  ];

  const agentMenu = [
    { label: "Dashboard", icon: DashboardIcon, path: "/agent-dashboard" },
    { label: "Complaints", icon: AssignmentIcon, path: "/complaints" },
    { label: "Profile", icon: PersonIcon, path: "/profile" },
  ];

  const adminMenu = [
    { label: "Dashboard", icon: DashboardIcon, path: "/admin-dashboard" },
    { label: "Manage Users", icon: PeopleIcon, path: "/manage-users" },
    { label: "Manage Departments", icon: BusinessIcon, path: "/manage-departments" },
    { label: "Complaints Overview", icon: ViewListIcon, path: "/complaints-overview" },
    { label: "Reports", icon: AssessmentIcon, path: "/reports" },
  ];

  const getMenu = () => {
    switch (role) {
      case "citizen":
        return citizenMenu;
      case "agent":
        return agentMenu;
      case "admin":
        return adminMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenu();

  const handleMouseEnter = () => {
    if (!isSmDown) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSmDown) {
      setHovered(false);
    }
  };

  const isExpanded = isSmDown || hovered;
  const drawerWidth = isSmDown ? 280 : hovered ? 250 : 70;

  return (
    <Box
      component="nav"
      sx={{
        width: drawerWidth,
        flexShrink: { md: 0 },
        whiteSpace: "nowrap",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard * 1.5, // Slower for smoother feel
        }),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Drawer
        variant="persistent"
        anchor="left"
        open={true} // Always persistent and open
        sx={{
          display: { xs: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.98)", // Slightly more transparent white
            backdropFilter: "blur(20px)", // Enhanced blur for glass effect
            borderRight: "none",
            boxShadow: isExpanded
              ? "2px 0 20px rgba(0, 0, 0, 0.08)"
              : "1px 0 10px rgba(0, 0, 0, 0.05)",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard * 1.5,
            }),
          },
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isExpanded ? "flex-start" : "center",
              p: isSmDown ? 2.5 : 2,
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: "rgba(39, 174, 96, 0.05)",
              minHeight: 70,
              transition: theme.transitions.create(["padding", "justifyContent"], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
            }}
          >
            {isExpanded ? (
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  color: "#27AE60",
                  ml: 2,
                  opacity: 1,
                  transition: theme.transitions.create("all", {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.standard,
                  }),
                }}
              >
                Grievance Portal
              </Typography>
            ) : (
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  color: "#27AE60",
                  opacity: 1,
                  transition: theme.transitions.create("opacity", {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.standard,
                  }),
                }}
              >
                GP
              </Typography>
            )}
          </Box>

          {/* Menu Items */}
          <List sx={{ flexGrow: 1, p: 1, mt: 2 }}>
            {menuItems.map((item, index) => (
              <ListItem
                key={item.label}
                component={Link}
                to={item.path}
                button
                disablePadding
                sx={{
                  display: "flex",
                  alignItems: "center", // Ensure horizontal alignment
                  flexDirection: "row", // Explicit row for icon-text
                  borderRadius: 2,
                  mx: 0.5,
                  my: 0.5,
                  transition: theme.transitions.create(["all", "transform"], {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.short,
                  }),
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(39, 174, 96, 0.08)",
                    transform: "translateX(2px)", // Reduced for subtlety
                    boxShadow: "0 2px 8px rgba(39, 174, 96, 0.15)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    color: "#27AE60",
                    transition: theme.transitions.create(["marginRight", "fontSize"], {
                      easing: theme.transitions.easing.easeInOut,
                      duration: theme.transitions.duration.standard,
                    }),
                    mr: isExpanded ? 3 : 0, // Increased margin for better spacing
                    fontSize: { xs: "1.5rem", md: "1.25rem" },
                    flexShrink: 0, // Prevent icon shrinking
                  }}
                >
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
                    transition: theme.transitions.create(["opacity", "transform"], {
                      easing: theme.transitions.easing.easeInOut,
                      duration: theme.transitions.duration.standard,
                    }),
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    ml: 0.5,
                    "& .MuiTypography-root": {
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      color: "#333",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Logout Item */}
          <List sx={{ p: 1, mt: "auto" }}>
            <ListItem
              button
              disablePadding
              onClick={onLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                borderRadius: 2,
                mx: 0.5,
                my: 0.5,
                transition: theme.transitions.create(["all", "transform"], {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.short,
                }),
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "rgba(39, 174, 96, 0.08)",
                  transform: "translateX(2px)",
                  boxShadow: "0 2px 8px rgba(39, 174, 96, 0.15)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  color: "#27AE60",
                  transition: theme.transitions.create(["marginRight", "fontSize"], {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.standard,
                  }),
                  mr: isExpanded ? 3 : 0,
                  fontSize: { xs: "1.5rem", md: "1.25rem" },
                  flexShrink: 0,
                }}
              >
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
                  transition: theme.transitions.create(["opacity", "transform"], {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.standard,
                  }),
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  ml: 0.5,
                  "& .MuiTypography-root": {
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "#333",
                  },
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;