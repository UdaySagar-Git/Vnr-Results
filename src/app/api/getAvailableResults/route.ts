import getAvailableResults from "@/actions/getAvailableResults";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {

  const data = await getAvailableResults();

  return NextResponse.json(data);
}
