import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import {
  ForgetPassword,
  Programmes,
  ProgrammesDetail,
  GoalStatement,
  Vault,
  Profile,
  Pods,
  Affirmations,
  Gratitude,
  Quotes,
  Memories,
  MemoriesDetails,
  DailyActivities,
  Calender,
  LessonsDetail,
  LessonListing,
  ProgrammRecordingDetail,
  AffirmationList,
  ClientVideos,
  AdminVideos,
  AddAdminVideos,
  AdminVideoDetail,
  AddClientVideos,
  ClientVideoDetail,
  EditAdminVideos,
  EditClientVideos,
} from "./pages/index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardApp from "./pages/DashboardApp";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import User from "./pages/User";
import NotFound from "./pages/Page404";
import AddGratitude from "./pages/Gratitude/AddGratitude";
import AddProgramme from "./pages/Programmes/AddProgramme";
import EditProgramme from "./pages/Programmes/EditProgramme";
import AddLesson from "./pages/Programmes/AddLesson";
import EditLesson from "./pages/Programmes/EditLesson";
import LessonRecordingListing from "./pages/LessonRecording/LessonRecordingListing";
import LessonRecordingDetail from "./pages/LessonRecording/LessonRecordingDetail";
import AddLessonRecording from "./pages/LessonRecording/AddLessonRecording";
import EditLessonRecording from "./pages/LessonRecording/EditLessonRecording";
import { ResourcesCard } from "./pages/LessonRecording/ResourcesCard";
import AddLessonDocument, {
  AddLessonDecoument,
} from "./pages/LessonRecording/AddLessonDocument";
import EditLessonDocument from "./pages/LessonRecording/EditLessonDocument";
import { ProgrammeDocumentList } from "./pages/Programmes/ProgrammeDocumentList";
import AddProgrammeDocument from "./pages/Programmes/AddProgramDocument";
import EditProgrammeDocument from "./pages/Programmes/EditProgrammeDocument";
import { SectionList } from "./pages/section/SectionList";
import ProgrammeReviews from "./pages/ProgramReviews/ProgrammeReviews";
import AddProgrammeReview from "./pages/ProgramReviews/AddProgramReview";
import EditProgrammeReview from "./pages/ProgramReviews/EditProgramReview";
import ProgrammeSectionList from "./pages/Sections/SectionList";
import LockedProgram from "./pages/Programmes/LockedProgramInfo";
import AddProgrammeSection from "./pages/Sections/AddProgrammeSection";
import EditProgrammeSection from "./pages/Sections/EditProgrammeSection";
import ProgrammeAutomatedGroups from "./pages/AutomatedGroups/ProgrammeAutomatedGroup";
import AddProgrammeAutoGroup from "./pages/AutomatedGroups/AddAutoGroup";
import EditProgrammeAutoGroup from "./pages/AutomatedGroups/EditAutoGroup";
import MembersList from "./pages/Members/MembersList";
import AddMember from "./pages/Members/AddMember";
import EditMember from "./pages/Members/EditMember";
import ConsultantList from "./pages/consultant/consultantList";
import AddConsultant from "./pages/consultant/AddConsultant";
import EditConsultant from "./pages/consultant/EditConsultant";
import ChangePassword from "./pages/Members/ChangePassword";
import ChangeConsultantPassword from "./pages/consultant/Changepassword";
import ConsultantRecordings from "./pages/consultant/ConsultantRecordings";
import ConsultantRecordingDetail from "./pages/consultant/RecordingDetail";
import MemberProfile from "./pages/Members/MemberProfile";
import MemberAllTransaction from "./pages/Members/AllTransactions";
import ViewBillingList from "./pages/Members/ViewBilling";
import BillingRequestDetail from "./pages/Members/BillingDetail";
import AddPaymentRequest from "./pages/Members/AddPaymentRequest";
import ManageProgrammeAccess from "./pages/Members/ManageProgrammeAccess";
import ConsultantGroupsList from "./pages/consultant/ConsultantGroups";
import ConsultantGroupDetail from "./pages/consultant/ConsultantGroupDetail";
import ConsultantPodsList from "./pages/consultant/PodsListing";
import MembersListConsultant from "./pages/consultant/MemberList";
import ConsultantGoalStatementList from "./pages/consultant/ConsultantGoalStatement";
import ConsultantPodsDetail from "./pages/consultant/PodsDetail";
import MemberGroupsList from "./pages/Members/MembersGroupList";
import MemberPersonalNote from "./pages/Members/MemberPersonalNote";
import MemberGoalstatementList from "./pages/Members/MemberGoalstatementList";
import PodsListMemberProfile from "./pages/Members/PodsListMemberProfile";
import ConsultantGoalstatementDetail from "./pages/consultant/ConsultantGoalstatementDetail";
import AddQuestions from "./pages/GoalStatement/AddQuestion";
import DetailQuestion from "./pages/GoalStatement/DetailQuestion";
import EditQuestions from "./pages/GoalStatement/EditQuestion";
import { QuestionsReply } from "./pages/Members/QuestionsReply";
import { AnswerHistory } from "./pages/Members/AnswerHistory";
import NinetyDayQuestion from "./pages/90DayQuestion/90DayQuestion";
import Recordings from "./pages/Recordings/Recordings";
import AddRecordings from "./pages/Recordings/AddRecordings";
import EditRecording from "./pages/Recordings/EditRecording";
import VaultCategory from "./pages/Vault/Vault";
import AddVaultCategory from "./pages/Vault/AddVaultCategory";
import EditVaultCategory from "./pages/Vault/EditVaultCategory";
import ProgrammeRecordingDetail from "./pages/Recordings/RecordingDetail";
import StudySession from "./pages/studySession/StudySession";
import AddStudySession from "./pages/studySession/AddStudySession";
import EditStudySession from "./pages/studySession/EditStudySession";
import StudySessionRecording from "./pages/studySession/StudySessionRecordings";
import AddStudySessionRecording from "./pages/studySession/AddStudySessionRecording";
import EditStudySessionRecording from "./pages/studySession/EditStudySessionRecording";
import QuotesList from "./pages/Quotes/Quotes";
import AddQuotes from "./pages/Quotes/AddQuotes";
import EditQuotes from "./pages/Quotes/EditQuotes";
import GratitudeDetail from "./pages/Gratitude/GratitudeDetail";
import EditGratitude from "./pages/Gratitude/EditGratitude";
import Affirmation from "./pages/Affirmation/Affirmation";
import AffirmationDetail from "./pages/Affirmation/AffirmationDetail";
import AddAffirmation from "./pages/Affirmation/AddAffirmation";
import EditAffirmation from "./pages/Affirmation/EditAffirmation";
import AffirmationCategories from "./pages/AffirmationCategories/AffirmationCategories";
import AddAffirmationCategory from "./pages/AffirmationCategories/AddAffirmationCategory";
import EditAffirmationCategory from "./pages/AffirmationCategories/EditAffirmationCategory";
import PaymentTransactionsList from "./pages/Payments/TransactionsList";
import StripeProductsList from "./pages/Payments/StripeProductsList";
import AddStripeProduct from "./pages/Payments/AddStripeProduct";
import EditStripeProduct from "./pages/Payments/EditStripeProduct";
import PaymentTemplateList from "./pages/PaymentTemplate/PaymentTemplateList";
import AddPaymentTemplate from "./pages/PaymentTemplate/AddPaymentTemplate";
import EditPaymentTemplate from "./pages/PaymentTemplate/EditPaymentTemplate";
import PaymentRequestList from "./pages/PaymentRequest/PaymentRequestList";
import AddPaymentRequests from "./pages/PaymentRequest/AddPaymentRequests";
import EditPaymentRequests from "./pages/PaymentRequest/EditPaymentRequests";
import PaymentRequestInfo from "./pages/PaymentRequest/PaymentRequestInfo";
import AddCalendarGroup from "./pages/CalendarGroups/AddCalendarGroups";
import CalendarGroupsList from "./pages/CalendarGroups/CalendarGroupList";
import EditCalendarGroup from "./pages/CalendarGroups/EditCalendarGroups";
import CalendarGroupDetail from "./pages/CalendarGroups/CalendarGroupDetail";
import CalendarPodsList from "./pages/CalendarPods/CalendarPodsList";
import AddPods from "./pages/CalendarPods/AddPods";
import AddCalendarPods from "./pages/CalendarPods/AddPods";
import EditCalendarPods from "./pages/CalendarPods/EditPods";
import CalendarPodsDetail from "./pages/CalendarPods/CalendarPodsDetail";
import AddAutomatedRoomUser from "./pages/CalendarPods/AddRoomUser";
import EditAutomatedRoomUser from "./pages/CalendarPods/EditRoomUser";
import Calenders from "./pages/Calender/Calender";
import ListEvents from "./pages/Calender/ListEvents";
import EventDetailList from "./pages/Calender/EventDetailList";
import DepartmentList from "./pages/Departments/DepartmentsList";
import AddDepartment from "./pages/Departments/AddDepartment";
import AddDepartments from "./pages/Departments/AddDepartment";
import EditDepartments from "./pages/Departments/EditDepartment";
import { SupportTicket } from "./pages/index";
import UpdateGeneralSetting from "./pages/ClientSetting/GeneralSetting";
import ClientDashboardSetting from "./pages/ClientSetting/ClientDashboard";
import SupportTicketDetail from "./pages/SupportTickets/DetailSupportTicket";
import UpdateContentSetting from "./pages/ClientSetting/ContentSetting";
import UpdateConsultantGeneralSetting from "./pages/ConsultantPortal/GeneralSetting";
import AddSendGrid from "./pages/sendGrid/SendGrid";
import AddCompaignSetting from "./pages/SiteSetting/CompaingSetting";
import AddStripeSetting from "./pages/SiteSetting/StripeSetting";
import EmailSetting from "./pages/SiteSetting/EmailSetting";
import DefaultSetting from "./pages/SiteSetting/DefaultSetting";
import EmailTemplates from "./pages/SiteSetting/EmailTemplates";
import EditEmailTemplate from "./pages/SiteSetting/EditEmailTemplate";
import { EmailTemplatePreview } from "./pages/SiteSetting/EmailTemplatePreview";
import ToDoTracker from "./pages/Members/ToDoTracker";
import WebsitePages from "./pages/ManageWebiste/Pages";
import AddPages from "./pages/ManageWebiste/AddPages";
import EditPages from "./pages/ManageWebiste/EditPages";
import UpdatePageContent from "./pages/WebPages/WebsitePages/UpdatePageContent";
import PaymentPlansList from "./pages/PaymentPlans/PaymentPlansList";
import AddPaymentPlan from "./pages/PaymentPlans/AddpaymentPlan";
import EditPaymentPlan from "./pages/PaymentPlans/EditpaymentPlan";
import PodCastList from "./pages/WebsitePodCasts/PodCastList";
import GeneralPaymentPlansList from "./pages/PaymentPlanGeneral/PaymentPlansList";
import EditProfile from "./pages/EditProfile/EditProfile";
import ImportMembers from "./pages/Members/ImportMember";
import CommunityList from "./pages/Community/CommunityList";
import AddCommunity from "./pages/Community/AddCommunity";
import EditCommunity from "./pages/Community/EditCommunity";
import SeriesVideosList from "./pages/SeriesVideos/SeriesVideosList";
import AddSeriesVideos from "./pages/SeriesVideos/AddSeriesVideos";
import EditSeriesVideos from "./pages/SeriesVideos/EditSeriesVideos";
import FeedsList from "./pages/Feeds/FeedsList";
import AddFeeds from "./pages/Feeds/AddFeed";
import EditFeeds from "./pages/Feeds/EditFeed";
import FeedSetting from "./pages/Feeds/FeedSetting";
import SeriesCategoryList from "./pages/seriesCategories/SeriesCategoryList";
import AddSeriesCategory from "./pages/seriesCategories/AddSeriesCategory";
import EditSeriesCategory from "./pages/seriesCategories/EditSeriesCategory";
import ManageRewardAccess from "./pages/Members/ManageRewardAccess";
import MemoryHistory from "./pages/Members/MemberHistory";
import EditDynamiteEvent from "./pages/DynamiteEvents/EditDynamiteEvent";
import DynamiteEventsCategories from "./pages/DynamiteEventsCategories/DynamiteEventsCategories";
import AddDynamiteEventCategory from "./pages/DynamiteEventsCategories/AddDynamiteEventCategory";
import EditDynamiteEventCategory from "./pages/DynamiteEventsCategories/EditDynamiteEventCategory";
import AddDynamiteEventCategoryVideo from "./pages/DynamiteEventCategoryVideos/AddDynamiteEventCategoryVideo";
import DynamiteEventCategoryVideos from "./pages/DynamiteEventCategoryVideos/DynamiteEventCategoryVideos";
import EditDynamiteEventCategoryVideo from "./pages/DynamiteEventCategoryVideos/EditDynamiteEventCategoryVideo";
import AddGeneralPaymentPlan from "./pages/PaymentPlanGeneral/AddGeneralpaymentPlan";
import EditGeneralPaymentPlan from "./pages/PaymentPlanGeneral/EditGeneralpaymentPlan";
import ProgrammeCategoriesList from "./pages/ProgrammeCategories/ProgrammeCategoriesList";
// import RegisterEvents from "./pages/Members/RegisterEvents";
// import BusinessStrategyList from "./pages/BusinessStrategy/BusinessStrategyList";
// import AddBusinessStrategy from "./pages/BusinessStrategy/AddBusinessStrategy";
// import EditBusinessStrategy from "./pages/BusinessStrategy/EditBusinessStrategy";
// import AddWebPageTestimonial from "./pages/WebPageTestimonials/AddWebPageTestimonial";
// import EditWebPageTestimonial from "./pages/WebPageTestimonials/EditWebPageTestimonial";
import AddWebPageEvent from "./pages/WebPageEvents/AddWebPageEvent";
import EditWebPageEvent from "./pages/WebPageEvents/EditWebPageEvent";
import WebPageEvents from "./pages/WebPageEvents/WebPageEvents";
import EventMembers from "./pages/DynamiteEvents/EventMembers";
import EditDynamiteEventMember from "./pages/DynamiteEvents/EditDynamiteEventMember";
import AddEventMembers from "./pages/DynamiteEvents/AddEventMembers";
import WebsiteProgrammesList from "./pages/WebPages/WebsiteProgrammes/WebsiteProgrammesList";
import AddWebsiteProgramme from "./pages/WebPages/WebsiteProgrammes/AddOrUpdateProgramme";
import EditWebsiteProgramme from "./pages/WebsiteProgrammes/EditWebsiteProgramme";
import EditProgrammeCategories from "./pages/ProgrammeCategories/EditProgrammeCategoies";
import AddProgrammeCategories from "./pages/ProgrammeCategories/AddProgrammeCategoies";
import ChartJs from "./components/charts/ChartToDo";
import EventSubscribers from "./pages/Members/EventSubscriber";
import { QuestionSurvey } from "./pages/QuestionSurvey/QuestionSurvey";
import PodcastsList from "./pages/Podcasts/PodCastList";
import AddPodCast from "./pages/Podcasts/AddPodCast";
import EditPodCast from "./pages/Podcasts/EditPodCast";
// import AddGeneralPaymentPlan from "./pages/PaymentPlanGeneral/AddGeneralpaymentPlan";
// import EditGeneralPaymentPlan from "./pages/PaymentPlanGeneral/EditGeneralpaymentPlan";
import SalePageTestimonials from "./pages/salePageTestimonial/SalePageTestimonial";
import AddGeneralTestimonial from "./pages/salePageTestimonial/AddGeneralTestimonial";
import EditSalePageTestimonial from "./pages/salePageTestimonial/EditGeneralTestimonial";
// import ProgrammeCategoriesList from "./pages/ProgrammeCategories/ProgrammeCategoriesList";
// import WebsiteProgrammesList from "./pages/WebsiteProgrammes/WebsiteProgrammesList";
// import AddWebsiteProgramme from "./pages/WebsiteProgrammes/AddWebsiteProgramme";
// import EditWebsiteProgramme from "./pages/WebsiteProgrammes/EditWebsiteProgramme";
// import AddProgrammeCategories from "./pages/ProgrammeCategories/AddProgrammeCategoies";
// import EditProgrammeCategories from "./pages/ProgrammeCategories/EditProgrammeCategoies";
import GeneralFaqList from "./pages/FAQ/GeneralFaqList";
import AddFAQ from "./pages/FAQ/AddFaq";
import EditFAQ from "./pages/FAQ/EditFaq";
import GeneralTeamList from "./pages/Team/TeamList";
import AddTeam from "./pages/Team/AddTeam";
import EditTeam from "./pages/Team/EditTeam";
import GeneralPageTestimonials from "./pages/salePageTestimonial/GeneralTestimonial";
import MediaSectionList from "./pages/MediaSection/MediaBrandsList";
import AddMediaSection from "./pages/MediaSection/AddMedia";
import EditMediaSection from "./pages/MediaSection/EditMedia";
import SuccessProductList from "./pages/SuccessProduct/SuccessProductList";
import AddSuccessProduct from "./pages/SuccessProduct/AddSuccessProduct";
import EditSuccessProduct from "./pages/SuccessProduct/EditSuccessProduct";
import ConsultantCalenders from "./pages/consultant/ConsultantCalender";
import ConsultantListEvents from "./pages/consultant/ConsultantListEvents";
import WhatsIncludeList from "./pages/WhatsInclude/WhatsIncludeList";
import AddWhatsInclude from "./pages/WhatsInclude/AddWhatsInclude";
import EditWhatsInclude from "./pages/WhatsInclude/EditWhatsInclude";
import MediaSections from "./pages/MediaSection/MediaSectionTabs";
import SocialSharingCenter from "./pages/ManageWebiste/soicalSharingCenter";
import TemplatePages from "./pages/WebPages/TemplatePages/TemplatePages";
import SocialSharingSetting from "./pages/WebPages/TemplatePages/SoicalSharingSetting";
import PageSubscribersList from "./pages/WebPages/TemplatePages/PageSubscribersList";
import AddOrUpdatePage from "./pages/WebPages/WebsitePages/AddOrUpdatePage";
import UpdateThanksContent from "./pages/WebPages/WebsitePages/UpdateThanksContent";
import AddOrUpdateWebPageTestimonial from "./pages/WebPages/WebPageTestimonials/AddOrUpdateWebPageTestimonial";
import WebPageFaqs from "./pages/WebPages/WebPageFaqs/WebPageFaqs";
import AddOrUpdateWebPageFaq from "./pages/WebPages/WebPageFaqs/AddOrUpdateWebPageFaq";
import MenuList from "./pages/WebPages/WebsitePages/MenuItems/MenuList";
import { MenuItems } from "./pages/WebPages/WebsitePages/MenuItems/MenuItems";
import WebPageTestimonials from "./pages/WebPages/WebPageTestimonials/WebPageTestimonials";
import WebPagePaymentPlans from "./pages/WebPages/WebPagePaymentPlans/WebPagePaymentPlans";
import AddOrUpdatePaymentPlan from "./pages/WebPages/WebPagePaymentPlans/AddOrUpdatePaymentPlan";
import BusinessStrategyList from "./pages/WebPages/BusinessStrategy/BusinessStrategyList";
import AddOrUpdateBusinessStrategy from "./pages/WebPages/BusinessStrategy/AddOrUpdateBusinessStrategy";
import AddBusinessStrategy from "./pages/WebPages/BusinessStrategy/AddOrUpdateBusinessStrategy";
import SuccessScheduleList from "./pages/WebPages/SuccessSchedule/successScheduleList";
import AddOrUpdateSuccessSchedule from "./pages/WebPages/SuccessSchedule/AddOrUpdateSuccessSchedule";
import AddOrUpdateProgramme from "./pages/WebPages/WebsiteProgrammes/AddOrUpdateProgramme";
import SiteSetting from "./pages/WebPages/WebPageFaqs/SiteSetting";
import UnpublishSetting from "./pages/WebPages/WebsitePages/UnpublishSetting";
import DynamiteEventsList from "./pages/DynamiteEventsNew/DynamiteEventsList";
import AddOrUpdateDynamiteEvent from "./pages/DynamiteEventsNew/AddOrUpdateDynamiteEvent";
import RegisterEventsUsers from "./pages/DynamiteEventsNew/RegisterEventsUsers";
import UpdateLockEventContent from "./pages/DynamiteEventsNew/LockEventContent";
import EventConfiguration from "./pages/DynamiteEventsNew/EventConfiguration";
import MemberChangeStartExpiryDate from "./pages/DynamiteEventsNew/MemberChangeStartExpiryDate";
import EventVideoCategories from "./pages/DynamiteEventsNew/Categories/EventVideoCategories";
import AddOrUpdateEventCategory from "./pages/DynamiteEventsNew/Categories/AddOrUpdateEventCategory";
import DynamiteEventVideoList from "./pages/DynamiteEventsNew/Categories/Videos/DynamiteEventVideoList";
import AddOrUpdateDynamiteEventVideo from "./pages/DynamiteEventsNew/Categories/Videos/AddOrUpdateDynamiteEventVideo";
import QuestionConfigurationForEvent from "./pages/DynamiteEventsNew/Categories/Videos/QuestionConfigurationForEvent";
import DynamiteEventMembers from "./pages/DynamiteEventsNew/EventMembers/DynamiteEventMembers";
import AddDynamiteEventMember from "./pages/DynamiteEventsNew/EventMembers/AddDynamiteEventMember";
import AddOrUpdateGeneralEvents from "./pages/DynamiteEventsNew/GeneralEvents/AddOrUpdateGeneralEvents";
import GeneralEvents from "./pages/DynamiteEventsNew/GeneralEvents/GeneralEvents";
import BannerSliderList from "./pages/WebPages/BannerSlider/BannerSliderList";
import AddBannerSlider from "./pages/WebPages/BannerSlider/AddBannerSlider";
import InvoiceSetting from "./components/InvoiceSetting/InvoiceSetting";
import ProgrammeBulkAccess from "./components/ProgrammBulkAccess/ProgrammeBulkAccess";
import SubscriptionList from "./pages/SubscriptionList/SubscriptionList";
import ProgrammeMembers from "./pages/Programmes/ProgrammeMembers";
import MemberSubscriptions from "./pages/Members/MemberSubscriptions/MemberSubscriptions";
import PagePlanSubscribersList from "./pages/WebPages/WebPagePaymentPlans/PagePlanSubscribersList";
import ProgrammeAccessPaymentPlan from "./pages/WebPages/WebPagePaymentPlans/ProgrammeAccessPaymentPlan";
import EventAccessPaymentPlan from "./pages/WebPages/WebPagePaymentPlans/EventAccessPaymentPlan";
import { Web } from "@mui/icons-material";
import AddWebPageFaq from "./pages/WebPages/WebPageFaqs/AddOrUpdateWebPageFaq";
import MemberChild from "./pages/MemberChild/MemberChild";
import AddChild from "./pages/MemberChild/AddChild";
import EditChild from "./pages/MemberChild/EditChild";
import ManageChildProgrammeAccess from "./pages/MemberChild/ManageChildProgrammeAccess";
import ManageChildEventAccess from "./pages/MemberChild/ManageChildEventAccess";
import PendingMembers from "./pages/Members/PendingMembers";
import DailyGratitude from "./pages/DailyGratitude/DailyGratitude";
import AddorUpdateGratitude from "./pages/DailyGratitude/AddorUpdateGratitude";
import Embed from "./pages/Programmes/Embed";
import MeditationVideos from "./pages/GrowthTools/MeditationVideos";
import AddOrUpdateMeditation from "./pages/GrowthTools/AddOrUpdateMeditation";
import MeditaionVideoDetail from "./pages/GrowthTools/MeditaionVideoDetail";
import ListAffirmation from "./pages/GrowthTools/ListAffirmation";
import AddOrUpdateAffirmations from "./pages/GrowthTools/AddOrUpdateAffirmations";
import Feed from "./pages/CommunityFeeds/Feed";
import PostDetail from "./pages/CommunityFeeds/PostDetail";
import MyPosts from "./pages/CommunityFeeds/MyPosts";
import PostDetails from "./pages/CommunityFeeds/PostDetails";
import FeedDetailPage from "./pages/CommunityFeeds/FeedDetailPage";
import ChallengesList from "./pages/GrowthTools/ChallengesList";
import AddOrUpdateChallenges from "./pages/GrowthTools/AddOrUpdateChallenges";
import ChallengeDetail from "./pages/GrowthTools/ChallengeDetail";
import ChallengeResources from "./pages/GrowthTools/ChallengeResources";
import ChallengeRecordings from "./pages/GrowthTools/ChallengeRecordings";
import AddOrUpdateChallengeResources from "./pages/GrowthTools/AddOrUpdateChallengeResources";
import AddOrUpdateChallengeRecordings from "./pages/GrowthTools/AddOrUpdateChallengeRecordings";
import ChallengeRecordingDetail from "./pages/GrowthTools/ChallengeRecordingDetail";
import StagesList from "./pages/Stages/StagesList";
import GettingStarting from "./pages/Programmes/Getting-Starting/Getting-Starting";
import AddGettingStarting from "./pages/Programmes/Getting-Starting/AddGettingStarting";
import GettingStartingDetail from "./pages/Programmes/Getting-Starting/GettingStartingDetail";
import EditGettingStarting from "./pages/Programmes/EditGettingStarting";
import GettingStartingRecordingListing from "./pages/Programmes/Getting-Starting/GettingStartingRecordingListing";
import AddRecordingOfGettingStarting from "./pages/Programmes/Getting-Starting/AddRecordingGettingStarting";
import Getting_Starting_Recording_Detail from "./pages/Programmes/Getting-Starting/DetailRecordingGettingStarting";
import EditGettingStartingRecording from "./pages/Programmes/Getting-Starting/EditGettingStartingRecording";
import { GettingStartingResources } from "./pages/Programmes/Getting-Starting/GettingStartingResources";
import AddGettingResources from "./pages/Programmes/Getting-Starting/AddGettingStartedResources";
import EditGettingResourceDoc from "./pages/Programmes/Getting-Starting/editGettingResource";
import { LessonEvaluationCard } from "./pages/lessonEvaluation/LessonEvaluationCard";
import AddLessonEvaluation from "./pages/lessonEvaluation/AddLessonEvaluation";
import EditLesonEvaluatonent from "./pages/lessonEvaluation/EditLessonEvaluation";
import { GettingStartedEvaluation } from "./pages/GettingStartedEvaluation/GettingStartedEvaluationList";
import AddGettingStartedEvaluation from "./pages/GettingStartedEvaluation/AddGettingStartedEvaluation";
import EditGettingStartedEvaluatonent from "./pages/GettingStartedEvaluation/EditGettingStartedEvaluation";
import EditGettingStartedEvaluation from "./pages/GettingStartedEvaluation/EditGettingStartedEvaluation";
import GoalSettings from "./pages/GrowthTools/GoalSettings";
import BooksModule from "./pages/booksModule/Books";
import TagsList from "./pages/booksModule/manageTags/TagsList";
import AddBook from "./pages/books/AddBook";
import BookDetail from "./pages/books/BookDetail";
import EditBook from "./pages/book/EditBook";
import LessonSectionListing from "./pages/section/LessonSectionList";
import AddLessonSection from "./pages/Sections/AdLessonSection";
import EditLessonSection from "./pages/Sections/EditLessonSection";

