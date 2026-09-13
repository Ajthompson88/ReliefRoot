import type { RequestHandler } from "express";

import type { getAuthenticatedUser } from "../services/auth.service.js";
import { assertCultivarWriteAccess } from "../services/cultivar.service.js";

type AuthenticatedLocals = {
    user: Awaited<ReturnType<typeof getAuthenticatedUser>>;
};

export const requireCultivarWriteAccess: RequestHandler<
    Record<string, string>,
    unknown,
    unknown,
    Record<string, string>,
    AuthenticatedLocals
> = (_req, res, next) => {
    assertCultivarWriteAccess(res.locals.user.role);
    next();
};
