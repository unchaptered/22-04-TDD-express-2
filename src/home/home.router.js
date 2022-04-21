import { Router } from "express";
import { testPath, notFoundPath } from "./heom.controller";

const homeRouter = Router();

homeRouter
    .route('/')
    .all(testPath);

homeRouter
    .route('/:id')
    .all(notFoundPath);

export default homeRouter;