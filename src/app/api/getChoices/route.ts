import { NextRequest, NextResponse } from "next/server";
import getChoices from "@/actions/getChoices";

export async function GET(request: NextRequest) {
  const results = await getChoices();

  return NextResponse.json(results);
}
