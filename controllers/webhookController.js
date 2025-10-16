import Razorpay from "razorpay";
import Subscription from "../model/subscriptionModel.js";
import User from "../model/userModel.js";

export const PLANS = {
    plan_RTnFndkGQ9ieBL: {
        storageQuotaBytes: 2 * 1024 ** 3,
    },
    plan_RU2DljivO8E8vA: {
        storageQuotaBytes: 2 * 1024 ** 3,
    },
    plan_RU2EeS9KuIyxtI: {
        storageQuotaBytes: 5 * 1024 ** 3,
    },
    plan_RU2F6NNX8Hugfj: {
        storageQuotaBytes: 5 * 1024 ** 3,
    },
    plan_RU2FqRlehR80HV: {
        storageQuotaBytes: 10 * 1024 ** 3,
    },
    plan_RU2GLwVTm4vH3N: {
        storageQuotaBytes: 10 * 1024 ** 3,
    },
};

export const handleRazorpayWebhook = async (req, res) => {
    const signature = req.headers["x-razorpay-signature"]
    const isSignatureValid = Razorpay.validateWebhookSignature(
        JSON.stringify(req.body), 
        signature, 
        process.env.RAZORPAY_WEBHOOK_SECRET)

    if (isSignatureValid) {
        console.log("Signature verified")
        if (req.body.event === "subscription.activated") {
            const rzpSubscription = req.body.payload.subscription.entity
            const planId = rzpSubscription.plan_id
            const subscription = await Subscription.findOne({
                razorpaySubscriptionId: rzpSubscription.id
            })
            subscription.status = rzpSubscription.status
            await subscription.save()
            const storageQuotaBytes = PLANS[planId].storageQuotaBytes
            const user = await User.findById(subscription.userId)
            user.maxStorageInBytes = storageQuotaBytes
            await user.save()
            console.log("subscription activated")
        }
    } else {
        console.log("Signature not verified")
    }
    res.send("ok")
}