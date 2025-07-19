import serverless from "serverless-http";
import { createNeonServer } from "../../server/neon-index";

export const handler = serverless(createNeonServer());
