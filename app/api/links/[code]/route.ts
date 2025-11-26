import { deleteLink, findLinkStats, getLink } from "@/lib/db/link";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = await params; // await should be ther vs code errors are not always correct

    if (code.trim() === "") {
      return NextResponse.json(
        {
          error: "code is not found",
          success: false,
        },
        { status: 400 }
      );
    }

    const data = await getLink(code);

    if (!data.success) {
      return NextResponse.json({ data, success: true }, { status: 403 });
      // we can redirect this to main page if not there
    }

    // For link stats

    const linkStats = await findLinkStats(code);

    return NextResponse.json(
      { data, success: true, stats: linkStats },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = await params; // await should be ther vs code errors are not always correct

    if (code.trim() === "") {
      return NextResponse.json(
        {
          error: "code is not found",
          success: false,
        },
        { status: 400 }
      );
    }

    const data = await deleteLink(code);

    if (!data.success) {
      return NextResponse.json(
        { message: "Not found / Already deleted", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: data.success, message: "Deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
