import db from "@/utils/db";

const getStudents = async (classes: any) => {
  const students = await db.student.findMany({
    where: {
      classId: {
        in: classes.map((cls: any) => cls.id),
      },
    },
    select: {
      // id: true,
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

  return students;
};

export default getStudents;
