import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Work,
  People,
  CalendarMonth,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
const DRAWER_FULL = 240;
const DRAWER_COLLAPSED = 70;
const APP_BAR_HEIGHT = 64;
const navItems = [
  { label: "Home",       icon: <Dashboard />,      path: "/" },
  { label: "Complaint",  icon: <People />,         path: "/complaint" },
  { label: "Add",        icon: <Work />,           path: "/add" },
  { label: "Add Event",  icon: <CalendarMonth />,  path: "/event" },
  { label: "Reports",    icon: <BarChart />,       path: "/reports" },
  { label: "Settings",   icon: <Settings />,       path: "/settings" },
];
export default function ResponsiveSidebar({
  role,
  onLogout,
  onCollapseChange,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({ name: "", profilePic: "" });
  const isMobile = useMediaQuery("(max-width:599px)");
  useEffect(() => {
    const name = localStorage.getItem("username") || "Sandeep Kumar";
    const pic =
      localStorage.getItem("profilePic") ||
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    setUser({ name, profilePic: pic });
  }, []);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      const next = !collapsed;
      setCollapsed(next);
      onCollapseChange && onCollapseChange(next);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        transition: "width 0.3s ease",
      }}
    >
      <Box
        sx={{
          height: APP_BAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          px: 2,
          bgcolor: "background.paper",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {collapsed && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <MenuIcon sx={{ color: "#1B5E20", fontSize: 28 }} />
          </IconButton>
        )}
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              G
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#1B5E20",
                fontSize: 20,
                letterSpacing: 0.5,
              }}
            >
              Grivenceve
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, pt: 1 }}>
        {navItems.map((item) => (
          <Tooltip
            key={item.path}
            title={collapsed ? item.label : ""}
            placement="right"
            arrow
          >
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: 2.5,
                  mx: collapsed ? 1 : 0,
                  borderRadius: collapsed ? "50%" : 1,
                  "&.active": {
                    bgcolor: "#e8f5e9",
                    "& .MuiListItemIcon-root": { color: "#1B5E20" },
                  },
                  "&:hover": { bgcolor: "#f0f7f0" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#43A047",
                    minWidth: 0,
                    mr: collapsed ? 0 : 3,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14.5, fontWeight: 500 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: "100%",
            md: `calc(100% - ${collapsed ? DRAWER_COLLAPSED : DRAWER_FULL}px)`,
          },
          ml: { md: `${collapsed ? DRAWER_COLLAPSED : DRAWER_FULL}px` },
          bgcolor: "#1B5E20",
          height: APP_BAR_HEIGHT,
          transition: "all 0.3s ease",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: "100%", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap fontWeight="medium">
            
          </Typography>

          <Box sx={{ display: "flex", alignItems:"flex-end", gap: 1.5 }}>
            <Avatar
              src={user.profilePic}
              alt={user.name}
              sx={{ width: 36, height: 36, border: "2px solid white" }}
            />
            <Typography
              variant="subtitle1"
              sx={{ display: { xs: "none", sm: "block" }, fontWeight: 500 }}
            >
              {user.name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: collapsed ? DRAWER_COLLAPSED : DRAWER_FULL,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: collapsed ? DRAWER_COLLAPSED : DRAWER_FULL,
              boxSizing: "border-box",
              transition: "width 0.3s ease",
              overflowX: "hidden",
              bgcolor: "#fafafa",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_FULL,
              boxSizing: "border-box",
              bgcolor: "#fafafa",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {!isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: `${APP_BAR_HEIGHT + 16}px`,
            left: collapsed
              ? `${DRAWER_COLLAPSED - 12}px`
              : `${DRAWER_FULL - 12}px`,
            zIndex: 1300,
            bgcolor: "background.paper",
            boxShadow: 2,
            transition: "left 0.3s ease, transform 0.3s ease",
            "&:hover": { bgcolor: "background.default" },
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      )}
    </Box>
  );
}