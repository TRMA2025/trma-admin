import { Icon } from "@iconify/react";
import pieChart2Fill from "@iconify/icons-eva/pie-chart-2-fill";
import barchartfill from "@iconify/icons-eva/bar-chart-fill";
import peopleFill from "@iconify/icons-eva/people-fill";
import shoppingBagFill from "@iconify/icons-eva/shopping-bag-fill";
import fileTextFill from "@iconify/icons-eva/file-text-fill";

import lockFill from "@iconify/icons-eva/lock-fill";
import personAddFill from "@iconify/icons-eva/person-add-fill";
import alertTriangleFill from "@iconify/icons-eva/alert-triangle-fill";

import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";

import { project_name } from "src/config/config";
import { DayPlanIcons } from "src/assets";

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;
const getImageIcon = (name) => (
  <img className="navbar-icon" src={name} width={22} height={22} />
);
const sidebarConfig = [];
//  [
//   {
//     title: "dashboard",
//     path: "/dashboard",
//     icon: getIcon(pieChart2Fill),
//   },
//   {
//     title: "Programmes",
//     path: "/programmes",
//     icon: getIcon(barchartfill),
//   },
//   {
//     title: "Members",
//     path: "/member",
//     icon: getIcon(barchartfill),
//   },
//   // {
//   //   title: "Success Ambassador",
//   //   path: "/consultant",
//   //   icon: getIcon(barchartfill),
//   // },
//   // {
//   //   title: "Goal Statement",
//   //   path: "/goal-statement",
//   //   icon: getIcon(barchartfill),
//   // },
//   // {
//   //   title: "90 Day Questions",
//   //   path: "/90-day-questions",
//   //   icon: getIcon(barchartfill),
//   // },
//   // {
//   //   title: "the vault",
//   //   path: "/vault",
//   //   icon: getIcon(peopleFill),
//   // },
//   // {
//   //   title: "StudySession",
//   //   path: "/study-session",
//   //   icon: getIcon(barchartfill),
//   // },
//   //  {
//   //   title: "StudySession",
//   //   path: "/study-session",
//   //   icon: getIcon(barchartfill),
//   // },
//   // {
//   //   title: "StudySession",
//   //   path: "/study-session",
//   //   icon: getIcon(barchartfill),
//   // },
//   // {
//   //   title: "profile",
//   //   path: "/profile",
//   //   icon: getIcon(fileTextFill),
//   // },
//   // {
//   //   title: "profile",
//   //   path: "/profile",
//   //   icon: getIcon(fileTextFill),
//   // },
//   // {
//   //   title: "profile",
//   //   path: "/profile",
//   //   icon: getIcon(fileTextFill),
//   // },
//   // {
//   //   title: "profile",
//   //   path: "/profile",
//   //   icon: getIcon(fileTextFill),
//   // },
//   {
//     title: "profile",
//     path: "/profile",
//     icon: getIcon(fileTextFill),
//   },
//   {
//     title: "profile",
//     path: "/profile",
//     icon: getIcon(fileTextFill),
//   },
//   {
//     title: "profile",
//     path: "/profile",
//     icon: getIcon(fileTextFill),
//   },
//   {
//     title: "profile",
//     path: "/profile",
//     icon: getIcon(fileTextFill),
//   },
//   {
//     title: "profile",
//     path: "/profile",
//     icon: getIcon(fileTextFill),
//   },
//   {
//     title: "profile",
//     path: "/profile",
//     icon: getIcon(fileTextFill),
//   },
//   {
//     title: "profile",
//     path: "/profile",
//     icon: getIcon(fileTextFill),
//   },
//   {
//     title: "profile",
//     path: "/profile",
//     icon: getIcon(fileTextFill),
//   },

