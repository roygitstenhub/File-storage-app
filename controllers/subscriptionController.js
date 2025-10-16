import Razorpay from "razorpay"
import Subscription from "../model/subscriptionModel.js"

// const rzpInstance = new Razorpay({
//     key_id: 'rzp_live_RTmKzOwehd8NPJ',
//     key_secret: 'wLLJvFP0jgq3yKaLjac71zXp'
// })

const rzpInstance = new Razorpay({
  key_id: 'rzp_test_RHNyUJ5BVo08HK',
  key_secret: 'jYILQ6BVJiqAG5jh22CGhzXq'
})


export const createSubscription = async (req, res, next) => {
    try {
        const newSubscription = await rzpInstance.subscriptions.create({
            plan_id: req.body.planId,
            total_count: 120,
            notes : {
                userId : req.user._id
            }
        })

       const subscription = new Subscription({
            razorpaySubscriptionId : newSubscription.id,
            userId: req.user._id
        })
        await subscription.save();
        
        res.json({
            subscriptionId : newSubscription.id
        })
    } catch (error) {
        next(error)
    }
}