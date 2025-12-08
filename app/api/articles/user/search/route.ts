// app/api/users/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/dto";

type UserLookupDTO = {
    id: string;
    name: string | null;
    email: string;
};

async function getSession() {
    return auth.api.getSession({ headers: await headers() });
}

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: "Unauthorized" }
        );
    }

    const url = req.nextUrl;
    const query = url.searchParams.get("query") ?? "";
    const limitParam = url.searchParams.get("limit");
    const limit = Math.min(
        20,
        Math.max(1, limitParam ? Number(limitParam) || 10 : 10)
    );

    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
        // small optimization: for very short input just return empty suggestions
        return NextResponse.json<ApiResponse<UserLookupDTO[]>>({
            success: true,
            data: [],
        });
    }

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: trimmed } },
                { name: { contains: trimmed } },
            ],
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
        take: limit,
    });

    const data: UserLookupDTO[] = users.map((u) => ({
        id: u.id,
        name: u.name ?? null,
        email: u.email,
    }));

    return NextResponse.json<ApiResponse<UserLookupDTO[]>>({
        success: true,
        data,
    });
}