//   // {
//   //   title: "profile",
//   //   path: "/profile",
//   //   icon: getIcon(fileTextFill),
//   // },
//   // {
//   //   title: "manage Website",
//   //   path: "/profile",
//   //   icon: getIcon(fileTextFill),
//   // },
//   // {
//   //   title: "profile",
//   //   path: "/profile",
//   //   icon: getIcon(fileTextFill),
//   // },
//   // {
//   //   title: "pods",
//   //   path: "/pods",
//   //   icon: getIcon(shoppingBagFill),
//   // },
//   // {
//   //   title: "affirmations",
//   //   path: "/affirmations",
//   //   icon: getIcon(fileTextFill),
//   // },
//   // {
//   //   title: "gratitude",
//   //   path: "/gratitude",
//   //   icon: getIcon(lockFill),
//   // },
//   // {
//   //   title: "quotes",
//   //   path: "/quotes",
//   //   icon: getIcon(personAddFill),
//   // },
//   // {
//   //   title: "memories",
//   //   path: "/memories",
//   //   icon: getIcon(alertTriangleFill),
//   // },
//   // {
//   //   title: "daily activities",
//   //   path: "/daily_activities",
//   //   icon: getIcon(personAddFill),
//   // },
//   // {
//   //   title: "calender",
//   //   path: "/calender",
//   //   icon: getIcon(alertTriangleFill),
//   // },
//   // {
//   //   title: "support ticket",
//   //   path: "/support_ticket",
//   //   icon: getIcon(alertTriangleFill),
//   // },
// ];
sidebarConfig.push(
  {
    title: "dashboard",
    path: "/dashboard",
    icon: getIcon(pieChart2Fill),
  },
  {
    title: "Programmes",
    path: "/programmes",
    icon: getIcon(barchartfill),
  },
  {
    title: "Parents / Schools",
    path: "/all-member",
    icon: getIcon(barchartfill),
    children: [
      {
        title: "Active",
        path: "/member",

        icon: getIcon("mdi:account-online"),
        // icon: getIcon("ooui:user-active"),
      },
      {
        title: "Pending",
        path: "/pending-member",
        icon: getIcon("mdi:account-pending"),
      },
    ],
  },
  // {
  //   title: "Success Ambassador",
  //   path: "/consultant",
  //   icon: getIcon(barchartfill),
  // },
  {
    title: "Subscription List",
    path: "/subscription-list",
    icon: getIcon("wpf:renew-subscription"),
  },
  {
    title: "Community Area",
    path: "/community-area",
    icon: getIcon("fluent:people-community-16-filled"),
  }
);

sidebarConfig.push({
  title:"be-me-academy",
  path: "/list",

  icon: getIcon("ic:round-date-range"),
  children: [
    {
      title: "Recordings",
      path: "/recording-list",

      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Categories",
      path: "/categories",
      icon: getIcon("ic:round-date-range"),
    },
  ],
  /* "children" key can be added in these objects, example:children:[{...}] */
});

sidebarConfig.push({
  title: "Payments",
  path: "/list",

  icon: getIcon("ic:round-date-range"),
  children: [
    {
      title: "Stripe Products",
      path: "/stripe-products",

      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Transactions",
      path: "/payment-transactions",
      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Payment Templates",
      path: "/payment-templates",
      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Payment Requests",
      path: "/payment-requests",
      icon: getIcon("ic:round-date-range"),
    },
  ],
  /* "children" key can be added in these objects, example:children:[{...}] */
});

sidebarConfig.push({
  title: "Calendar",
  path: "/list",

  icon: getIcon("ic:round-date-range"),
  children: [
    {
      title: "Groups",
      path: "/calendar-groups",

      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Calendar Events",
      path: "/calendarEvents",
      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Meetings",
      path: "/meetings",
      icon: getIcon("ic:round-date-range"),
    },
  ],
  /* "children" key can be added in these objects, example:children:[{...}] */
});
sidebarConfig.push({
  title: "Growth Tools",
  path: "/list",

  icon: getIcon("fluent:people-team-toolbox-20-filled"),
  children: [
    {
      title: "Meditation Videos",
      path: "/meditation-videos",

      icon: getIcon("mdi:meditation"),
    },
    {
      title: "Affirmations",
      path: "/affirmation-list",

      icon: getIcon("healthicons:clean-hands-outline"),
    },
    {
      title: "Challenges",
      path: "/challenges",

      icon: getIcon("streamline:graph-bar-increase"),
    },
    {
      title: "Goal Settings",
      path: "/goal-settings",

      icon: getIcon(
        "streamline:travel-map-triangle-flag-navigation-map-maps-flag-gps-location-destination-goal"
      ),
    },
    {
      title: "Books",
      path: "/books",

      icon: getIcon("ion:book-outline"),
    },
  ],
  /* "children" key can be added in these objects, example:children:[{...}] */
});
// sidebarConfig.push({
//   title: "Growth Tools",
//   path: "/list",

