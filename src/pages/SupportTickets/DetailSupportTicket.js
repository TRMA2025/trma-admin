import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CircularProgress, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { s3baseUrl } from "src/config/config";
import ChatCard from "./ChatCard";
// import ModelBox from "src/components/ModalBox/ImageModalBox";
import {
  csvImage,
  docImage,
  pdfImage,
  wordImage,
  audioImage,
  xlsxImage,
  otherImage,
  dummyImage,
} from "src/assets";
const imageLinks = {
  docx: wordImage,
  mp3: audioImage,
  pdf: pdfImage,
  csv: csvImage,
  doc: docImage,
  xlsx: xlsxImage,
  xls: xlsxImage,
  other: otherImage,
};
// import {
//   markResolved,
//   SupportTicketDetailApi,
// } from "src/DAL/SupportTicket/SupportTicket";
import { htmlDecode } from "src/utils/convertHtml";
import {
  resolve,
  supportTicketDetailApi,
} from "src/DAL/supportTicket/supportTicket";
import ImageModelBox from "src/components/ModelBox/ImageModelBox";
import { memberDetailApi } from "src/DAL/member/member";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import ActiveLastBreadcrumb from "src/components/ActivePaths";
// import CustomConfirmation from "src/components/menuIcons/CustomConfirmation";
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function SupportTicketDetail(props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const params = useParams();
  const data = useLocation();
  const [supportTicketData, setSupportTicketData] = useState([]);
  const [supportTicketteamInfo, setsupportTicketteamInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openResolved, setOpenResolved] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [memberId, setMemberId] = useState("");
  const [memberData, setMemberData] = useState();
  const handleOpen = (image_path) => {
    console.log(image_path, "image_path");
    setImageUrl(image_path);
    setOpen(true);
  };
  let breadCrumbMenu = [
    {
      title: "Support Tickets",
      navigation: `/support-tickets`,
      active: false,
    },

    {
      title: supportTicketData.subject,
      navigation: null,
      active: true,
    },
  ];
  const handleClose = () => setOpen(false);
  const getSupportTicketDetail = async () => {
    const result = await supportTicketDetailApi(params.id);
    if (result.code === 200) {
      console.log(result, "resultresultresultresultresultresult");
      setSupportTicketData(result.support_ticket);
      setsupportTicketteamInfo(result.support_team_info);
      setMemberId(result.support_ticket.member);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };
  const handleMarkResolved = async () => {
    setIsLoading(true);
    const data = {
      support_ticket: params.id,
    };
    const result = await resolve(data);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
      setOpenResolved(false);
      navigate(`/support-tickets`);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const memberDetail = async () => {
    // setIsLoading(true);
    const result = await memberDetailApi(memberId);
    if (result.code === 200) {
      setMemberData(result.member);
      setIsLoading(false);
    }
  };
  console.log(memberData, "memberDatamemberData");
  const handleMarkResolvedPopup = (value) => {
    setOpenResolved(true);
  };

  const getCommentImage = (file) => {
    console.log(file, "filefilefilefile");
    const ext = file.thumbnail_1.split(".").pop();
    if (
      ext == "jpg" ||
      ext == "JPG" ||
      ext == "png" ||
      ext == "webp" ||
      ext == "jpeg" ||
      ext == "JPEG" ||
      ext == "PNG"
    ) {
      console.log(ext, "extextextextextext");
      return s3baseUrl + file.thumbnail_2;
    } else if (imageLinks[ext]) {
      console.log("imageLinksimageLinks");
      return imageLinks[ext];
    } else {
      console.log("otherotherotherotherother");
      return imageLinks.other;
    }
  };
  console.log(supportTicketteamInfo, "supportTicketteamInfo");
  useEffect(() => {
    getSupportTicketDetail();
  }, []);
  useEffect(() => {
    memberDetail(memberId);
  }, [memberId]);
  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  console.log(supportTicketData, "supportTicketData.comment");
  return (
    <div className="container">
      <div className="row mobile-margin display-flex">
        <div className="col-12">
          {/* <IconButton
            className="back-screen-button"
            onClick={() => navigate("/support-tickets")}
          >
<ArrowBackIcon
              className="arrow-back-icon"
              style={{ color: "#fff !important", fill: "#fff !important" }}
            />          </IconButton> */}
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />

          <span className="ms-4">
            {memberData?.first_name &&
              memberData?.first_name +
                " " +
                memberData?.last_name +
                " (" +
                memberData?.email +
                ")"}
          </span>

          {/* {supportTicketData.ticket_status === 1 ||
          supportTicketData.ticket_status === 2 ? (
            <button
              className="small-contained-button float-end mt-1 disabled"
              disabled="disabled"
            >
              Resolved
            </button>
          ) : (
            <button
              className="small-contained-button float-end mt-1 disabled"
              onClick={handleMarkResolvedPopup}
            >
              Mark Resolve
            </button>
          )} */}
        </div>
      </div>
      <div className="row section-space">
        <div className="col-sm-12">
          <h1 style={{ display: "contents" }}>
            {htmlDecode(supportTicketData.subject)}
          </h1>
          {supportTicketData.ticket_status === 1 ||
          supportTicketData.ticket_status === 2 ? (
            <button
              className="small-contained-button float-end mt-1 disabled"
              disabled="disabled"
            >
              Resolved
            </button>
          ) : (
            <button
              className="small-contained-button float-end mt-1 "
              onClick={handleMarkResolvedPopup}
            >
              Mark Resolve
            </button>
          )}
        </div>
      </div>

      <div className="row media-margin">
        <div className="col-12">
          <p>{htmlDecode(supportTicketData.description)}</p>
        </div>
        <div className="col-sm-12 my-2">
          {supportTicketData.ticket_images &&
            supportTicketData.ticket_images.map((image, i) => {
              const ext = image.thumbnail_1.split(".").pop();
              if (
                ext == "jpg" ||
                ext == "JPG" ||
                ext == "png" ||
                ext == "webp" ||
                ext == "jpeg" ||
                ext == "JPEG" ||
                ext == "PNG"
              ) {
                return (
                  <span className="preview ticket_image_preview" key={i}>
                    <img
                      onClick={() => {
                        handleOpen(s3baseUrl + image.thumbnail_1);
                      }}
                      className="p-0"
                      src={
                        image?.thumbnail_2 === undefined ||
                        image?.thumbnail_2 === ""
                          ? dummyImage
                          : s3baseUrl + image.thumbnail_2
                      }
                    />
                  </span>
                );
              } else {
                return (
                  <span className="preview ticket_image_preview" key={i}>
                    <a
                      href={s3baseUrl + image.thumbnail_1}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={getCommentImage(image)} />
                    </a>
                  </span>
                );
              }
            })}
        </div>
        <ChatCard
          comments={supportTicketData.comment}
          ticket_id={supportTicketData._id}
          list_data={getSupportTicketDetail}
          supportTicketData={supportTicketData}
          memberName={memberData?.first_name}
          support_ticket_team_info={supportTicketteamInfo}
          memberEmail={memberData?.email}
        />
        <ImageModelBox
          open={open}
          handleClose={handleClose}
          image_url={imageUrl}
        />
        <CustomConfirmation
          open={openResolved}
          setOpen={setOpenResolved}
          title={"Are you sure you want to mark this ticket as resolved?"}
          handleAgree={handleMarkResolved}
        />
      </div>
    </div>
  );
}
