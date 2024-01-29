import type { Response, Request } from "express"

/**
 *
 * @param req
 * @param res
 *
 * This is the default method on the /api route.
 * It just shows a hello world message.
 *
 * @returns void (sends a response to a client)
 *
 */
export const get = async (req: Request, res: Response) => {

    res.json({
        Message: "Hello World!"
    });

}