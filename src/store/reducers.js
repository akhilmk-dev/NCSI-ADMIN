import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

// users
import User from "./Users/reducer"

// roles
import Role from "./Roles/reducer"

//sliders
import Slider from "./Slider/reducer"

//Events
import Event from "./Events/reducer"

//Publications
import Publication from "./Publications/reducer"

// classifications
import Classification from "./Classifications/reducer"

// populations
import Population from "./Populations/reducer"

// indicators
import Indicator from "./Indicator/reducer"

// surveys
import Survey from "./Survey/reducer"

//feedbacks
import Feedback from "./feedbacks/reducer"

//News
import News from "./News/reducer"

// Achievements
import Achievement from "./Achievements/reducer"

// Organizationcharts
import OrganizationChart from "./OrganizationChart/reducer"

// cmspages
import CmsPage from "./CmsPages/reducer"

// statistics
import Statistics from "./Statistics/reducer"

// guide classificaions
import GuideClassification from "./GuideClassifications/reducer"

// methodologies 
import Methodologies from "./Methodologies/reducer"

// survey liscences
import SurveyLicense from "./SurveyLiscences/reducer"

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  User,
  Role,
  Slider,
  Event,
  Publication,
  Classification,
  Population,
  Indicator,
  Survey,
  Feedback,
  News,
  Achievement,
  OrganizationChart,
  CmsPage,
  Statistics,
  GuideClassification,
  Methodologies,
  SurveyLicense
})

export default rootReducer
