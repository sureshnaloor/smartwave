import { NextRequest, NextResponse } from "next/server";
import { getBearerUser } from "@/lib/mobile-auth";
import { getPassById } from "@/lib/wallet/pass-helper";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/**
 * GET /api/mobile/passes/[id]
 * Authorization: Bearer <token>
 * Returns: pass details with isOwner flag
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get("authorization");
  const user = getBearerUser(authHeader);
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pass = await getPassById(params.id);
    if (!pass) {
      return NextResponse.json({ error: "Pass not found" }, { status: 404 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");

    // Check if current user is the owner
    let isOwner = false;
    const adminUser = await db.collection("adminusers").findOne({ email: user.email.toLowerCase() });
    if (adminUser && adminUser._id.toString() === pass.createdByAdminId.toString()) {
      isOwner = true;
    }

    const admin = await db.collection("adminusers").findOne({ _id: pass.createdByAdminId });
    const isAdminCorporate = !admin?.role || admin.role === "corporate";

    if (isAdminCorporate) {
      // Corporate passes are only visible to their own employees OR the owner
      if (isOwner) {
        return NextResponse.json({ pass, isOwner });
      }
      const dbUser = await db.collection("users").findOne({ email: user.email });
      if (dbUser?.role === "employee" && (dbUser as any).createdByAdminId) {
        if ((dbUser as any).createdByAdminId.toString() === pass.createdByAdminId.toString()) {
          return NextResponse.json({ pass, isOwner: false });
        }
      }
      return NextResponse.json(
        { error: "This corporate pass is only available to members of the respective organization." },
        { status: 403 }
      );
    }

    // For public passes, anyone can view if active OR if they are the owner
    if (pass.status === "active" || isOwner) {
      return NextResponse.json({ pass, isOwner });
    }

    return NextResponse.json({ error: "Pass is not available" }, { status: 403 });
  } catch (error) {
    console.error("[mobile passes/[id] GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
