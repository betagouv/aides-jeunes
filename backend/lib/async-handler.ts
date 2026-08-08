import { NextFunction, Request, RequestHandler, Response } from "express"

/*
 * Express 4 ignore la promesse renvoyée par un gestionnaire : le rejet d'un
 * gestionnaire `async` monté nu n'a personne pour le recevoir. La requête reste
 * pendante jusqu'au délai du client, et le processus signale un
 * `unhandledRejection`. Ce montage rend le rejet à la chaîne d'erreur d'Express.
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => unknown,
): RequestHandler {
  return (req, res, next) => {
    try {
      return Promise.resolve(handler(req, res, next)).catch(next)
    } catch (error) {
      // Un gestionnaire non asynchrone peut lever avant d'avoir rien renvoyé.
      next(error)
    }
  }
}
