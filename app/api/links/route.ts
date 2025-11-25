import { getLinks, insertUrl } from "@/lib/db/link";
import { linkSchema } from "@/lib/validation/link.schema";
import { checkUrlSafety } from "@/lib/validation/malvare.validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // * validation

    const json = await req.json();

    const data = linkSchema.safeParse(json);

    if (!data.success) {
      const errs = data.error.issues.map((m) => {
        return { name: m.path[0], message: m.message };
      });

      return NextResponse.json(
        {
          success: false,
          message: "Please check the details",
          errs,
        },
        { status: 400 }
      );
    }

    // * Make sync with the database check the url precheck

    // * Take the code from frontend it is easy to generate and get it to save backend run time

    // * Detect the malecious url like 18+ websites and suspecious websites etc..,

    /**
     ** This is taking so much time in order to complete the website verification
     */

    const isSafeUrl: boolean = await checkUrlSafety(data.data.url); // for google

    if (!isSafeUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "url",
          message: "Malicious website",
        },
        { status: 403 }
      );
    }

    // * if not malicious we can proceed with inserting into database

    const createCode = await insertUrl(data.data.url);

    if (!createCode.success && data === null) {
      // * Return to frontend to create new nonse/Hash/Code d

      return NextResponse.json(
        {
          success: false,
          message: "Code already exists",
          error: "code",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { data: createCode, success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}

export async function GET() {
  try {
    /**
     * Get all links data here
     */
    //  We can also do some caching here but for now we can fetch over this and get back to the user

    const links = await getLinks();

    return NextResponse.json(
      {
        success: true,
        links,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}
