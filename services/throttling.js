
function throttle(waitTime = 1000) {
    const throttleData = {};
    return (req, res, next) => {
        const now = Date.now();
        const { previousDelay, lastRequestTime } = throttleData[req.ip] || {
            previousDelay: 0,
            lastRequestTime: now - waitTime,
        };

        const timePassed = now - lastRequestTime;
        const delay = Math.max(0, waitTime + previousDelay - timePassed);

        throttleData[req.ip] = {
            previousDelay: delay,
            lastRequestTime: now,
        };

        setTimeout(next, delay);
    };
}

export default throttle