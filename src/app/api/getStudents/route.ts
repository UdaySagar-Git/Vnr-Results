import { NextRequest, NextResponse } from "next/server";
import getStudents from "@/actions/getStudents";

export async function POST(request: NextRequest) {
  const { classes } = await request.json();

  const students = await getStudents(classes);

  return NextResponse.json(students);
}
