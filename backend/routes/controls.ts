import type { Response, Request } from "express"

/**
 *
 * @param req
 * @param res
 **
 * @returns void (sends a response to a client)
 *
 */
export const get = async (req: Request, res: Response) => {

    res.sendFile('./html/controls.html', { root: '../frontend/' });

}