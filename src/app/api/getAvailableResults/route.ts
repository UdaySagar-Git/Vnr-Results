import { NextRequest, NextResponse } from "next/server";
import getAvailableResults from "@/actions/getAvailableResults";

export async function GET(request: NextRequest) {
  const results = await getAvailableResults();

  return NextResponse.json(results);
}