//   icon: getIcon("fluent:people-team-toolbox-20-filled"),
//   children: [
//     {
//       title: "Meditation Videos",
//       path: "/meditation-videos",

//       icon: getIcon("mdi:meditation"),
//     },
//     {
//       title: "Affirmations",
//       path: "/affirmation-list",

//       icon: getIcon("healthicons:clean-hands-outline"),
//     },
//     {
//       title: "Challenges",
//       path: "/challenges",

//       icon: getIcon("streamline:graph-bar-increase"),
//     },
//     {
//       title: "Goal Settings",
//       path: "/goal-settings",

//       icon: getIcon(
//         "streamline:travel-map-triangle-flag-navigation-map-maps-flag-gps-location-destination-goal"
//       ),
//     },
//     {
//       title: "Books",
//       path: "/books",

//       icon: getIcon("ion:book-outline"),
//     },
//   ],
//   /* "children" key can be added in these objects, example:children:[{...}] */
// });
sidebarConfig.push({
  title: "Support",
  path: "/list",

  icon: getIcon("ic:round-date-range"),
  children: [
    {
      title: "Support Tickets",
      path: "/support-tickets",

      icon: getIcon("ic:round-date-range"),
    },
  ],
  /* "children" key can be added in these objects, example:children:[{...}] */
});
sidebarConfig.push(
  {
    title: "Client Portal",
    path: "/list",

    icon: getIcon("fluent:settings-20-filled"),
    children: [
      {
        title: "General Setting",
        path: "/general-setting",

        icon: getIcon("ic:round-date-range"),
      },
      {
        title: "Client Dashboard",
        path: "/client-dashboard",
        icon: getIcon("ic:round-date-range"),
      },
      {
        title: "Content Setting",
        path: "/content-setting",
        icon: getIcon("ic:round-date-range"),
      },

      {
        title: "BeeMe's Events",
        path: "/dynamite-events",
        icon: getIcon("ic:round-date-range"),
      },
    ],
    /* "children" key can be added in these objects, example:children:[{...}] */
  }
  // {
  //   title: "Consultants Setting",
  //   path: "/list",
  //   icon: getIcon("ic:round-date-range"),
  //   children: [
  //     {
  //       title: "Consultants Setting",
  //       path: "/consultants-general-setting",
  //       icon: getIcon("ic:round-date-range"),
  //     },
  //   ],
  // }
);
sidebarConfig.push({
  title: "General Setting",
  path: "/list",

  icon: getIcon("fluent:settings-20-filled"),
  children: [
    {
      title: "Admin Users",
      path: "admin-users",
      icon: getIcon("ic:round-manage-accounts"),
    },
    {
      title: "Default Setting",
      path: "default-setting",

      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Email Setting",
      path: "/email-setting",
      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Stripe Setting",
      path: "/stripe-setting",
      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Campaign Setting",
      path: "/campaign-setting",
      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Invoice Setting",
      path: "/invoice-setting",
      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Email Templates",
      path: "/email-templates",
      icon: getIcon("ic:round-date-range"),
    },
  ],
  /* "children" key can be added in these objects, example:children:[{...}] */
});
sidebarConfig.push({
  title: "Manage Website",
  path: "/list",

  icon: getIcon("fluent:settings-20-filled"),
  children: [
    {
      title: "Pages",
      path: "/website-pages",

      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Template Pages",
      path: "/template-pages",
      icon: getIcon("ic:round-date-range"),
    },
    {
      title: "Menus",
      path: "/menus",
      icon: getIcon("ic:round-date-range"),
    },
  ],
  /* "children" key can be added in these objects, example:children:[{...}] */
});
sidebarConfig.push({
  title: "Helping Videos",
  path: "/list",

  icon: getIcon("fluent:video-clip-20-filled"),
  children: [
    {
      title: "Admin Videos",
      path: "/admin-videos",

      icon: getIcon("ic:round-video-library"),
    },
    {
      title: "Client Portal Videos",
      path: "/client-portal-videos",
      icon: getIcon("ic:round-video-library"),
    },
  ],
  /* "children" key can be added in these objects, example:children:[{...}] */
});
export default sidebarConfig;
