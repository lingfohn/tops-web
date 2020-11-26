// const api = {
//   Login: '/auth/login',
//   Logout: '/auth/logout',
//   ForgePassword: '/auth/forge-password',
//   Register: '/auth/register',
//   twoStepCode: '/auth/2step-code',
//   SendSms: '/account/sms',
//   SendSmsErr: '/account/sms_err',
//   // get my info
//   UserInfo: '/user/info',
// }
import * as auth from './auth/users'
import * as cicd from './cicd/cicd'
export default {
  auth,
  cicd,
}
