import { NextRequest, NextResponse } from "next/server";
import getResultsById from "@/actions/getResultsById";

export async function POST(request: NextRequest) {
  const { students, examId } = await request.json();

  const results = await Promise.all(
    students.map(async (student: any) => {
      const result = await getResultsById(student.rollNumber, examId);
      const { id, ...studentData } = student;
      return {
        student: studentData,
        result,
      };
    })
  );

  if (!results) {
    return NextResponse.json({ message: "No results found" }, { status: 404 });
  }
  //todo : fetch from db if already exists
  // try {
  //   await db.result.createMany({
  //     data: results.map(({ student, result }) => ({
  //       studentId: student.id,
  //       examId : Number(examId),
  //       result,
  //     })),
  //   });
  // }catch (error) {
  //   console.error(error);
  // }

  return NextResponse.json(results);
}
