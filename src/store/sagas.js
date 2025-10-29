import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import categorySaga from "./Categories/saga"
import NotificationSaga from "./Notification/saga"
import UserSaga from "./Users/saga"
import CustomerSaga from "./Customers/saga"
import PermissionSaga from "./Permissions/saga"
import Roles from "./Roles/saga"
import AddressSaga from "./Address/saga"
import BranchSaga from "./branch/saga"
import SliderSaga from "./Slider/saga"
import EventSaga from "./Events/saga"
import PublicationSaga from "./Publications/saga"
import ClassificationSaga from "./Classifications/saga"
import PopulationSaga from "./Populations/saga"
import IndicatorSaga from "./Indicator/saga"
import SurveySaga from "./Survey/saga"
import FeedbackSaga from "./feedbacks/saga"
import NewsSaga from "./News/saga"
import AchievementSaga from "./Achievements/saga"
import OraganizationSaga from "./OrganizationChart/saga"
import CmsPageSaga from "./CmsPages/saga"

export default function* rootSaga() {
  yield all([
    //public
    AccountSaga(),
    fork(AuthSaga),
    ProfileSaga(),
    ForgetSaga(),
    LayoutSaga(),
    categorySaga(),
    NotificationSaga(),
    UserSaga(),
    CustomerSaga(),
    PermissionSaga(),
    Roles(),
    AddressSaga(),
    BranchSaga(),
    SliderSaga(),
    EventSaga(),
    PublicationSaga(),
    ClassificationSaga(),
    PopulationSaga(),
    IndicatorSaga(),
    SurveySaga(),
    FeedbackSaga(),
    NewsSaga(),
    AchievementSaga(),
    OraganizationSaga(),
    CmsPageSaga()
  ])
}
