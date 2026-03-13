import { onRequestOptions as __api_ranklist_ts_onRequestOptions } from "D:\\Yule\\hok\\hok-honor-ranklist\\functions\\api\\ranklist.ts"
import { onRequestPost as __api_ranklist_ts_onRequestPost } from "D:\\Yule\\hok\\hok-honor-ranklist\\functions\\api\\ranklist.ts"

export const routes = [
    {
      routePath: "/api/ranklist",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_ranklist_ts_onRequestOptions],
    },
  {
      routePath: "/api/ranklist",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_ranklist_ts_onRequestPost],
    },
  ]