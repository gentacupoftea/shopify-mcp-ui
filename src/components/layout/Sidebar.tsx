import React from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  useTheme,
} from "@mui/material";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  CpuChipIcon,
  PresentationChartLineIcon,
  RectangleStackIcon,
  LinkIcon,
  UserIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { ConeaLogo } from "../branding/ConeaLogo";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: "permanent" | "temporary";
}

const navigation: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "AI Chat Space", path: "/chat", icon: CpuChipIcon },
  { name: "Orders", path: "/orders", icon: ShoppingBagIcon },
  { name: "Customers", path: "/customers", icon: UserGroupIcon },
  { name: "Analytics", path: "/analytics", icon: ChartBarIcon },
  {
    name: "Dashboard Editor",
    path: "/dashboard-editor",
    icon: PresentationChartLineIcon,
  },
  {
    name: "Saved Dashboards",
    path: "/saved-dashboards",
    icon: RectangleStackIcon,
  },
  { name: "API Settings", path: "/api-settings", icon: LinkIcon },
  { name: "Reports", path: "/reports", icon: DocumentTextIcon },
  { name: "Profile", path: "/profile", icon: UserIcon },
  { name: "Notifications", path: "/notifications", icon: BellIcon },
  { name: "Settings", path: "/settings", icon: CogIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
  const theme = useTheme();
  const drawerWidth = 200;

  const drawer = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        position: "relative",
      }}
    >
      <Toolbar
        sx={{
          backgroundColor: "transparent",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ConeaLogo variant="horizontal" size="md" />
      </Toolbar>
      <List sx={{ p: 2 }}>
        {navigation.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <NavLink
              to={item.path}
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
            >
              {({ isActive }) => (
                <ListItemButton
                  selected={isActive}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={0}
                  role="link"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      // Reactの機能を使用してNavigationをシミュレートし、RouteChangeを発生させる
                      const link = document.createElement("a");
                      link.href = item.path;
                      link.click();
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      color: "#FFFFFF",
                      "& .MuiListItemIcon-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(16, 185, 129, 0.1)",
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: "2px",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? "#FFFFFF"
                        : theme.palette.text.secondary,
                      minWidth: 40,
                    }}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
