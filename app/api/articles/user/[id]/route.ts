import { NextRequest } from "next/server";
import { updateArticleController } from "@/app/server/controllers/article.controller";

export async function PUT(req: NextRequest) {
    return updateArticleController(req);
}
