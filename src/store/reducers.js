import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

// categories
import Category from "./Categories/reducer"

// Notification list 
import Notification from "./Notification/reducer"

// users
import User from "./Users/reducer"

// customers
import Customer from "./Customers/reducer"

// permissions
import Permission from "./Permissions/reducer"

// roles
import Role from "./Roles/reducer"

//addresses
import Address from "./Address/reducer"

// branches
import Branch from "./branch/reducer"

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

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  Category,
  Notification,
  User,
  Customer,
  Permission,
  Role,
  Address,
  Branch,
  Slider,
  Event,
  Publication,
  Classification,
  Population,
  Indicator,
  Survey,
  Feedback,
  News
})

export default rootReducer
