// app/api/users/by-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { userDAL } from "@/app/server/dal/user.dal";
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
            { success: false, error: "Unauthorized" },
        );
    }

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: "email is required" },
        );
    }

    const user = await userDAL.findByEmail(email.toLowerCase());
    if (!user) {
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: "User not found" },
        );
    }

    const dto: UserLookupDTO = {
        id: user.id,
        name: user.name ?? null,
        email: user.email,
    };

    return NextResponse.json<ApiResponse<UserLookupDTO>>({
        success: true,
        data: dto,
    });
}
