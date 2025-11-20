import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import {
  NavLink as RouterLink,
  matchPath,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
// material
import { alpha, useTheme, styled } from "@mui/material/styles";
import InboxIcon from "@mui/icons-material/MoveToInbox";
// drop
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SettingsIcon from "@mui/icons-material/Settings";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { project_name } from "src/config/config";
// drop
import {
  Box,
  List,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  TextField,
} from "@mui/material";
import { get_root_value } from "src/utils/domUtils";
import { fontSize } from "@mui/system";
import { set } from "lodash";

// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  color: "black",
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: "#9F00FF",
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func,
};

function NavItem({ item, active, openDra }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: "#9F00FF",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha("#9F00FF", theme.palette.action.selectedOpacity),
    "&:before": { display: "block" },
  };

  const activeSubStyle = {
    color: "#9F00FF",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha("#9F00FF", theme.palette.action.selectedOpacity),
  };
  useEffect(() => {
    setOpen(openDra);
  }, [openDra]);
  useEffect(() => {
    // On reload dropdown should not close
    if (item?.children)
      item?.children.map((child_option) => {
        if (window.location.pathname.includes(child_option?.path)) {
          setOpen(true);
        }
      });
  }, [window.location.pathname, !openDra]);
  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle),
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText
            disableTypography
            className="fix-weight"
            primary={title}
          />
          {info && info}
          <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => {
              const { title, path, icon } = item;
              const isActiveSub = active(path);
              return (
                <ListItemStyle
                  key={title}
                  component={RouterLink}
                  to={path}
                  sx={{
                    ...(isActiveSub && activeSubStyle),

                    pl: 8,
                    // color: "black",
                    fontSize: "14px",
                  }}
                >
                  <ListItemIconStyle>{icon}</ListItemIconStyle>
                  <ListItemText
                    disableTypography
                    className="fix-weight"
                    primary={title}
                  />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle),
      }}
    >
      <ListItemIconStyle
        sx={{
          ...(isActiveRoot && activeRootStyle),
        }}
      >
        {icon && icon}
      </ListItemIconStyle>
      <ListItemText disableTypography className="fix-weight" primary={title} />
      {info && info}
    </ListItemStyle>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array,
};

