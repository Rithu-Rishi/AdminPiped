import React, { useState } from 'react';
import {
  List, ListItemButton, ListItemText, Collapse, ListItemIcon,
  Popper, Paper, ClickAwayListener
} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from "react-router-dom";
import RemoveIcon from '@mui/icons-material/Remove';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Man2OutlinedIcon from '@mui/icons-material/Man2Outlined';
import WcOutlinedIcon from '@mui/icons-material/WcOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ReduceCapacityOutlinedIcon from '@mui/icons-material/ReduceCapacityOutlined';
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AllOutOutlinedIcon from '@mui/icons-material/AllOutOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import FoodBankOutlinedIcon from '@mui/icons-material/FoodBankOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const [openOne, setOpenOne] = React.useState(false);
  const [openTwo, setOpenTwo] = React.useState(false);
  const [openConteen, setOpenCOnteen] = React.useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const role = localStorage.getItem("role");
  console.log("role ", role);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickOne = () => {
    setOpenOne(!openOne);
  };

  const handleClickTwo = () => {
    setOpenTwo(!openTwo);
  };

  const handleClickConteen = () => {
    setOpenCOnteen(!openConteen);
  };

  const toggleExpandedCollpse = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <span className='togglebtn' onClick={toggleExpandedCollpse}>
        {isExpanded ? <MenuIcon /> : <CloseIcon />}
      </span>

      <List className='Sidebar_list pt-0'
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"

      >
        {/* <div className='text-center logo'>
          <img src={logo} alt="Preview" className='pe-3' height={50} />
        </div> */}
        {(role === "Super Admin" || role === "Admin") && (
          <>
            <Link to="/dashboard">
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Dashboard" />
              </ListItemButton>
            </Link>
            <Link to='/admins'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <AdminPanelSettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Admins" />
              </ListItemButton>
            </Link>
            <Link to='/parentlist'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <Man2OutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Parents" />
              </ListItemButton>
            </Link>

            <Link to="/childlist">
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <WcOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Childrens" />
              </ListItemButton>
            </Link>

            <ListItemButton className='single_item' onClick={handleClick}>
              <ListItemIcon className='icon_items'>
                <SchoolOutlinedIcon />
              </ListItemIcon>
              <ListItemText className='text_items' primary="Programs" />
              {open ? <ExpandLess className='icon_down' /> : <ExpandMore className='icon_down' />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Link to="/programs">
                <ListItemButton className='single_item' sx={{ pl: 4 }}>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="All Programs" />
                </ListItemButton>
              </Link>
              <Link to="/subPrograms">
                <ListItemButton className='single_item' sx={{ pl: 4 }}>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Sub Programs" />
                </ListItemButton>
              </Link>
              <Link to="/programSkill">
                <ListItemButton className='single_item' sx={{ pl: 4 }}>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Programs Skills" />
                </ListItemButton>
              </Link>
              <Link to="/skillProgression">
                <ListItemButton className='single_item' sx={{ pl: 4 }}>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Skill Progression" />
                </ListItemButton>
              </Link>
              <Link to="/paymentPlan">
                <ListItemButton className='single_item' sx={{ pl: 4 }}>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Payment Plan" />
                </ListItemButton>
              </Link>
              <Link to="/timeSlots">
                <ListItemButton className='single_item' sx={{ pl: 4 }}>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Time Slots" />
                </ListItemButton>
              </Link>
            </Collapse>

            {/* <ListItemButton className='single_item' onClick={handleClickConteen}>
              <ListItemIcon className='icon_items'>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText className='text_items' primary="Canteen" />
              {openConteen ? <ExpandLess className='icon_down' /> : <ExpandMore className='icon_down' />}
            </ListItemButton>
            <Collapse in={openConteen} timeout="auto" unmountOnExit>
              <Link to="/menuItems">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Menu Items" />
                </ListItemButton>
              </Link>

              <Link to="/viewTransactions">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Transaction" />
                </ListItemButton>
              </Link>
            </Collapse> */}

            <ListItemButton className='single_item' onClick={handleClickOne}>
              <ListItemIcon className='icon_items'>
                <SettingsBrightnessIcon />
              </ListItemIcon>
              <ListItemText className='text_items' primary="Facilities" />
              {openOne ? <ExpandLess className='icon_down' /> : <ExpandMore className='icon_down' />}
            </ListItemButton>
            <Collapse in={openOne} timeout="auto" unmountOnExit>
              <Link to="/facilityPlans">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Facility Plans" />
                </ListItemButton>
              </Link>

              <Link to="/facilityUserPayments">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Facility Payments" />
                </ListItemButton>
              </Link>

              <Link to="/facilitySubscriptions">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Facility Subscriptions" />
                </ListItemButton>
              </Link>
            </Collapse>

            <Link to='/teachers'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <ReduceCapacityOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Teachers" />
              </ListItemButton>
            </Link>
            <Link to='/teacherFeecback'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <StarBorderPurple500OutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Teachers Feedback" />
              </ListItemButton>
            </Link>
            <Link to='/attendance'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <CheckCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Attendance" />
              </ListItemButton>
            </Link>
            <Link to='/transitions'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <AccountBalanceWalletOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Program Transactions" />
              </ListItemButton>
            </Link>
            <Link to='/userBookings'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <BeenhereOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Class Bookings" />
              </ListItemButton>
            </Link>
            <Link to='/programSubscriptions'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <AllOutOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Program Subscriptions" />
              </ListItemButton>
            </Link>
            <Link to='/wallet-transactions'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <WalletOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Wallet Transactions" />
              </ListItemButton>
            </Link>
            <Link to='/cafeteria'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <FoodBankOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Cafeteria" />
              </ListItemButton>
            </Link>

            <ListItemButton className='single_item' onClick={handleClickTwo}>
              <ListItemIcon className='icon_items'>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText className='text_items' primary="Others" />
              {openTwo ? <ExpandLess className='icon_down' /> : <ExpandMore className='icon_down' />}
            </ListItemButton>
            <Collapse in={openTwo} timeout="auto" unmountOnExit>
              <Link to="/coupons">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Coupons" />
                </ListItemButton>
              </Link>

              <Link to="/sliders">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Home Slider" />
                </ListItemButton>
              </Link>

              <Link to="/workshop">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Work Shop" />
                </ListItemButton>
              </Link>

              <Link to="/offers">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Offers" />
                </ListItemButton>
              </Link>

              <Link to="/noticeboard">
                <ListItemButton className='single_item'>
                  <ListItemIcon className='icon_items'>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText className='text_items' primary="Notice Board" />
                </ListItemButton>
              </Link>

            </Collapse>
          </>
        )}
        {role === "Cafeteria" && (
          <>
            <Link to='/menuItems'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <MenuBookOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Menu Items" />
              </ListItemButton>
            </Link>
            <Link to='/viewTransactions'>
              <ListItemButton className='single_item'>
                <ListItemIcon className='icon_items'>
                  <ReceiptLongOutlinedIcon />
                </ListItemIcon>
                <ListItemText className='text_items' primary="Transactions" />
              </ListItemButton>
            </Link>
          </>
        )}
      </List>

    </div>

  );
}

export default Sidebar;
