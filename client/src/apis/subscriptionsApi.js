import { axiosWithCreds } from "./AxiosInstance.js";


export const createSubscription = async (planId) => {
    const { data } = await axiosWithCreds.post("/subscriptions",{ planId })
    return data
}