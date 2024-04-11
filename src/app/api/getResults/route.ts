import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/db";
import getResultsById from "@/actions/getResultsById";

export async function POST(request: NextRequest) {
  const { classes, examId } = await request.json();
  // console.log(classes, examId);
  const students = await db.student.findMany({
    where: {
      classId: {
        in: classes.map((cls: any) => cls.id),
      },
    },
    select: {
      name: true,
      rollNumber: true,
      class: {
        select: {
          branch: true,
          section: true,
        },
      },
    },
  });


  const results = await Promise.all(
    students.map(async (student: any) => {
      const result = await getResultsById(student.rollNumber, examId);
      return {
        student,
        result,
      };
    })
  );

  return NextResponse.json(results);
}
