import React, { useState } from 'react';
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  Collapse,
  Accordion,
  ListItem,
  AccordionHeader,
  ListItemPrefix,
  AccordionBody,
  List,
  ListItemSuffix,
  Chip,
} from '@material-tailwind/react';
import {
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  Bars2Icon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  InboxIcon,
  PresentationChartBarIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/solid';

// profile menu component
const profileMenuItems = [
  {
    label: 'My Profile',
    icon: UserCircleIcon,
  },
  {
    label: 'Edit Profile',
    icon: Cog6ToothIcon,
  },
  {
    label: 'Inbox',
    icon: InboxArrowDownIcon,
  },
  {
    label: 'Help',
    icon: LifebuoyIcon,
  },
  {
    label: 'Sign Out',
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="candice wu"
            className="border border-blue-500 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? 'hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10'
                  : ''
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? 'text-red-500' : ''}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? 'red' : 'inherit'}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

function NavList() {
  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };
  return (
    <List>
      <Accordion
        open={open === 1}
        icon={
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`mx-auto h-4 w-4 transition-transform ${
              open === 1 ? 'rotate-180' : ''
            }`}
          />
        }
      >
        <ListItem className="p-0" selected={open === 1}>
          <AccordionHeader
            onClick={() => handleOpen(1)}
            className="border-b-0 p-3"
          >
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Dashboard
            </Typography>
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          <List className="p-0">
            <ListItem>
              <ListItemPrefix>
                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
              </ListItemPrefix>
              Analytics
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
              </ListItemPrefix>
              Reporting
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
              </ListItemPrefix>
              Projects
            </ListItem>
          </List>
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === 2}
        icon={
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`mx-auto h-4 w-4 transition-transform ${
              open === 2 ? 'rotate-180' : ''
            }`}
          />
        }
      >
        <ListItem className="p-0" selected={open === 2}>
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className="border-b-0 p-3"
          >
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              E-Commerce
            </Typography>
          </AccordionHeader>
        </ListItem>
        <AccordionBody className="py-1">
          <List className="p-0">
            <ListItem>
              <ListItemPrefix>
                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
              </ListItemPrefix>
              Orders
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
              </ListItemPrefix>
              Products
            </ListItem>
          </List>
        </AccordionBody>
      </Accordion>
      <ListItem>
        <ListItemPrefix>
          <InboxIcon className="h-5 w-5" />
        </ListItemPrefix>
        Inbox
        <ListItemSuffix>
          <Chip
            value="14"
            size="sm"
            variant="ghost"
            color="blue-gray"
            className="rounded-full"
          />
        </ListItemSuffix>
      </ListItem>
      <ListItem>
        <ListItemPrefix>
          <UserCircleIcon className="h-5 w-5" />
        </ListItemPrefix>
        Profile
      </ListItem>
      <ListItem>
        <ListItemPrefix>
          <Cog6ToothIcon className="h-5 w-5" />
        </ListItemPrefix>
        Settings
      </ListItem>
      <ListItem>
        <ListItemPrefix>
          <PowerIcon className="h-5 w-5" />
        </ListItemPrefix>
        Log Out
      </ListItem>
    </List>
  );
}

export default function Header() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);

  return (
    <Navbar className="fixed bg-opacity-100 mx-auto shadow-none max-w-full backdrop-blur-0 rounded-none lg:pl-10 round lg:pr-60 bg-gray-200">
      <div className="relative mx-auto flex items-center text-blue-gray-900">
        <h2 className="mr-4 ml-2 cursor-pointer lg:text-2xl font-bold">
          DELIVERY SYSTEM
        </h2>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        <ProfileMenu />
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList />
      </Collapse>
    </Navbar>
  );
}
