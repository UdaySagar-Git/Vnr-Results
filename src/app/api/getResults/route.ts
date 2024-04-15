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
      id: true,
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
