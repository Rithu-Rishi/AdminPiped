import React, { useState } from 'react';
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
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

const SidebarMenu = () => {
  const role = localStorage.getItem("role");
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <span className="togglebtn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <CloseIcon /> : <MenuIcon />}
      </span>
      <Sidebar collapsed={collapsed} className='main_sidebar'>
        <Menu>
          {(role === "Super Admin" || role === "Admin") && (
            <>
              <MenuItem component={<Link to="/dashboard" />}><HomeOutlinedIcon />Dashboard</MenuItem>
              <MenuItem component={<Link to="/admins" />}><AdminPanelSettingsOutlinedIcon />Admins</MenuItem>
              <MenuItem component={<Link to="/parentlist" />}><Man2OutlinedIcon />Parents</MenuItem>
              <MenuItem component={<Link to="/childlist" />}><WcOutlinedIcon />Childrens</MenuItem>
              <MenuItem component={<Link to="/child-programs" />}><AlignHorizontalLeftIcon />All Subscriptions</MenuItem>
              <SubMenu label="Programs" icon={<SchoolOutlinedIcon />}>
                <MenuItem component={<Link to="/programs" />}><RemoveIcon />All Programs</MenuItem>
                <MenuItem component={<Link to="/subPrograms" />}><RemoveIcon />Sub Programs</MenuItem>
                <MenuItem component={<Link to="/programSkill" />}><RemoveIcon />Programs Skills</MenuItem>
                <MenuItem component={<Link to="/skillProgression" />}><RemoveIcon />Skill Progression</MenuItem>
                <MenuItem component={<Link to="/paymentPlan" />}><RemoveIcon />Payment Plan</MenuItem>
                <MenuItem component={<Link to="/timeSlots" />}><RemoveIcon />Time Slots</MenuItem>
              </SubMenu>
              <SubMenu label="Facilities" icon={<SettingsBrightnessIcon />}>
                <MenuItem component={<Link to="/facilityPlans" />}><RemoveIcon />Facility Plans</MenuItem>
                <MenuItem component={<Link to="/facilityUserPayments" />}><RemoveIcon />Facility Payments</MenuItem>
                <MenuItem component={<Link to="/facilitySubscriptions" />}><RemoveIcon />Facility Subscriptions</MenuItem>
              </SubMenu>
              <MenuItem component={<Link to="/teachers" />}><ReduceCapacityOutlinedIcon />Teachers</MenuItem>
              <MenuItem component={<Link to="/teacherSchedule" />}><EventAvailableOutlinedIcon />Teachers Schedule</MenuItem>
              <MenuItem component={<Link to="/teacherFeecback" />}><StarBorderPurple500OutlinedIcon />Teachers Feedback</MenuItem>
              <MenuItem component={<Link to="/attendance" />}><CheckCircleOutlinedIcon />Attendance</MenuItem>
              <MenuItem component={<Link to="/transitions" />}><AccountBalanceWalletOutlinedIcon />Program Transactions</MenuItem>
              <MenuItem component={<Link to="/userBookings" />}><BeenhereOutlinedIcon />Class Bookings</MenuItem>
              <MenuItem component={<Link to="/programSubscriptions" />}><AllOutOutlinedIcon />Program Subscriptions</MenuItem>
              <MenuItem component={<Link to="/wallet-transactions" />}><WalletOutlinedIcon />Wallet Transactions</MenuItem>
              <MenuItem component={<Link to="/helpSupport" />}><HelpCenterOutlinedIcon />Help Support</MenuItem>
              <MenuItem component={<Link to="/cafeteria" />}><FoodBankOutlinedIcon />Cafeteria</MenuItem>
              <SubMenu label="Others" icon={<AccountTreeIcon />}>
                <MenuItem component={<Link to="/coupons" />}><RemoveIcon />Coupons</MenuItem>
                <MenuItem component={<Link to="/device-attendance" />}><RemoveIcon />Device Attendance</MenuItem>
                <MenuItem component={<Link to="/sliders" />}><RemoveIcon />Home Slider</MenuItem>
                <MenuItem component={<Link to="/workshop" />}><RemoveIcon />Work Shop</MenuItem>
                <MenuItem component={<Link to="/offers" />}><RemoveIcon />Offers</MenuItem>
                <MenuItem component={<Link to="/noticeboard" />}><RemoveIcon />Notice Board</MenuItem>
              </SubMenu>
            </>
          )}
          {role === "Cafeteria" && (
            <>
              <MenuItem component={<Link to="/menuItems" />}><MenuBookOutlinedIcon />Menu Items</MenuItem>
              <MenuItem component={<Link to="/transactions" />}><ReceiptLongOutlinedIcon />Transactions</MenuItem>
            </>
          )}
        </Menu>
      </Sidebar>
    </>
  );
}

export default SidebarMenu;