export default function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openSession, setOpenSession] = useState(false);
  const [openExtras, setOpenExtras] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  const [openConsultant, setOpenConsultant] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [openWebsiteSetting, setOpenWebsiteSetting] = useState(false);
  const [openHelpingVideos, setOpenHelpingVideos] = useState(false);
  const [openCommunity, setOpenCommunity] = useState(false);

  const handleClick = () => {
    setOpenDropdown(!openDropdown);
  };
  const handleClickSession = () => {
    setOpenSession(!openSession);
  };
  const handleClickExtras = () => {
    setOpenExtras(!openExtras);
  };
  const handleClickPayment = () => {
    setOpenPayment(!openPayment);
  };
  const handleClickCalendar = () => {
    setOpenCalendar(!openCalendar);
  };
  const handleClickSupport = () => {
    setOpenSupport(!openSupport);
  };
  const handleClickClient = () => {
    setOpenClient(!openClient);
  };
  const handleClickConsultant = () => {
    setOpenConsultant(!openConsultant);
  };
  const handleClickSetting = () => {
    setOpenSetting(!openSetting);
  };
  const handleClickWebsiteSetting = () => {
    setOpenWebsiteSetting(!openWebsiteSetting);
  };
  const handleClickHelpingVideos = () => {
    setOpenHelpingVideos(!openHelpingVideos);
  };

  const handleNavigateRecordings = () => {
    navigate("/recording-list");
  };
  const handleNavigateCategory = () => {
    navigate("/categories");
  };
  const handleNavigateSessions = () => {
    navigate("/sessions");
  };
  const handleNavigateSessionsRecording = () => {
    navigate("/session-recording");
  };
  const handleNavigateQuotes = () => {
    navigate("/quotesList");
  };
  const handleNavigateGratitude = () => {
    navigate("/gratitude");
  };
  const handleNavigateAffirmation = () => {
    navigate("/affirmation");
  };
  const handleNavigateAffirmationCategories = () => {
    navigate("/affirmations-categories");
  };
  const handleNavigateTransaction = () => {
    navigate("/payment-transactions");
  };
  const handleNavigateStripeProducts = () => {
    navigate("/stripe-products");
  };
  const handleNavigatePaymentTemplate = () => {
    navigate("/payment-templates");
  };
  const handleNavigatePaymentRequest = () => {
    navigate("/payment-requests");
  };
  const handleNavigateCalendarGroups = () => {
    navigate("/calendar-groups");
  };
  const handleNavigateCalendarPods = () => {
    navigate("/meetings");
  };
  const handleNavigateCalendar = () => {
    navigate("/calendarEvents");
  };
  const handleNavigateDepartment = () => {
    navigate("/departments");
  };
  const handleNavigateSupportTicket = () => {
    navigate("/support-tickets");
  };
  const handleNavigateGeneralSetting = () => {
    navigate("/general-setting");
  };
  const handleNavigateClientDashboard = () => {
    navigate("/client-dashboard");
  };
  const handleNavigateContentSetting = () => {
    navigate("/content-setting");
  };

  const handleNavigateEvents = () => {
    navigate("/website-events");
  };
  const handleNavigateDynamiteEvents = () => {
    navigate("/dynamite-events");
  };
  const handleNavigateDynamiteEventsCategory = () => {
    navigate("/dynamite-event-categories");
  };
  const handleNavigateDynamiteEventCategoryVideo = () => {
    navigate("/dynamite-event-category-videos");
  };
  const handleNavigateConsultantGeneralSetting = () => {
    navigate("/consultants-general-setting");
  };
  const handleNavigateSendGrid = () => {
    navigate("/send-grid");
  };
  const handleNavigateCompaign = () => {
    navigate("/campaign-setting");
  };
  const handleNavigateInvoice = () => {
    navigate("/invoice-setting");
  };
  const handleNavigateStripe = () => {
    navigate("/stripe-setting");
  };
  const handleNavigateEmailSetting = () => {
    navigate("/email-setting");
  };
  const handleNavigateDefaultSetting = () => {
    navigate("/default-setting");
  };
  const handleNavigateEmailTemplates = () => {
    navigate("/email-templates");
  };
  const handleNavigateWebsitePages = () => {
    navigate("/website-pages");
  };
  const handleNavigateAdminVideos = () => {
    navigate("/admin-videos");
  };
  const handleNavigateClientVideos = () => {
    navigate("/client-portal-videos");
  };
  const handleNavigateWebsiteEvents = () => {
    navigate("/template-pages");
  };
  const handleNavigateWebsiteTestimonial = () => {
    navigate("/menus");
  };
  const handleNavigateWebsitePodCast = () => {
    navigate("/website-podcasts");
  };
  const handleNavigateWebsiteProgrammes = () => {
    navigate("/website-programmes");
  };
  const handleNavigateGeneralPaymentPlan = () => {
    navigate("/website-general-payment-plans");
  };

  const handleNavigateProgrammeCategories = () => {
    navigate("/website-categories");
  };
  const handleNavigateFAQ = () => {
    navigate("/website-faq");
  };
  const handleNavigateTeam = () => {
    navigate("/website-team");
  };
  const handleNavigateMedia = () => {
    navigate("/media-section");
  };
  const handleNavigateSuccessProduct = () => {
    navigate("/success-product");
  };
  const handleNavigatePodcasts = () => {
    navigate("/website-podcasts");
  };

  const matchSideBar = (path) =>
    path ? !!matchPath({ path, end: false }, pathname) : false;

  const match = ({ path, matches }) => {
    if (matches) {
      let is_active = false;
      matches.forEach((match_path) => {
        const match = match_path
          ? !!matchPath({ path: match_path, end: false }, pathname)
          : false;

        if (match) {
          is_active = true;
        }
      });

      return is_active;
    }
    return path ? !!matchPath({ path, end: false }, pathname) : false;
  };

  // =============good one is that but if thay ask then i show that because it will just mached chid not all childes

  const findItemsByQuery = (query) => {
    const matchingItems = navConfig
      .map((item) => {
        const matchedChildren = item?.children
          ? item?.children.filter((child) =>
              child.title.toLowerCase().includes(query.toLowerCase())
            )
          : "";
        if (
          item?.title.toLowerCase().includes(query.toLowerCase()) ||
          matchedChildren.length > 0
        ) {
          return {
            ...item,
            children: matchedChildren,
          };
        }
        return null;
      })
      .filter(Boolean);

    return matchingItems;
  };

  // =======
  // const findItemsByQuery = (query) => {
  //   const matchingItems = navConfig.filter(
  //     (item) =>
  //       item.title.toLowerCase().includes(query.toLowerCase()) ||
  //       (item.children &&
  //         item.children.some((child) =>
  //           child.title.toLowerCase().includes(query.toLowerCase())
  //         ))
  //   );
  //   return matchingItems;
  // };

  const [query, setQuery] = useState("");
  const matchingItems = findItemsByQuery(query);
  console.log("Matching items:", matchingItems, navConfig);

  return (
    <Box {...other}>
      <div className="text-center">
        <TextField
          size="small"
          id="outlined-basic"
          label=""
          variant="outlined"
          autoComplete="off"
          sx={{
            width: "85%",

            "& legend": { display: "none" },
            "& fieldset": { top: 0 },

            mb: 1,
          }}
          // fullWidth
          required
          name="question_statement"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>
      <List
        disablePadding
        // sx={{ p: 1, pt: 0.4 }}
        sx={{ mb: 6 }}
      >
        {matchingItems.map((item) => (
          // console.log(item, "djfadlka"),
          <NavItem
            key={item.title}
            item={item}
            active={matchSideBar}
            openDra={query ? true : false}
          />
        ))}
      </List>
    </Box>
  );
}
const calltme = () => {
  <List disablePadding>
    {navConfig.map((item, i) => {
      if (i === 3) {
        return (
          <List
            key={i}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              sx={{ pl: 5, fontSize: "5px" }}
              onClick={handleClick}
            >
              <ListItemIcon>
                <DateRangeIcon
                  sx={{
                    fill: "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
            
              {openDropdown ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openDropdown} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateRecordings}
                  className={
                    match({ path: "/recording-list" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/recording-list" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Recordings"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateCategory}
                  className={match({ path: "/categories" }) ? "menuActive" : ""}
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/email-templates" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Categories"
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        );
      } else if (i === 4) {
        return (
          <List
            key={i}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              component="a"
              sx={{ pl: 5, fontSize: "14px" }}
              onClick={handleClickPayment}
            >
              <ListItemIcon>
                <DateRangeIcon
                  sx={{
                    fill: "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: "black",
                }}
                primary="Payments"
              />
              {openPayment ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openPayment} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateStripeProducts}
                  className={
                    match({ path: "/stripe-products" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/stripe-products" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Stripe Products"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateTransaction}
                  className={
                    match({ path: "/payment-transactions" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/payment-transactions" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Transactions"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigatePaymentTemplate}
                  className={
                    match({ path: "/payment-templates" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/payment-template" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Payment Templates"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigatePaymentRequest}
                  className={
                    match({ path: "/payment-requests" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/payment-request" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Payment Requests"
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        );
      } else if (i === 5) {
        return (
          <List
            key={i}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              component="a"
              sx={{ pl: 5, fontSize: "14px" }}
              onClick={handleClickCalendar}
            >
              <ListItemIcon>
                <DateRangeIcon
                  sx={{
                    fill: "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: "black",
                }}
                primary="Calendar"
              />
              {openCalendar ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCalendar} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateCalendarGroups}
                  className={
                    match({ path: "/calendar-groups" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/calendar-groups" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Groups"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateCalendar}
                  className={
                    match({ path: "/calendarEvents" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/calendarEvents" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Calendar Events"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateCalendarPods}
                  className={match({ path: "/meetings" }) ? "menuActive" : ""}
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/meetings" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Meetings"
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        );
      } else if (i === 6) {
        return (
          <List
            key={i}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              component="a"
              sx={{ pl: 5, fontSize: "14px" }}
              onClick={handleClickSupport}
            >
              <ListItemIcon>
                <DateRangeIcon
                  sx={{
                    fill: "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: "black",
                }}
                primary="Support"
              />
              {openSupport ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openSupport} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {/* <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateDepartment}
                      className={
                        match({ path: "/departments" }) ? "menuActive" : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon
                          sx={{
                            fill: match({ path: "/departments" })
                              ? get_root_value("--portal-theme-primary")
                              : "",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="Departments"
                      />
                    </ListItemButton> */}
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateSupportTicket}
                  className={
                    match({ path: "/support-tickets" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/support-tickets" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Support Tickets"
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        );
      } else if (i === 111) {
        return (
          <List
            key={i}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              component="a"
              sx={{ pl: 5, fontSize: "14px" }}
              onClick={handleClickCommunity}
            >
              <ListItemIcon>
                <DateRangeIcon
                  sx={{
                    fill: match({ path: "/email-templates" })
                      ? get_root_value("--portal-theme-primary")
                      : "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: "black",
                }}
                primary="Community"
              />
              {openCommunity ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCommunity} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateCommunity}
                  className={match({ path: "/community" }) ? "menuActive" : ""}
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/community" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Community Reward"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateSeriesCategories}
                  className={
                    match({ path: "/series-categories" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/email-templates" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Series Categories"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateSeriesVideos}
                  className={
                    match({ path: "/series-videos" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/series-videos" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Series Videos"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateFeeds}
                  className={match({ path: "/feeds" }) ? "menuActive" : ""}
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/feeds" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Feeds"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateFeedsSetting}
                  className={
                    match({ path: "/feed/setting" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/feed/setting" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Feed Setting"
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        );
      } else if (i === 7) {
        return (
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              component="a"
              sx={{ pl: 5, fontSize: "14px" }}
              onClick={handleClickClient}
            >
              <ListItemIcon>
                <SettingsIcon
                  sx={{
                    fill: "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: "black",
                }}
                primary="Client Portal"
              />
              {openClient ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openClient} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateGeneralSetting}
                  className={
                    match({ path: "/general-setting" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/general-setting" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="General Setting"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateClientDashboard}
                  className={
                    match({ path: "/client-dashboard" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/client-dashboard" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Client Dashboard"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateContentSetting}
                  className={
                    match({ path: "/content-setting" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/content-setting" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Content Setting"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateDynamiteEvents}
                  className={
                    match({ path: "/dynamite-events" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/dynamite-events" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="BeeMe's Events"
                  />
                </ListItemButton>
               
              </List>
            </Collapse>
          </List>
        );
      } else if (i === 8) {
        return (
          <List
            key={i}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              component="a"
              sx={{ pl: 5, fontSize: "14px" }}
              onClick={handleClickSetting}
            >
              <ListItemIcon>
                <SettingsIcon
                  sx={{
                    fill: "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: "black",
                }}
                primary="General Setting"
              />
              {openSetting ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openSetting} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateDefaultSetting}
                  className={
                    match({ path: "/default-setting" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/default-setting" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Default Setting"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateEmailSetting}
                  className={
                    match({ path: "/email-setting" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/email-setting" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Email Setting"
                  />
                </ListItemButton>{" "}
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateStripe}
                  className={
                    match({ path: "/stripe-setting" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/stripe-setting" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Stripe Setting"
                  />
                </ListItemButton>{" "}
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateCompaign}
                  className={
                    match({ path: "/campaign-setting" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/campaign-setting" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Campaign Setting"
                  />
                </ListItemButton>{" "}
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateInvoice}
                  className={
                    match({ path: "/invoice-setting" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/invoice-setting" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Invoice Setting"
                  />
                </ListItemButton>
                {/* <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateSendGrid}
                      className={
                        match({ path: "/send-grid" }) ? "menuActive" : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText
                           primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                        primary="SendGrid Setting"
                      />
                    </ListItemButton> */}
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateEmailTemplates}
                  className={
                    match({ path: "/email-templates" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/email-templates" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                    }}
                    primary="Email Templates"
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        );
      } else if (i === 9) {
        return (
          <List
            key={i}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              component="a"
              sx={{ pl: 5, fontSize: "14px" }}
              onClick={handleClickWebsiteSetting}
            >
              <ListItemIcon>
                <SettingsIcon
                  sx={{
                    fill: "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: "black",
                }}
                primary="Manage Website"
              />
              {openWebsiteSetting ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openWebsiteSetting} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateWebsitePages}
                  className={
                    match({ path: "/website-pages" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/website-pages" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Pages"
                  />
                </ListItemButton>

                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateWebsiteEvents}
                  className={
                    match({ path: "/template-pages" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/template-pages" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Template Pages"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateWebsiteTestimonial}
                  className={match({ path: "/menus" }) ? "menuActive" : ""}
                >
                  <ListItemIcon>
                    <DateRangeIcon
                      sx={{
                        fill: match({ path: "/menus" })
                          ? get_root_value("--portal-theme-primary")
                          : "rgba(55, 141, 212, 1)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Menus"
                  />
                </ListItemButton>
                {/* <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                     
                      className={
                        match({ path: "/website-testimonials" })
                          ? "menuActive"
                          : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon
                          sx={{
                            fill: match({ path: "/website-testimonials" })
                              ? get_root_value("--portal-theme-primary")
                              : "",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="Testimonials"
                      />
                    </ListItemButton> */}

                {/* <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateGeneralPaymentPlan}
                      className={
                        match({ path: "/website-general-payment-plans" })
                          ? "menuActive"
                          : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon
                          sx={{
                            fill: match({
                              path: "/website-general-payment-plans",
                            })
                              ? get_root_value("--portal-theme-primary")
                              : "",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="Payment Plans"
                      />
                    </ListItemButton> */}
                {/* <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateGeneralPaymentPlan}
                      className={
                        match({ path: "/website-general-payment-plans" })
                          ? "menuActive"
                          : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText
                           primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                        primary="Payment Plans"
                      />
                    </ListItemButton> */}
                {/* <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateWebsiteProgrammes}
                      className={
                        match({ path: "/website-programmes" })
                          ? "menuActive"
                          : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon
                          sx={{
                            fill: match({
                              path: "/website-programmes",
                            })
                              ? get_root_value("--portal-theme-primary")
                              : "",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="Website Programmes"
                      />
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateProgrammeCategories}
                      className={
                        match({ path: "/website-categories" })
                          ? "menuActive"
                          : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon
                          sx={{
                            fill: match({
                              path: "/website-categories",
                            })
                              ? get_root_value("--portal-theme-primary")
                              : "",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="Programme Categories"
                      />
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateFAQ}
                      className={
                        match({ path: "/website-faq" }) ? "menuActive" : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon
                          sx={{
                            fill: match({
                              path: "/website-faq",
                            })
                              ? get_root_value("--portal-theme-primary")
                              : "",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="FAQ"
                      />
                    </ListItemButton> */}
                {/* <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateTeam}
                      className={
                        match({ path: "/website-team" }) ? "menuActive" : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText
                           primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                        primary="Team"
                      />
                    </ListItemButton> */}
                {/* <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigatePodcasts}
                      className={
                        match({ path: "/website-podcasts" }) ? "menuActive" : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="Website Podcasts"
                      />
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateMedia}
                      className={
                        match({ path: "/media-section" }) ? "menuActive" : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="Media Section"
                      />
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        pl: 8,
                        color: "black",
                        fontSize: "10px",
                      }}
                      onClick={handleNavigateSuccessProduct}
                      className={
                        match({ path: "/success-product" }) ? "menuActive" : ""
                      }
                    >
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "black",
                        }}
                        primary="Success Product"
                      />
                    </ListItemButton> */}
              </List>
            </Collapse>
          </List>
        );
      } else if (i === 10) {
        return (
          <List
            key={i}
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              component="a"
              sx={{ pl: 5, fontSize: "14px" }}
              onClick={handleClickHelpingVideos}
            >
              <ListItemIcon>
                <SmartDisplayIcon
                  sx={{
                    fill: "rgba(55, 141, 212, 1)",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: "black",
                }}
                primary="Helping Videos"
              />
              {openHelpingVideos ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openHelpingVideos} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateAdminVideos}
                  className={
                    match({ path: "/admin-videos" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <VideoLibraryIcon
                      sx={{
                        fill: match({ path: "/admin-videos" })
                          ? get_root_value("--portal-theme-primary")
                          : "",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Admin Videos"
                  />
                </ListItemButton>

                <ListItemButton
                  sx={{
                    pl: 8,
                    color: "black",
                    fontSize: "10px",
                  }}
                  onClick={handleNavigateClientVideos}
                  className={
                    match({ path: "/client-portal-videos" }) ? "menuActive" : ""
                  }
                >
                  <ListItemIcon>
                    <VideoLibraryIcon
                      sx={{
                        fill: match({ path: "/client-portal-videos" })
                          ? get_root_value("--portal-theme-primary")
                          : "",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "14px",
                      color: "black",
                    }}
                    primary="Client Portal Videos"
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        );
      }
      return (
        <NavItem
          key={item.title}
          item={item}
          active={matchSideBar}
          openDra={true}
        />
      );
    })}
  </List>;
};
