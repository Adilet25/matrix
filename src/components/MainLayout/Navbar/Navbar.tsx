import React from "react";
import "../../../styles/Navbar.css";
import logo from "../../../assets/logo.svg";
import menuicon from "../../../assets/menu.svg";
import topicon from "../../../assets/ic_twotone-bar-chart (1).svg";
import exiticon from "../../../assets/Vector.svg";
import hsicon from "../../../assets/ic_twotone-bar-chart.svg";
import profileicon from "../../../assets/ic_baseline-account-circle.svg";

//! MUI dropdown
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open2, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
  return (
    <div className="mainBlock">
      <img
        src={logo}
        alt="error"
        id="logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="mainBlock_opt">
        <div className="mainBlock_nav">
          <div>
            <svg
              viewBox="0 0 36 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="navIcon"
            >
              <path d="M30 4.86133H6C4.335 4.86133 3 6.07214 3 7.58226V26.6288C3 28.1389 4.335 29.3497 6 29.3497H30C31.665 29.3497 33 28.1389 33 26.6288V7.58226C33 6.07214 31.665 4.86133 30 4.86133ZM7.5 10.3032H15V18.466H7.5V10.3032ZM28.5 23.9078H7.5V21.1869H28.5V23.9078ZM28.5 18.466H18V15.745H28.5V18.466ZM28.5 13.0241H18V10.3032H28.5V13.0241Z" />
            </svg>
            <p>ГЛАВНАЯ</p>
          </div>
          <div>
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="navIcon"
            >
              <path d="M11.955 24L7.5 28.5C7.005 28.95 6.345 29.25 5.625 29.25C4.92881 29.25 4.26113 28.9734 3.76884 28.4812C3.27656 27.9889 3 27.3212 3 26.625V26.25L4.5 15.18C4.65121 13.4934 5.42751 11.9244 6.67644 10.7809C7.92537 9.63743 9.55668 9.00222 11.25 9H24.75C28.29 9 31.185 11.715 31.5 15.18L33 26.25V26.625C33 27.3212 32.7234 27.9889 32.2312 28.4812C31.7389 28.9734 31.0712 29.25 30.375 29.25C29.655 29.25 28.995 28.95 28.5 28.5L24.045 24H11.955ZM10.5 12V15H7.5V16.5H10.5V19.5H12V16.5H15V15H12V12H10.5ZM24.75 12C24.4516 12 24.1655 12.1185 23.9545 12.3295C23.7435 12.5405 23.625 12.8266 23.625 13.125C23.625 13.4234 23.7435 13.7095 23.9545 13.9205C24.1655 14.1315 24.4516 14.25 24.75 14.25C25.0484 14.25 25.3345 14.1315 25.5455 13.9205C25.7565 13.7095 25.875 13.4234 25.875 13.125C25.875 12.8266 25.7565 12.5405 25.5455 12.3295C25.3345 12.1185 25.0484 12 24.75 12ZM22.125 14.625C21.8266 14.625 21.5405 14.7435 21.3295 14.9545C21.1185 15.1655 21 15.4516 21 15.75C21 16.0484 21.1185 16.3345 21.3295 16.5455C21.5405 16.7565 21.8266 16.875 22.125 16.875C22.4234 16.875 22.7095 16.7565 22.9205 16.5455C23.1315 16.3345 23.25 16.0484 23.25 15.75C23.25 15.4516 23.1315 15.1655 22.9205 14.9545C22.7095 14.7435 22.4234 14.625 22.125 14.625ZM27.375 14.625C27.0766 14.625 26.7905 14.7435 26.5795 14.9545C26.3685 15.1655 26.25 15.4516 26.25 15.75C26.25 16.0484 26.3685 16.3345 26.5795 16.5455C26.7905 16.7565 27.0766 16.875 27.375 16.875C27.6734 16.875 27.9595 16.7565 28.1705 16.5455C28.3815 16.3345 28.5 16.0484 28.5 15.75C28.5 15.4516 28.3815 15.1655 28.1705 14.9545C27.9595 14.7435 27.6734 14.625 27.375 14.625ZM24.75 17.25C24.4516 17.25 24.1655 17.3685 23.9545 17.5795C23.7435 17.7905 23.625 18.0766 23.625 18.375C23.625 18.6734 23.7435 18.9595 23.9545 19.1705C24.1655 19.3815 24.4516 19.5 24.75 19.5C25.0484 19.5 25.3345 19.3815 25.5455 19.1705C25.7565 18.9595 25.875 18.6734 25.875 18.375C25.875 18.0766 25.7565 17.7905 25.5455 17.5795C25.3345 17.3685 25.0484 17.25 24.75 17.25Z" />
            </svg>
            <p>МАТЧИ</p>
          </div>
          <div>
            <svg
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              className="navIcon"
            >
              <path d="M28.5 7.5H25.5V6C25.5 5.175 24.825 4.5 24 4.5H12C11.175 4.5 10.5 5.175 10.5 6V7.5H7.5C5.85 7.5 4.5 8.85 4.5 10.5V12C4.5 15.825 7.38 18.945 11.085 19.41C11.5594 20.534 12.3003 21.5257 13.2437 22.2993C14.1872 23.0728 15.3048 23.6051 16.5 23.85V28.5H12C11.175 28.5 10.5 29.175 10.5 30C10.5 30.825 11.175 31.5 12 31.5H24C24.825 31.5 25.5 30.825 25.5 30C25.5 29.175 24.825 28.5 24 28.5H19.5V23.85C20.6952 23.6051 21.8128 23.0728 22.7563 22.2993C23.6997 21.5257 24.4406 20.534 24.915 19.41C28.62 18.945 31.5 15.825 31.5 12V10.5C31.5 8.85 30.15 7.5 28.5 7.5ZM7.5 12V10.5H10.5V16.23C8.76 15.6 7.5 13.95 7.5 12ZM28.5 12C28.5 13.95 27.24 15.6 25.5 16.23V10.5H28.5V12Z" />
            </svg>
            <p>ТУРНИРЫ</p>
          </div>
          <div>
            <svg
              viewBox="0 0 36 36"
              fill="#20bf55"
              xmlns="http://www.w3.org/2000/svg"
              className="navIcon"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M25.0059 19.6953C27.0609 21.0903 28.5009 22.9803 28.5009 25.5003V30.0003H33.0009C33.8259 30.0003 34.5009 29.3253 34.5009 28.5003V25.5003C34.5009 22.2303 29.1459 20.2953 25.0059 19.6953Z"
              />
              <path d="M13.5 18C16.8137 18 19.5 15.3137 19.5 12C19.5 8.68629 16.8137 6 13.5 6C10.1863 6 7.5 8.68629 7.5 12C7.5 15.3137 10.1863 18 13.5 18Z" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M22.5 18C25.815 18 28.5 15.315 28.5 12C28.5 8.685 25.815 6 22.5 6C21.795 6 21.135 6.15 20.505 6.36C21.7958 7.95633 22.5 9.9471 22.5 12C22.5 14.0529 21.7958 16.0437 20.505 17.64C21.135 17.85 21.795 18 22.5 18ZM13.5 19.5C9.495 19.5 1.5 21.51 1.5 25.5V28.5C1.5 29.325 2.175 30 3 30H24C24.825 30 25.5 29.325 25.5 28.5V25.5C25.5 21.51 17.505 19.5 13.5 19.5Z"
              />
            </svg>
            <p>КОМАНДЫ</p>
          </div>
        </div>
        <div className="mainBlock_info">
          <div>
            <input type="text" placeholder="Поиск" className="nav_search" />
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="search"
            >
              <path d="M15.4995 13.9995H14.7095L14.4295 13.7295C15.0544 13.0035 15.5112 12.1483 15.767 11.2251C16.0229 10.3019 16.0715 9.33364 15.9095 8.38949C15.4395 5.60949 13.1195 3.38949 10.3195 3.04949C9.3351 2.92495 8.33527 3.02726 7.39651 3.34858C6.45775 3.66989 5.60493 4.20171 4.90332 4.90332C4.20171 5.60493 3.66989 6.45775 3.34858 7.39651C3.02726 8.33527 2.92495 9.3351 3.04949 10.3195C3.38949 13.1195 5.60949 15.4395 8.38949 15.9095C9.33364 16.0715 10.3019 16.0229 11.2251 15.767C12.1483 15.5112 13.0035 15.0544 13.7295 14.4295L13.9995 14.7095V15.4995L18.2495 19.7495C18.6595 20.1595 19.3295 20.1595 19.7395 19.7495C20.1495 19.3395 20.1495 18.6695 19.7395 18.2595L15.4995 13.9995ZM9.49949 13.9995C7.00949 13.9995 4.99949 11.9895 4.99949 9.49949C4.99949 7.00949 7.00949 4.99949 9.49949 4.99949C11.9895 4.99949 13.9995 7.00949 13.9995 9.49949C13.9995 11.9895 11.9895 13.9995 9.49949 13.9995Z" />
            </svg>
          </div>
          <div id="mmr">
            MMR
            <br />
            1200
          </div>
          <div>
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                color="inherit"
              >
                <AccountCircle />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                sx={{
                  mt: "1px",
                  "& .MuiMenu-paper": {
                    backgroundColor: "#1A1A1C",
                    color: "#F8F8F8",
                  },
                }}
              >
                <MenuItem onClick={handleClose}>
                  <div className="profileDrop">
                    <img src={profileicon} alt="error" />
                    Профиль
                  </div>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <div className="profileDrop">
                    <img src={topicon} alt="error" />
                    Топ
                  </div>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <div className="profileDrop">
                    <img src={hsicon} alt="error" />
                    История матчей
                  </div>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <div className="profileDrop">Выйти</div>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
        <div className="mainBlock_drawer">
          <Button onClick={toggleDrawer(true)}>
            <img src={menuicon} alt="error" style={{ width: "2.6rem" }} />
          </Button>
          <Drawer anchor={"right"} open={open2} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 250 }} role="presentation">
              <List>
                <div className="drawerSearch">
                  <input
                    type="text"
                    placeholder="Поиск"
                    className="nav_search"
                  />
                </div>
              </List>
            </Box>
            <Divider />
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <List>
                <ListItemButton>1200 MMR</ListItemButton>
              </List>
            </Box>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <List>
                <ListItemButton>Профиль</ListItemButton>
              </List>
            </Box>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <List>
                <ListItemButton>Топ</ListItemButton>
              </List>
            </Box>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <List>
                <ListItemButton>История матчей</ListItemButton>
              </List>
            </Box>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <List>
                <ListItemButton>Выйти</ListItemButton>
              </List>
            </Box>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
