import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
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
import logo from '../assets/images/logo1.png'
const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpandedCollpse = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <span className='togglebtn' onClick={toggleExpandedCollpse}>
        {isExpanded ? <CloseIcon /> : <MenuIcon />}
      </span>

      <List className='Sidebar_list'
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"

      >
        <div className='text-center'>
          <img src={logo} alt="Preview" className='pe-3' height={50} />
        </div>
        <Link to="/dashboard">
          <ListItemButton className='single_item'>
            <ListItemIcon className='icon_items'>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText className='text_items' primary="Dashboard" />
          </ListItemButton>
        </Link>
        <Link to='/perantslist'>
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
          <Link to="/subProgramFocus">
            <ListItemButton className='single_item' sx={{ pl: 4 }}>
              <ListItemIcon className='icon_items'>
                <RemoveIcon />
              </ListItemIcon>
              <ListItemText className='text_items' primary="Program Focus" />
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
          <Link to="/assignTeachers">
            <ListItemButton className='single_item' sx={{ pl: 4 }}>
              <ListItemIcon className='icon_items'>
                <RemoveIcon />
              </ListItemIcon>
              <ListItemText className='text_items' primary="Assign teachers" />
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
        <Link to='/'>
          <ListItemButton className='single_item'>
            <ListItemIcon className='icon_items'>
              <StarBorderPurple500OutlinedIcon />
            </ListItemIcon>
            <ListItemText className='text_items' primary="Teachers Feedback" />
          </ListItemButton>
        </Link>
        <Link to='/'>
          <ListItemButton className='single_item'>
            <ListItemIcon className='icon_items'>
              <AccountBalanceWalletOutlinedIcon />
            </ListItemIcon>
            <ListItemText className='text_items' primary="Transitions" />
          </ListItemButton>
        </Link>
        <Link to='/'>
          <ListItemButton className='single_item'>
            <ListItemIcon className='icon_items'>
              <BeenhereOutlinedIcon />
            </ListItemIcon>
            <ListItemText className='text_items' primary="Class Bookings" />
          </ListItemButton>
        </Link>

      </List>

    </div>

  );
}

export default Sidebar;
