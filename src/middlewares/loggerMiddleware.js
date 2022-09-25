

export const websocketLogger = (req, res, next) => {
    // console.log(req)
    /* message = {
        "url": req.url,
        "method": req.method,
        "headers": req.headers,
        "origin": req.origin,
    }
    req.message = req.message */
    console.log('Websocket connection established');
    next();
}