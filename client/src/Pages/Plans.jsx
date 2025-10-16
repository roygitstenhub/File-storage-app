import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createSubscription } from "../apis/subscriptionsApi.js";


const PLAN_CATALOG = {
    monthly: [
        {
            // id: "plan_RTl83rOmJ6LdY1",
            id:"plan_RTnFndkGQ9ieBL",
            name: "Starter",
            tagline: "Great for individuals",
            storage: "2 TB",
            price: 199,
            period: "/mo",
            cta: "Choose 2 TB",
            features: [
                "Secure cloud storage",
                "Link & folder sharing",
                "Basic support",
            ],
            popular: false,
        },
        {
            // id: "plan_RTlAOfqDoJ11Er",
            id:"plan_RU2EeS9KuIyxtI",
            name: "Pro",
            tagline: "For creators & devs",
            storage: "5 TB",
            price: 399,
            period: "/mo",
            cta: "Choose 5 TB",
            features: ["Everything in Starter", "Priority uploads", "Email support"],
            popular: true,
        },
        {
            // id: "plan_RTlCOT1hEXTt2Q",
            id:"plan_RU2FqRlehR80HV",
            name: "Ultimate",
            tagline: "Teams & power users",
            storage: "10 TB",
            price: 699,
            period: "/mo",
            cta: "Choose 10 TB",
            features: ["Everything in Pro", "Version history", "Priority support"],
            popular: false,
        },
    ],
    yearly: [
        {
            // id: "plan_RTlDu4wK2PRRMm",
            id:"plan_RU2DljivO8E8vA",
            name: "Starter",
            tagline: "Great for individuals",
            storage: "2 TB",
            price: 1999,
            period: "/yr",
            cta: "Choose 2 TB",
            features: [
                "Secure cloud storage",
                "Link & folder sharing",
                "Basic support",
            ],
            popular: false,
        },
        {
            // id: "plan_RTlElZtCFflEvO",
            id:"plan_RU2F6NNX8Hugfj",
            name: "Pro",
            tagline: "For creators & devs",
            storage: "5 TB",
            price: 3999,
            period: "/yr",
            cta: "Choose 5 TB",
            features: ["Everything in Starter", "Priority uploads", "Email support"],
            popular: true,
        },
        {
            // id: "plan_RTlGTFj1TNAg4m",
            id:"plan_RU2GLwVTm4vH3N",
            name: "Ultimate",
            tagline: "Teams & power users",
            storage: "10 TB",
            price: 6999,
            period: "/yr",
            cta: "Choose 10 TB",
            features: ["Everything in Pro", "Version history", "Priority support"],
            popular: false,
        },
    ],
};

function classNames(...cls) {
    return cls.filter(Boolean).join(" ");
}

function Price({ value }) {
    return (
        <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-slate-700">₹</span>
            <span className="text-4xl font-bold tracking-tight text-slate-900">
                {value}
            </span>
        </div>
    );
}

function PlanCard({ plan, onSelect }) {
    return (
        <div
            className={classNames(
                "relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition",
                "hover:shadow-md",
                plan.popular
                    ? "border-[#6A4BFF] ring-1 ring-blue-500/20"
                    : "border-slate-200"
            )}
        >
            {plan.popular && (
                <div className="absolute -top-2 right-4 select-none rounded-full bg-[#6A4BFF] px-2 py-0.5 text-xs font-medium text-white shadow">
                    Most Popular
                </div>
            )}

            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.tagline}</p>
                </div>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                    {plan.storage}
                </span>
            </div>

            <div className="mb-4 flex items-end gap-2">
                <Price value={plan.price} />
                <span className="mb-[6px] text-sm text-slate-500">{plan.period}</span>
            </div>

            <ul className="mb-5 space-y-2 text-sm text-slate-600">
                {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <svg
                            className="mt-0.5 h-4 w-4 flex-none"
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                        >
                            <path
                                d="M5 13l4 4L19 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>{f}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => onSelect?.(plan)}
                className={classNames(
                    "mt-auto cursor-pointer inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2",
                    plan.popular
                        ? "bg-[#6A4BFF] text-white hover:bg-[#795eff] focus:ring-[#6A4BFF]"
                        : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900"
                )}
            >
                {plan.cta}
            </button>
        </div>
    );
}

export default function Plans() {
    const [mode, setMode] = useState("monthly");
    const plans = PLAN_CATALOG[mode];

    useEffect(() => {
        const razorpayScript = document.querySelector('#razorpay-script')
        if (razorpayScript) return
        const script = document.createElement('script')
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        script.id = 'razorpay-script'
        document.body.appendChild(script)
    }, [])

    async function handleSelect(plan) {
        const { subscriptionId } = await createSubscription(plan.id)
        razorpayPopUp({ subscriptionId })
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Choose your plan
                </h1>
                <Link to="/">Home</Link>
            </header>

            {/* Tabs */}
            <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm">
                <button
                    onClick={() => setMode("monthly")}
                    className={classNames(
                        "rounded-lg px-4 py-2 text-sm font-medium border-2 cursor-pointer",
                        mode === "monthly" ? "border-[#6A4BFF]" : "border-white"
                    )}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setMode("yearly")}
                    className={classNames(
                        "rounded-lg px-4 py-2 text-sm font-medium border-2 cursor-pointer",
                        mode === "yearly" ? "border-[#6A4BFF]" : "border-white"
                    )}
                >
                    Yearly{" "}
                    <span className="ml-1 hidden text-xs text-[#6A4BFF] sm:inline">
                        (2 months off)
                    </span>
                </button>
            </div>

            {/* Cards grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <PlanCard
                        key={`${mode}-${plan.id}`}
                        plan={plan}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            {/* Small helper text */}
            <p className="mt-6 text-xs text-slate-500">
                Prices are indicative for demo. Integrate with Razorpay Subscriptions to
                start billing. You can prefill the plan IDs inside a static config.
            </p>
        </div>
    );
}

function razorpayPopUp({ subscriptionId }) {

    var rzp1 = new Razorpay({
        // key: "rzp_live_RTmKzOwehd8NPJ",
        key:"rzp_test_RHNyUJ5BVo08HK",
        currency: "INR",
        name: "StorageApp Labs", //your business name
        description: "subscription in test",
        image: "https://example.com/your_logo",
        subscription_id: subscriptionId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        // notes: {
        //   courseId: course.id,
        //   courseName: course.name,
        // },
        handler: async function (response) {
            console.log(response)
        }
    });

    rzp1.on("payment.failed", function (response) {
        console.log(response)
    })
    rzp1.open()
}
