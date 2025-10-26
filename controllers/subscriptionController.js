import Razorpay from "razorpay"
import Subscription from "../model/subscriptionModel.js"

// const rzpInstance = new Razorpay({
//     key_id: process.env.RAZORPAY_LIVE_KEY_ID,
//     key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET
// })

const rzpInstance = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET
})


export const createSubscription = async (req, res, next) => {
    try {
        const newSubscription = await rzpInstance.subscriptions.create({
            plan_id: req.body.planId,
            total_count: 120,
            notes: {
                userId: req.user._id
            }
        })

        const subscription = new Subscription({
            razorpaySubscriptionId: newSubscription.id,
            userId: req.user._id
        })
        await subscription.save();

        res.json({
            subscriptionId: newSubscription.id
        })
    } catch (error) {
        next(error)
    }
}