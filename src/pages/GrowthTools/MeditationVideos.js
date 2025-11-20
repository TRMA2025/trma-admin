import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { admin_videos_listing } from "src/DAL/HelpingVideos/AdminHelpingVideos";
import { s3baseUrl } from "src/config/config";
import { htmlDecode } from "src/utils/convertHtml";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import CustomPopoverSection from "src/components/MenuOption/CustomPopoverSection";
import CustomConfirmation from "src/components/ModalPopover/Confirmation";
import {
  delete_meditation,
  list_meditation,
} from "src/DAL/GrowthTools/GrowthTools";
import RecordNotFound from "src/components/RecordNotFound";
import Skeleton from "react-loading-skeleton";

// ----------------------------------------------------------------------
const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));
export default function MeditationVideos() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [meditationVideos, setMeditationVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const MeditationList = async () => {
    const result = await list_meditation();
    if (result.code == 200) {
      setIsLoading(false);
      setMeditationVideos(result.meditations);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleNavigateDetail = (value) => {
    navigate(`/meditation-videos-detail/${value._id}`, {
      state: value,
    });
  };
  const handleEdit = (value) => {
    navigate(`/meditation-videos-edit/${value._id}`, {
      state: value,
    });
    console.log(value, "edit====");
  };
  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };
  const handleDelete = async () => {
    setOpenDelete(false);
    setIsLoading(true);
    const result = await delete_meditation(deleteDoc._id);
    if (result.code === 200) {
      MeditationList();
      setIsLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };
  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];
  useEffect(() => {
    MeditationList();
  }, []);
  // if (isLoading) {
  //   return (
  //     <div className="container mt-2">
  //       <div className="row">
  //         {Array.from({ length: 5 }).map((_, index) => (
  //           <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
  //             <div className="card mt-1 pods-cards-shadow cursor h-100">
  //               <Skeleton
  //                 height={200}
  //                 className="card-img-top pods-image"
  //                 baseColor="#dddde8"
  //                 highlightColor="#ffffff"
  //               />
  //               <div className="card-body">
  //                 <Skeleton
  //                   height={30}
  //                   width="80%"
  //                   style={{ marginBottom: 10 }}
  //                   className="h2-heading"
  //                   baseColor="#dddde8"
  //                   highlightColor="#9F00FF"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <>
      <CustomConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete ?"}
        handleAgree={handleDelete}
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-7 col-sm-12">
            <h2>Meditation Videos </h2>
          </div>
          <div className="col-lg-5 col-sm-12 text-end">
            <button
              onClick={() => navigate(`/meditation-videos-add`)}
              className="small-contained-button"
            >
              Add Meditation Videos
            </button>
          </div>
          {isLoading && (
            <div className="container mt-2">
              <div className="row">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
                    <div className="card mt-1 pods-cards-shadow cursor h-100">
                      <Skeleton
                        height={200}
                        className="card-img-top pods-image"
                        baseColor="#dddde8"
                        highlightColor="#ffffff"
                      />
                      <div className="card-body">
                        <Skeleton
                          height={30}
                          width="80%"
                          style={{ marginBottom: 10 }}
                          className="h2-heading"
                          baseColor="#dddde8"
                          highlightColor="#9F00FF"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {meditationVideos.length == 0 ? (
            <RecordNotFound title="Meditation Videos" />
          ) : (
            meditationVideos.map((value, index) => {
              return (
                <div className="col-lg-4 col-md-4 col-sm-12 mb-4" key={index}>
                  <div className="card mt-4 pods-cards-shadow cursor h-100 meditation">
                    <img
                      src={s3baseUrl + value.image?.thumbnail_1}
                      className="card-img-top pods-image"
                      alt=""
                      onClick={() => handleNavigateDetail(value)}
                    />

                    <div className="card-body d-flex flex-column pb-0">
                      <div className="flex-grow-1"></div>

                      <div className="row meditation-card">
                        <div className="col-10">
                          <h3
                            className="h2-heading meditaion-title"
                            onClick={() => handleNavigateDetail(value)}
                          >
                            {htmlDecode(value.title)}
                          </h3>
                        </div>
                        <div className="col-2 mt-2 d-flex justify-content-end">
                          <CustomPopoverSection
                            menu={MENU_OPTIONS}
                            data={value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
