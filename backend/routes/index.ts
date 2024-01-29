import type { Response, Request } from "express"

/**
 *
 * @param req
 * @param res
 *
 * This is the default method on the / route.
 * It shows the index.html file in the /frontend directory, linked with its CSS and JS imports.
 *
 * @returns void (sends a response to a client)
 *
 */
export const get = async (req: Request, res: Response) => {

    res.sendFile('./html/index.html', { root: '../frontend/' });

}