// ----------------------------------------------------------------------
const Authentication = () => {
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard"> </Navigate>;
  }
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login"> </Navigate>;
  }
};
export default function Router() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<DashboardApp />} />
        <Route path="/programmes" element={<Programmes />} />
        <Route
          path="/programmes/programmes-detail/:id"
          element={<ProgrammesDetail />}
        />
        <Route path="/programmes/members/:id" element={<ProgrammeMembers />} />
        <Route path="/programmes/add-programme" element={<AddProgramme />} />
        <Route
          path="/programmes/:programme_slug/edit-programme"
          element={<EditProgramme />}
        />
        <Route
          path="/programmes/:slug/lessons-listing"
          element={<LessonListing />}
        />
        <Route
          path="/programmes/:slug/getting-started-list"
          element={<GettingStarting />}
        />
        <Route
          path="/programmes/lessons-detail/:id"
          element={<LessonsDetail />}
        />
        <Route
          path="/programmes/getting-started-detail/:id"
          element={<GettingStartingDetail />}
        />
        <Route path="/programmes/add-lessons" element={<AddLesson />} />
        <Route
          path="/programmes/add-getting-started"
          element={<AddGettingStarting />}
        />
        <Route path="/programmes/:id/edit-lessons" element={<EditLesson />} />
        <Route
          path="/programmes/:id/edit-getting-started"
          element={<EditGettingStarting />}
        />
        <Route
          path="/programmes/lessons/:slug/recordings"
          element={<LessonRecordingListing />}
        />
        <Route
          path="/programmes/getting-starting/:slug/getting-started-recording"
          element={<GettingStartingRecordingListing />}
        />
        <Route
          path="/programmes/:slug/lesson-recording-detail"
          element={<LessonRecordingDetail />}
        />
        <Route
          path="/programmes/:slug/getting-started-recording-detail"
          element={<Getting_Starting_Recording_Detail />}
        />
        <Route
          path="/programmes/:slug/add-lesson-recording"
          element={<AddLessonRecording />}
        />
        <Route
          path="/programmes/:slug/add-getting-recording"
          element={<AddRecordingOfGettingStarting />}
        />
        <Route
          path="/programmes/:slug/edit-lessons-recording"
          element={<EditLessonRecording />}
        />
        <Route
          path="/programmes/:slug/edit-getting-started-ecording"
          element={<EditGettingStartingRecording />}
        />
        <Route
          path="/programmes/lesson/:slug/lesson-doc"
          element={<ResourcesCard />}
        />
        <Route
          path="/programmes/getting-started/:slug/evaluation"
          element={<GettingStartedEvaluation />}
        />
        <Route
          path="/programmes/lesson/:slug/lesson-evaliation"
          element={<LessonEvaluationCard />}
        />
        <Route
          path="/programmes/lesson/:slug/section"
          element={<LessonSectionListing />}
        />
        <Route
          path="/programmes/lesson/:slug/section/add-section"
          element={<AddLessonSection />}
        />
        <Route
          path="/programmes/lesson/:slug/section/edit-section"
          element={<EditLessonSection />}
        />
        <Route
          path="/programmes/getting-started/:slug/document"
          element={<GettingStartingResources />}
        />
        <Route
          path="/programmes/lessons/:slug/add-lesson-document"
          element={<AddLessonDocument />}
        />
        <Route
          path="/programmes/lessons/:slug/add-lesson-note"
          element={<AddLessonEvaluation />}
        />
        <Route
          path="/programmes/getting-started/:slug/add-evaluation"
          element={<AddGettingStartedEvaluation />}
        />
        <Route
          path="/programmes/getting-started/:slug/add-document"
          element={<AddGettingResources />}
        />
        <Route
          path="/programmes/lessons/:slug/edit-lesson-document"
          element={<EditLessonDocument />}
        />
        <Route
          path="/programmes/lessons/:slug/edit-lesson-evaluation"
          element={<EditLesonEvaluatonent />}
        />
        <Route
          path="/programmes/getting-started/:slug/edit-evaluation"
          element={<EditGettingStartedEvaluation />}
        />
        <Route
          path="/programmes/getting-started/:slug/edit-document"
          element={<EditGettingResourceDoc />}
        />
        <Route path="/programmes/:type/:id" element={<ProgrammeBulkAccess />} />
        {/* programms Doc routes */}
        {/* PodCastList */}
        <Route path="/pod-casts" element={<PodCastList />} />
        {/* PodCastList */}
        <Route
          path="/website-categories"
          element={<ProgrammeCategoriesList />}
        />
        <Route
          path="/website-categories/add-category"
          element={<AddProgrammeCategories />}
        />
        <Route
          path="/website-categories/edit-category/:id"
          element={<EditProgrammeCategories />}
        />
        <Route
          path="/website-general-payment-plans"
          element={<GeneralPaymentPlansList />}
        />
        <Route
          path="/website-general-payment-plans/add-payment-plan/"
          element={<AddGeneralPaymentPlan />}
        />
        <Route
          path="/website-general-payment-plans/edit-payment-plan/:id"
          element={<EditGeneralPaymentPlan />}
        />
        {/* <Route
          path="/website-general-payment-plans/add-payment-plan/"
          element={<AddGeneralPaymentPlan />}
        /> */}
        <Route
          path="/website-general-payment-plans/edit-payment-plan/:id"
          element={<EditGeneralPaymentPlan />}
        />
        <Route
          path="/programmes/:id/programm-resources"
          element={<ProgrammeDocumentList />}
        />
        <Route path="/embed-code" element={<Embed />} />
        <Route
          path="/programmes/:slug/add-programme-resource"
          element={<AddProgrammeDocument />}
        />
        <Route
          path="/template-pages/socail-sharing-setting/:page_slug"
          element={<SocialSharingCenter />}
        />
        <Route
          path="/programmes/:slug/edit-programme-resource"
          element={<EditProgrammeDocument />}
        />
        {/* programms Doc routes end */}
        {/* program > section */}
        <Route path="/programmes/:slug/sections" element={<SectionList />} />
        {/* program > section end */}
        {/* Programme reviews */}
        <Route
          path="/programmes/:slug/reviews"
          element={<ProgrammeReviews />}
        />
        <Route
          path="/programmes/:slug/add-reviews"
          element={<AddProgrammeReview />}
        />
        <Route
          path="/programmes/:slug/edit-review"
          element={<EditProgrammeReview />}
        />
        {/* Programme reviews end*/}
        {/* program section  */}
        <Route
          path="/programmes/:slug/section"
          element={<ProgrammeSectionList />}
        />
        <Route path="/programmes/:slug/stages" element={<StagesList />} />
        <Route
          path="/programmes/:slug/locked-programme"
          element={<LockedProgram />}
        />
        <Route
          path="/programmes/:slug/add-section"
          element={<AddProgrammeSection />}
        />
        <Route
          path="/programmes/:slug/edit-section"
          element={<EditProgrammeSection />}
        />
        {/* program section end */}
        {/* dynamite events new  */}
        <Route path="/dynamite-events" element={<DynamiteEventsList />} />
        <Route
          path="/dynamite-events/add-event"
          element={<AddOrUpdateDynamiteEvent />}
        />
        <Route
          path="/dynamite-events/:dynamite_event_id/general-events"
          element={<GeneralEvents />}
        />
        <Route
          path="/dynamite-events/:dynamite_event_id/general-events/add-event"
          element={<AddOrUpdateGeneralEvents />}
        />
        <Route
          path="/dynamite-events/general-events/edit-event/:event_slug"
          element={<AddOrUpdateGeneralEvents />}
        />
        <Route
          path="dynamite-events/edit-event/:event_slug"
          element={<AddOrUpdateDynamiteEvent />}
        />
        <Route
          path="/dynamite-events/register-events"
          element={<RegisterEventsUsers />}
        />
        <Route
          path="/dynamite-events/lock-event-content/:event_id"
          element={<UpdateLockEventContent />}
        />
        <Route
          path="/dynamite-events/configuration/:event_id"
          element={<EventConfiguration />}
        />
        <Route
          path="/dynamite-events/change-start-date/:start_date_event"
          element={<MemberChangeStartExpiryDate />}
        />
        <Route
          path="/dynamite-events/change-expiry-date/:expiry_date_event"
          element={<MemberChangeStartExpiryDate />}
        />
        <Route
          path="/dynamite-event-categories/:event_id"
          element={<EventVideoCategories />}
        />
        <Route
          path="/dynamite-event-categories/:event_id/add-category"
          element={<AddOrUpdateEventCategory />}
        />
        <Route
          path="/dynamite-event-categories/:event_id/edit-category/:category_slug"
          element={<AddOrUpdateEventCategory />}
        />
        <Route
          path="/dynamite-event-videos/:category_id"
          element={<DynamiteEventVideoList />}
        />
        <Route
          path="/dynamite-event-videos/:category_id/add-video"
          element={<AddOrUpdateDynamiteEventVideo />}
        />
        <Route
          path="/dynamite-event-videos/:category_id/edit-video/:video_id"
          element={<AddOrUpdateDynamiteEventVideo />}
        />{" "}
        <Route
          path="/dynamite-event-videos/questions-configuration/:video_id"
          element={<QuestionConfigurationForEvent />}
        />
        <Route
          path="/dynamite-events/:event_id/members"
          element={<DynamiteEventMembers />}
        />
        <Route
          path="/dynamite-events/:event_id/add-members"
          element={<AddDynamiteEventMember />}
        />
        <Route
          path="/dynamite-events/:event_id/edit-member/:member_id"
          element={<EditDynamiteEventMember />}
        />
        {/* ProgrammeAutomatedGroups */}
        <Route
          path="/programmes/:slug/automated-group"
          element={<ProgrammeAutomatedGroups />}
        />
        <Route
          path="/programmes/:slug/add-automated-group"
          element={<AddProgrammeAutoGroup />}
        />
        <Route
          path="/programmes/:slug/edit-automated-group"
          element={<EditProgrammeAutoGroup />}
        />
        {/* ProgrammeAutomatedGroups end  */}
        {/* Member */}
        <Route path="/member" element={<MembersList />} />
        {/* <Route path="/active-members" element={<MembersList />} /> */}
        <Route path="/pending-member" element={<PendingMembers />} />
        <Route path="/member/import-member" element={<ImportMembers />} />
        {/* <Route
          path="/dynamite-events/register-events"
          element={<RegisterEvents />}
        /> */}
        <Route path="/member/add-member" element={<AddMember />} />
        <Route path="/pending-member/add-member" element={<AddMember />} />
        <Route path="/member/edit-member/:id" element={<EditMember />} />
        <Route
          path="/pending-member/edit-member/:id"
          element={<EditMember />}
        />
        <Route path="/member/member-child/:id" element={<MemberChild />} />
        <Route
          path="/pending-member/member-child/:id"
          element={<MemberChild />}
        />
        <Route path="/member/add-member-child/:id" element={<AddChild />} />
        <Route
          path="/member/:parent/edit-member-child/:id"
          element={<EditChild />}
        />
        <Route
          path="/pending-member/add-member-child/:id"
          element={<AddChild />}
        />
        <Route
          path="/pending-member/:parent/edit-member-child/:id"
          element={<EditChild />}
        />
        <Route
          path="/member-child/programme-access/:id"
          element={<ManageChildProgrammeAccess />}
        />
        <Route
          path="/pending-member-child/programme-access/:id"
          element={<ManageChildProgrammeAccess />}
        />
        <Route
          path="/member-child/event-access/:id"
          element={<ManageChildEventAccess />}
        />{" "}
        <Route
          path="/pending-member-child/event-access/:id"
          element={<ManageChildEventAccess />}
        />
        <Route path="/member/member-profile/:id" element={<MemberProfile />} />
        <Route
          path="/pending-member/member-profile/:id"
          element={<MemberProfile />}
        />
        <Route path="/member/member-history/:id" element={<MemoryHistory />} />
        <Route
          path="/member/member-groups/:id"
          element={<MemberGroupsList />}
        />{" "}
        <Route
          path="/pending-member/member-groups/:id"
          element={<MemberGroupsList />}
        />
        <Route
          path="/consultant/member-groups/:id"
          element={<MemberGroupsList />}
        />
        <Route
          path="/member/member-subscribers/:member_id"
          element={<MemberSubscriptions />}
        />{" "}
        <Route
          path="/pending-member/member-subscribers/:member_id"
          element={<MemberSubscriptions />}
        />
        <Route
          path="/member/member-personal-notes/:id"
          element={<MemberPersonalNote />}
        />
        <Route
          path="/pending-member/member-personal-notes/:id"
          element={<MemberPersonalNote />}
        />
        <Route
          path="/member/member-goal-statement/:id"
          element={<MemberGoalstatementList />}
        />
        <Route
          path="/member/goal-statement-question-reply/:id"
          element={<QuestionsReply />}
        />
        <Route
          path="/member/event-subscriber/:id"
          element={<EventSubscribers />}
        />
        <Route
          path="/member/goal-statement-Question-history/:id"
          element={<AnswerHistory />}
        />
        <Route
          path="/member/programme-access/:id"
          element={<ManageProgrammeAccess />}
        />
        <Route
          path="/pending-member/programme-access/:id"
          element={<ManageProgrammeAccess />}
        />
        <Route
          path="/member/reward-access/:id"
          element={<ManageRewardAccess />}
        />
        <Route
          path="/member/add-payment-request/:id"
          element={<AddPaymentRequest />}
        />
        <Route
          path="/pending-member/add-payment-request/:id"
          element={<AddPaymentRequest />}
        />
        <Route
          path="/member/billing-detail"
          element={<BillingRequestDetail />}
        />
        <Route
          path="/pending-member/billing-detail"
          element={<BillingRequestDetail />}
        />
        <Route
          path="/member/all-transaction/:id"
          element={<MemberAllTransaction />}
        />
        <Route
          path="/pending-member/all-transaction/:id"
          element={<MemberAllTransaction />}
        />
        <Route
          path="/member/view-billing-list/:id"
          element={<ViewBillingList />}
        />
        <Route
          path="/pending-member/view-billing-list/:id"
          element={<ViewBillingList />}
        />
        <Route
          path="/member/change-password/:id"
          element={<ChangePassword />}
        />{" "}
        <Route
          path="/pending-member/change-password/:id"
          element={<ChangePassword />}
        />
        <Route path="/member/member-pods" element={<PodsListMemberProfile />} />
        <Route path="/member/to-do-tracker/:id" element={<ToDoTracker />} />
        {/* <Route path="/member/to-do-tracker/:id" element={<ChartJs />} /> */}
        {/* member end  */}
        {/* whats include */}
        <Route
          path="/website-pages/whats-include/:id"
          element={<WhatsIncludeList />}
        />
        <Route
          path="/website-pages/whats-include/add-whats-include/:id"
          element={<AddWhatsInclude />}
        />
        <Route
          path="/website-pages/whats-include/edit-whats-include/:id"
          element={<EditWhatsInclude />}
        />
        {/* consultant   */}
        <Route path="/consultant" element={<ConsultantList />} />
        <Route
          path="/consultant/pods-list/:id"
          element={<ConsultantPodsList />}
        />
        <Route
          path="/consultant/member-list/:id"
          element={<MembersListConsultant />}
        />
        <Route
          path="/consultant/:consultantId/edit-member/:id"
          element={<EditMember />}
        />
        <Route path="/consultant/add-consultant" element={<AddConsultant />} />
        <Route
          path="/consultant/:consultantId/member-profile/:id"
          element={<MemberProfile />}
        />
        <Route
          path="/consultant/groups/:id"
          element={<ConsultantGroupsList />}
        />
        <Route
          path="/consultant/goal-statement-list/:id"
          element={<ConsultantGoalStatementList />}
        />
        <Route
          path="/consultant/events/:id"
          element={<ConsultantCalenders />}
        />
        <Route
          path="/consultant/events-list/:id"
          element={<ConsultantListEvents />}
        />
        <Route
          path="/consultant/pods-detail/:id"
          element={<ConsultantPodsDetail />}
        />
        <Route
          path="/consultant/view-group-detail/:id"
          element={<ConsultantGroupDetail />}
        />
        <Route
          path="/consultant/goal-statement-detail/:id"
          element={<ConsultantGoalstatementDetail />}
        />
        <Route
          path="/consultant/recording-detail/:id"
          element={<ConsultantRecordingDetail />}
        />
        <Route
          path="/consultant/edit-consultant/:id"
          element={<EditConsultant />}
        />
        <Route
          path="/consultant/change-password/:id"
          element={<ChangeConsultantPassword />}
        />
        <Route
          path="/consultant/recordings/:id"
          element={<ConsultantRecordings />}
        />
        {/* consultant end  */}
        {/* /goal-statement start */}
        <Route path="/goal-statement" element={<GoalStatement />} />
        <Route path="/goal-statement/add-question" element={<AddQuestions />} />
        <Route
          path="/goal-statement/detail-question/:id"
          element={<DetailQuestion />}
        />
        <Route
          path="/goal-statement/edit-question/:slug"
          element={<EditQuestions />}
        />
        <Route
          path="/website-pages/:page_id/business-strategy"
          element={<BusinessStrategyList />}
        />
        <Route
          path="/website-pages/:page_id/business-strategy/add-business-strategy"
          element={<AddOrUpdateBusinessStrategy />}
        />
        <Route
          path="/website-pages/:page_id/business-strategy/edit-business-strategy/:strategy_id"
          element={<AddOrUpdateBusinessStrategy />}
        />
        {/* /goal-statement end */}
        {/* /website-pages */}
        <Route path="/website-pages" element={<TemplatePages />} />
        <Route
          path="/website-pages/:page_id/testimonials/add-testimonial"
          element={<AddOrUpdateWebPageTestimonial />}
        />
        <Route
          path="/website-pages/:page_id/website-faq"
          element={<WebPageFaqs />}
        />
        <Route
          path="/website-pages/:page_id/website-faq/add-faq"
          element={<AddOrUpdateWebPageFaq />}
        />
        <Route
          path="/template-pages/edit-page/:page_slug"
          element={<AddOrUpdatePage />}
        />
        <Route
          path="/template-pages/:page_id/testimonials/add-testimonial"
          element={<AddOrUpdateWebPageTestimonial />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans"
          element={<WebPagePaymentPlans />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans/add-plan"
          element={<AddOrUpdatePaymentPlan />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans/edit-plan/:plan_id"
          element={<AddOrUpdatePaymentPlan />}
        />
        <Route
          path="/template-pages/:page_id/business-strategy"
          element={<BusinessStrategyList />}
        />
        <Route
          path="/template-pages/:page_id/website-faq"
          element={<WebPageFaqs />}
        />
        <Route
          path="/template-pages/:page_id/business-strategy/add-business-strategy"
          element={<AddBusinessStrategy />}
        />
        <Route
          path="/template-pages/:page_id/business-strategy/edit-business-strategy/:strategy_id"
          element={<AddBusinessStrategy />}
        />
        <Route
          path="/template-pages/:page_id/success-schedule"
          element={<SuccessScheduleList />}
        />
        <Route
          path="/template-pages/:page_id/add-success-schedule"
          element={<AddOrUpdateSuccessSchedule />}
        />
        <Route
          path="/template-pages/:page_id/edit-success-schedule/:success_id"
          element={<AddOrUpdateSuccessSchedule />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans"
          element={<WebPagePaymentPlans />}
        />
        <Route
          path="/template-pages/social-sharing-setting/:page_id"
          element={<SocialSharingSetting />}
        />
        <Route
          path="/template-pages/update-thanks-content/:id"
          element={<UpdateThanksContent />}
        />
        <Route
          path="/template-pages/update-page-content/:id"
          element={<UpdatePageContent />}
        />
        {/* <Route
          path="/website-pages/manage-commission-access/:page_id"
          element={<ManageCommissionAccess />}
        /> */}
        {/* <Route
          path="/website-pages/answers/:created_for_id"
          element={<QuestionsAnswersAsCreatedFor />}
        /> */}
        {/* <Route
          path="/website-pages/answers/:created_for_id/:member_id"
          element={<QuestionsAnswers />}
        /> */}
        <Route
          path="/website-pages/social-sharing-setting/:page_id"
          element={<SocialSharingSetting />}
        />
        {/* <Route
          path="/website-pages/manage-commission-access/:page_id"
          element={<ManageCommissionAccessFromPages />}
        /> */}
        <Route
          path="/website-pages/page-subscriber/:id"
          element={<PageSubscribersList />}
        />
        <Route
          path="/template-pages/page-subscriber/:id"
          element={<PageSubscribersList />}
        />
        <Route path="/website-pages/add-page" element={<AddOrUpdatePage />} />
        <Route
          path="/website-pages/edit-page/:page_slug"
          element={<AddOrUpdatePage />}
        />
        <Route
          path="/website-pages/update-page-content/:id"
          element={<UpdatePageContent />}
        />
        <Route
          path="/website-pages/update-thanks-content/:id"
          element={<UpdateThanksContent />}
        />
        {/* <Route
          path="/website-pages/unpublish-setting/:id"
          element={<UnpublishSetting />}
        /> */}
        <Route
          path="/website-pages/:page_id/testimonials"
          element={<WebPageTestimonials />}
        />
        <Route
          path="/website-pages/:page_id/payment-plans/"
          element={<WebPagePaymentPlans />}
        />
        <Route
          path="/website-pages/:page_id/payment-plans/add-plan"
          element={<AddOrUpdatePaymentPlan />}
        />
        <Route
          path="/website-pages/:page_id/subscriber/:plan_id"
          element={<PagePlanSubscribersList />}
        />
        <Route
          path="/website-pages/:page_id/payment-plans/edit-plan/:plan_id"
          element={<AddOrUpdatePaymentPlan />}
        />
        <Route
          path="/website-pages/unpublish-setting/:id"
          element={<UnpublishSetting />}
        />
        <Route path="/template-pages" element={<TemplatePages />} />
        <Route path="/menus" element={<MenuList />} />
        <Route path="/menu/add-menu" element={<MenuItems />} />
        <Route path="/menu/:id" element={<MenuItems />} />
        <Route
          path="/template-pages/:page_id/testimonials/add-testimonial"
          element={<AddOrUpdateWebPageTestimonial />}
        />
        <Route
          path="/template-pages/:page_id/testimonials/edit-testimonial/:testimonial_id"
          element={<AddOrUpdateWebPageTestimonial />}
        />
        <Route
          path="/template-pages/:page_id/testimonials"
          element={<WebPageTestimonials />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans"
          element={<WebPagePaymentPlans />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans/add-plan"
          element={<AddOrUpdatePaymentPlan />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans/edit-plan/:plan_id"
          element={<AddOrUpdatePaymentPlan />}
        />
        <Route
          path="/template-pages/:page_id/website-programmes"
          element={<WebsiteProgrammesList />}
        />
        <Route
          path="/template-pages/:page_id/website-programmes/add-programme"
          element={<AddWebsiteProgramme />}
        />
        <Route
          path="/template-pages/:page_id/website-programmes/edit-programme/:programme_slug"
          element={<AddWebsiteProgramme />}
        />
        <Route path="/site-setting" element={<SiteSetting />} />
        <Route
          path="/website-pages/:page_id/testimonials/edit-testimonial/:testimonial_id"
          element={<AddOrUpdateWebPageTestimonial />}
        />
        <Route
          path="/website-pages/:page_id/website-faq"
          element={<WebPageFaqs />}
        />
        <Route
          path="/template-pages/:page_id/website-faq/add-faq"
          element={<AddWebPageFaq />}
        />
        <Route path="/subscription-list" element={<SubscriptionList />} />
        {/* <Route
          path="/website-pages/:page_id/website-faq/add-faq"
          element={<AddOrUpdateWebPageFaq />}
        /> */}
        <Route
          path="/template-pages/:page_id/website-faq/edit-faq/:faq_id"
          element={<AddWebPageFaq />}
        />
        <Route
          path="/website-pages/:page_id/website-faq/edit-faq/:faq_id"
          element={<AddOrUpdateWebPageFaq />}
        />
        {/* <Route
          path="/website-pages/:page_id/website-questions"
          element={<WebPageQuestions />}
        />
        <Route
          path="/website-pages/:page_id/website-questions/add-question"
          element={<AddOrUpdateWebPageQuestion />}
        /> */}
        {/* <Route
          path="/website-pages/:page_id/website-questions/edit-question/:question_id"
          element={<AddOrUpdateWebPageQuestion />}
        /> */}
        {/* <Route
          path="/website-pages/:created_for_id/general-questions"
          element={<GeneralQuestions created_for="page" />}
        /> */}
        {/* <Route
          path="/website-pages/:page_id/payment-plans/"
          element={<WebPagePaymentPlans />}
        />
        <Route
          path="/website-pages/:page_id/payment-plans/add-plan"
          element={<AddOrUpdatePaymentPlan />}
        />
        <Route
          path="/website-pages/:page_id/payment-plans/edit-plan/:plan_id"
          element={<AddOrUpdatePaymentPlan />}
        /> */}
        <Route
          path="/website-pages/:page_id/subscriber/:plan_id"
          element={<PagePlanSubscribersList />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans/:plan_id/manage-program-access"
          element={<ProgrammeAccessPaymentPlan />}
        />
        <Route
          path="/website-pages/:page_id/payment-plans/:plan_id/manage-program-access"
          element={<ProgrammeAccessPaymentPlan />}
        />
        <Route
          path="/website-pages/:page_id/payment-plans/:plan_id/manage-events-access"
          element={<EventAccessPaymentPlan />}
        />
        <Route
          path="/template-pages/:page_id/payment-plans/:plan_id/manage-events-access"
          element={<EventAccessPaymentPlan />}
        />
        <Route
          path="/template-pages/:page_id/subscriber/:plan_id"
          element={<PagePlanSubscribersList />}
        />
        <Route
          path="/website-pages/:page_id/questions"
          element={<QuestionSurvey />}
        />
        <Route
          path="/website-pages/:page_id/website-programmes"
          element={<WebsiteProgrammesList />}
        />
        <Route
          path="/website-pages/:page_id/website-programmes/add-programme"
          element={<AddWebsiteProgramme />}
        />
        <Route
          path="/website-pages/:page_id/website-programmes/edit-programme/:programme_slug"
          element={<AddWebsiteProgramme />}
        />
        <Route
          path="/website-pages/sale-page/:page_id"
          element={<WebPageEvents />}
        />
        <Route
          path="/website-pages/add-page-event/:page_id"
          element={<AddWebPageEvent />}
        />
        <Route
          path="/website-pages/:page_id/edit-page-event/:id"
          element={<EditWebPageEvent />}
        />
        {/* <Route
          path="/website-pages/:page_id/business-strategy"
          element={<BusinessStrategyList />}
        />
        <Route
          path="/website-pages/:page_id/business-strategy/add-business-strategy"
          element={<AddBusinessStrategy />}
        />
        <Route
          path="/website-pages/:page_id/business-strategy/edit-business-strategy/:strategy_id"
          element={<AddBusinessStrategy />}
        /> */}
        {/* <Route
          path="/website-pages/:page_id/success-schedule"
          element={<SuccessScheduleList />}
        />
        <Route
          path="/website-pages/:page_id/add-success-schedule"
          element={<AddOrUpdateSuccessSchedule />}
        />
        <Route
          path="/website-pages/:page_id/edit-success-schedule/:success_id"
          element={<AddOrUpdateSuccessSchedule />}
        /> */}
        {/* /90-day-questions */}
        <Route path="/90-day-questions" element={<NinetyDayQuestion />} />
        {/* /90-day-questions end */}
        {/* ProgrammeCategories */}
        <Route
          path="/websiteProgrammeCategories"
          element={<ProgrammeCategoriesList />}
        />
        {/* ProgrammeCategories */}
        <Route
          path="/websiteProgrammeCategories"
          element={<ProgrammeCategoriesList />}
        />
        {/* recording /recordings */}
        <Route path="/recording-list" element={<Recordings />} />
        <Route
          path="/recording-list/recording-detail"
          element={<ProgrammeRecordingDetail />}
        />
        <Route
          path="/recording-list/add-recording"
          element={<AddRecordings />}
        />
        <Route
          path="/template-pages/:page_id/banner-slider"
          element={<BannerSliderList />}
        />
        <Route
          path="/template-pages/:page_id/add-banner-slider"
          element={<AddBannerSlider />}
        />
        <Route
          path="/website-pages/:page_id/banner-slider"
          element={<BannerSliderList />}
        />
        <Route
          path="/website-pages/:page_id/add-banner-slider"
          element={<AddBannerSlider />}
        />
        <Route
          path="/website-pages/:page_id/edit-banner-slider/:banner_id"
          element={<AddBannerSlider />}
        />
        <Route
          path="/template-pages/:page_id/edit-banner-slider/:banner_id"
          element={<AddBannerSlider />}
        />
        <Route
          path="/recording-list/edit-recording"
          element={<EditRecording />}
        />
        {/* recording end */}
        {/* vault VaultCategory */}
        <Route path="/categories" element={<VaultCategory />} />
        <Route path="/categories/add-category" element={<AddVaultCategory />} />
        <Route
          path="/categories/edit-category"
          element={<EditVaultCategory />}
        />
        {/* vault end */}
        {/* community */}
        <Route path="/community" element={<CommunityList />} />
        <Route
          path="/community/add-community-reward"
          element={<AddCommunity />}
        />
        <Route
          path="/community/edit-community-reward/:id"
          element={<EditCommunity />}
        />
        <Route path="/series-categories/" element={<SeriesCategoryList />} />
        <Route
          path="/series-categories/add-category"
          element={<AddSeriesCategory />}
        />
        <Route
          path="/series-categories/edit-category/:id"
          element={<EditSeriesCategory />}
        />
        {/* community end */}
        {/* /website-podcasts */}
        <Route path="/website-podcasts" element={<PodcastsList />} />
        <Route path="/website-podcasts/add-podcast" element={<AddPodCast />} />
        <Route
          path="/website-podcasts/edit-podcast/:id"
          element={<EditPodCast />}
        />
        {/* /series-videos */}
        <Route path="/series-videos" element={<SeriesVideosList />} />
        <Route
          path="/series-videos/add-series-videos"
          element={<AddSeriesVideos />}
        />
        <Route
          path="/series-videos/edit-series-videos/:id"
          element={<EditSeriesVideos />}
        />
        {/* feed */}
        <Route path="/community-area" element={<Feed />} />
        {/* <Route path="/post-detail" element={<PostDetail />} /> */}
        <Route path="/community-area/my-posts" element={<MyPosts />} />
        <Route path="/post-detail/:id" element={<FeedDetailPage />} />
        {/* fees */}
        <Route path="/feeds" element={<FeedsList />} />
        <Route path="/feeds/add-feed" element={<AddFeeds />} />
        <Route path="/feeds/edit-feed/:id" element={<EditFeeds />} />
        <Route path="/feed/setting" element={<FeedSetting />} />
        {/* Sessions end */}
        <Route path="/sessions" element={<StudySession />} />
        <Route path="/sessions/add-session" element={<AddStudySession />} />
        <Route path="/sessions/edit-session" element={<EditStudySession />} />
        <Route path="/session-recording" element={<StudySessionRecording />} />
        <Route
          path="/session-recording/add-study-session-recording"
          element={<AddStudySessionRecording />}
        />
        <Route
          path="/session-recording/edit-study-session-recording"
          element={<EditStudySessionRecording />}
        />
        {/* Sessions */}
        {/* QuotesList */}
        <Route path="/quotesList" element={<QuotesList />} />
        <Route path="/quotesList/add-quotes" element={<AddQuotes />} />
        <Route path="/quotesList/edit-quotes" element={<EditQuotes />} />
        {/* QuotesList end */}
        {/* gratitude  */}
        <Route path="/gratitude" element={<Gratitude />} />
        <Route path="/gratitude/add-gratitude" element={<AddGratitude />} />
        <Route path="/gratitude/edit-gratitude" element={<EditGratitude />} />
        <Route
          path="/gratitude/gratitude-detail/:id"
          element={<GratitudeDetail />}
        />
        {/* gratitude end */}
        {/* Affirmation  */}
        <Route path="/affirmation" element={<Affirmation />} />
        <Route
          path="/affirmationm/add-affirmationn"
          element={<AddAffirmation />}
        />
        <Route
          path="/affirmationn/edit-affirmationn"
          element={<EditAffirmation />}
        />
        <Route
          path="/affirmation/affirmation-detail/:id"
          element={<AffirmationDetail />}
        />
        {/* Affirmation end */}
        {/* /affirmation-categories */}
        <Route
          path="/affirmations-categories"
          element={<AffirmationCategories />}
        />
        <Route
          path="/affirmations-categories/add-category"
          element={<AddAffirmationCategory />}
        />
        <Route
          path="/affirmations-categories/edit-category"
          element={<EditAffirmationCategory />}
        />
        {/* /affirmation-categories end */}
        {/* PaymentTransactions */}
        <Route
          path="/payment-transactions"
          element={<PaymentTransactionsList />}
        />
        <Route path="/stripe-products" element={<StripeProductsList />} />
        <Route
          path="/stripe-products/add-product"
          element={<AddStripeProduct />}
        />
        <Route
          path="/stripe-products/edit-product/:id"
          element={<EditStripeProduct />}
        />
        {/* PaymentTransactions end */}
        {/* PaymentTemplateList  */}
        <Route path="/payment-templates" element={<PaymentTemplateList />} />
        <Route
          path="/website-pages/payment-plans/edit-payment-plan/:id"
          element={<EditPaymentPlan />}
        />
        <Route
          path="/payment-template/add-template"
          element={<AddPaymentTemplate />}
        />
        <Route
          path="/payment-template/edit-template/:id"
          element={<EditPaymentTemplate />}
        />
        {/* PaymentTemplateList end  */}
        {/* PaymentRequest   */}
        <Route path="/payment-requests" element={<PaymentRequestList />} />
        <Route
          path="/payment-request/add-payment-request"
          element={<AddPaymentRequests />}
        />
        <Route
          path="/payment-request/payment-request-detail"
          element={<PaymentRequestInfo />}
        />
        <Route
          path="/payment-request/edit-payment-request/:id"
          element={<EditPaymentRequests />}
        />
        {/* PaymentRequest end   */}
        {/* Calendar    AddCalendarGroup*/}
        <Route path="/calendar-groups" element={<CalendarGroupsList />} />
        <Route
          path="/calendar-groups/group-detail/:id"
          element={<CalendarGroupDetail />}
        />
        <Route
          path="/calendar-groups/add-group"
          element={<AddCalendarGroup />}
        />
        <Route
          path="/calendar-groups/edit-group/:id"
          element={<EditCalendarGroup />}
        />
        {/*Calendar end  */}
        {/*DepartmentList   */}
        <Route path="/departments" element={<DepartmentList />} />
        <Route
          path="/departments/add-department"
          element={<AddDepartments />}
        />
        <Route
          path="/departments/edit-department/:id"
          element={<EditDepartments />}
        />
        {/*DepartmentList end  */}
        {/*SupportTicket   */}
        <Route path="/support-tickets" element={<SupportTicket />} />
        <Route
          path="/support-ticket/detail/:id"
          element={<SupportTicketDetail />}
        />
        {/*SupportTicket end  */}
        {/*Calendarpods  */}
        <Route path="/meetings" element={<CalendarPodsList />} />
        <Route path="/calendarEvents" element={<Calenders />} />
        <Route path="/calendarEvents/event-list" element={<ListEvents />} />
        <Route path="/calendar/event-detail" element={<EventDetailList />} />
        <Route path="/meetings/add-meeting" element={<AddCalendarPods />} />
        <Route
          path="/meetings/edit-meeting/:id"
          element={<EditCalendarPods />}
        />
        <Route
          path="/meetings/meeting-detail/:id"
          element={<CalendarPodsDetail />}
        />
        <Route
          path="/meetings/add-meeting-user/:id"
          element={<AddAutomatedRoomUser />}
        />
        <Route
          path="/meetings/edit-meeting-user/:id"
          element={<EditAutomatedRoomUser />}
        />
        {/*Calendarpods  end*/}
        {/* /general-setting */}
        <Route path="/general-setting" element={<UpdateGeneralSetting />} />
        <Route path="/client-dashboard" element={<ClientDashboardSetting />} />
        <Route path="/invoice-setting" element={<InvoiceSetting />} />
        <Route path="/content-setting" element={<UpdateContentSetting />} />
        <Route path="/website-events" element={<WebPageEvents />} />
        <Route path="/website-events/add-event" element={<AddWebPageEvent />} />
        {/* <Route
          path="/dynamite-events/:event_id/general-events/add-event"
          element={<AddWebPageEvent />}
        /> */}
        <Route
          path="/dynamite-events/:dynamite_event_id/general-events/add-event"
          element={<AddOrUpdateGeneralEvents />}
        />
        <Route
          path="/website-events/edit-event/:id"
          element={<EditWebPageEvent />}
        />
        <Route
          path="/dynamite-events/:event_id/general-events/:id"
          element={<EditWebPageEvent />}
        />
        {/* <Route path="/dynamite-events" element={<DynamiteEventsList />} /> */}
        {/* <Route
          path="/dynamite-events/:dynamite_event_id/general-events"
          element={<WebPageEvents />}
        /> */}
        <Route
          path="/dynamite-events/:event_id/members"
          element={<EventMembers />}
        />
        <Route
          path="/dynamite-events/:event_id/add-members"
          element={<AddEventMembers />}
        />
        <Route
          path="/dynamite-events/:event_id/members/:member_id"
          element={<EditDynamiteEventMember />}
        />
        {/* <Route
          path="/dynamite-events/add-event"
          element={<AddDynamiteEvent />}
        /> */}
        <Route
          path="/dynamite-events/edit-event/:id"
          element={<EditDynamiteEvent />}
        />
        <Route
          path="/dynamite-event-categories/:event_id"
          element={<DynamiteEventsCategories />}
        />
        <Route
          path="/dynamite-event-categories/:event_id/add-category"
          element={<AddDynamiteEventCategory />}
        />
        <Route
          path="/dynamite-event-categories/:event_id/edit-category/:id"
          element={<EditDynamiteEventCategory />}
        />
        <Route
          path="/dynamite-event-videos/:event_id/:category_id"
          element={<DynamiteEventCategoryVideos />}
        />
        <Route
          path="/dynamite-event-videos/:event_id/:category_id/add-video"
          element={<AddDynamiteEventCategoryVideo />}
        />
        <Route
          path="/dynamite-event-videos/:event_id/:category_id/edit-video/:id"
          element={<EditDynamiteEventCategoryVideo />}
        />
        {/* ConsultantGeneralSetting */}
        <Route path="/send-grid" element={<AddSendGrid />} />
        <Route path="/stripe-setting" element={<AddStripeSetting />} />
        <Route path="/email-setting" element={<EmailSetting />} />
        <Route path="/default-setting" element={<DefaultSetting />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path="/campaign-setting" element={<AddCompaignSetting />} />
        <Route
          path="/email-templates/preview/:id"
          element={<EmailTemplatePreview />}
        />
        <Route
          path="/email-templates/edit-temail-emplate/:id"
          element={<EditEmailTemplate />}
        />
        {/* media section */}
        {/* <Route path="/media-section" element={<MediaSectionList />} /> */}
        <Route path="/media-section" element={<MediaSections />} />
        <Route path="/media-section/add-media" element={<AddMediaSection />} />
        <Route
          path="/media-section/edit-media/:id"
          element={<EditMediaSection />}
        />
        {/* success product */}
        <Route path="/success-product" element={<SuccessProductList />} />
        <Route
          path="/success-product/add-product"
          element={<AddSuccessProduct />}
        />
        <Route
          path="/success-product/edit-product/:id"
          element={<EditSuccessProduct />}
        />
        <Route
          path="/consultants-general-setting"
          element={<UpdateConsultantGeneralSetting />}
        />
        <Route
          path="/programmes/programm_recording_detail/:id"
          element={<ProgrammRecordingDetail />}
        />
        <Route path="/goal_statement" element={<GoalStatement />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/pods" element={<Pods />} />
        <Route path="/affirmations" element={<Affirmations />} />
        <Route
          path="/affirmations/affirmationList"
          element={<AffirmationList />}
        />
        <Route path="/gratitude" element={<Gratitude />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/memories/memoriesdetails" element={<MemoriesDetails />} />
        <Route path="/daily_activities" element={<DailyActivities />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/admin-videos" element={<AdminVideos />} />
        <Route
          path="/admin-videos/add-admin-videos"
          element={<AddAdminVideos />}
        />
        <Route
          path="/admin-videos/edit-admin-videos"
          element={<EditAdminVideos />}
        />
        <Route
          path="/client-portal-videos/edit-client-videos"
          element={<EditClientVideos />}
        />
        <Route
          path="/admin-videos/admin-videos-detail/:id"
          element={<AdminVideoDetail />}
        />
        <Route path="/client-portal-videos" element={<ClientVideos />} />
        <Route
          path="/client-portal-videos/add-client-videos"
          element={<AddClientVideos />}
        />
        <Route
          path="/client-portal-videos/client-videos-detail/:id"
          element={<ClientVideoDetail />}
        />
        {/* Growth Tools */}
        <Route path="/daily-gratitude" element={<DailyGratitude />} />
        <Route path="/daily-gratitude-add" element={<AddorUpdateGratitude />} />
        <Route
          path="/daily-gratitude-edit/:id"
          element={<AddorUpdateGratitude />}
        />
        <Route path="/books" element={<BooksModule />} />
        <Route path="/books/add-book" element={<AddBook />} />
        <Route path="/books/manage-tags" element={<TagsList />} />
        <Route path="/books/book-detail/:id" element={<BookDetail />} />
        <Route path="/books/:slug/edit-book" element={<EditBook />} />
        <Route path="/daily-affirmation" element={<DailyGratitude />} />
        <Route path="/daily-meditation" element={<DailyGratitude />} />
        <Route path="/meditation-videos" element={<MeditationVideos />} />
        {/* ************************<usetionmaire Module start>********************* */}
        {/* <Route path="/books" element={<BooksModule />} /> */}
        {/* <Route path="/books" element={<BooksModule />} /> */}
        {/* <Route path="/books" element={<BooksModule />} /> */}
        {/* <Route path="/books" element={<BooksModule />} /> */}
        {/* <Route path="/books" element={<BooksModule />} /> */}
        {/* <Route path="/books" element={<BooksModule />} /> */}
        {/* ************************<usetionmaire Module end>********************* */}
        <Route
          path="/meditation-videos-detail/:id"
          element={<MeditaionVideoDetail />}
        />
        <Route
          path="/meditation-videos-add"
          element={<AddOrUpdateMeditation />}
        />
        <Route
          path="/meditation-videos-edit/:id"
          element={<AddOrUpdateMeditation />}
        />
        <Route path="/affirmation-list" element={<ListAffirmation />} />
        <Route path="/affirmation-add" element={<AddOrUpdateAffirmations />} />
        <Route
          path="/affirmation-edit/:id"
          element={<AddOrUpdateAffirmations />}
        />
        <Route path="/challenges" element={<ChallengesList />} />
        <Route path="/challenge-detail/:id" element={<ChallengeDetail />} />
        <Route path="/challenge-add" element={<AddOrUpdateChallenges />} />
        <Route path="/challenge-edit/:id" element={<AddOrUpdateChallenges />} />
        <Route
          path="/challenge-resources/:id"
          element={<ChallengeResources />}
        />
        <Route
          path="/challenge/:id/challenge-resources-add"
          element={<AddOrUpdateChallengeResources />}
        />
        <Route
          path="/challenge/:id/challenge-resources-edit/:resource_id"
          element={<AddOrUpdateChallengeResources />}
        />
        <Route
          path="/challenge-recordings/:id"
          element={<ChallengeRecordings />}
        />
        <Route
          path="/challenge/:id/challenge-recording-add"
          element={<AddOrUpdateChallengeRecordings />}
        />
        <Route
          path="/challenge/challenge-recording-detail/:id"
          element={<ChallengeRecordingDetail />}
        />
        <Route
          path="/challenge/:id/challenge-recording-edit/:resource_id"
          element={<AddOrUpdateChallengeRecordings />}
        />
        <Route path="/vision-board" element={<DailyGratitude />} />
        <Route path="/magic-moments" element={<DailyGratitude />} />
        <Route path="/goal-settings" element={<GoalSettings />} />
        <Route path="/books" element={<DailyGratitude />} />
      </Route>
      <Route element={<LogoOnlyLayout />}>
        <Route path="/" element={<Authentication />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="404" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget_password" element={<ForgetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
