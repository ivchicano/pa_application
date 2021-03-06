import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchUser (tenant) {
    console.log(tenant)
    return axiosInstance
      .get('/backend/1.0.0/users?filter[include][0][relation]=attributes&filter[include][1][relation]=interventionPlans&filter[where][and][0][umUserName][neq]=admin&filter[where][and][1][umTenantId]=' + tenant)
      .then(response => { return response.data })
      .catch(error_handler);
  },
}
