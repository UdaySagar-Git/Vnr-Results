import db from "@/utils/db";
import redis from "@/utils/redis";

const getStudents = async (classes: any) => {
  const cacheKey = `students:${classes.map((cls: any) => cls.id).join(",")}`;

  const cachedStudents = await redis.get(cacheKey);
  if (cachedStudents) {
    return cachedStudents;
  }

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

  await redis.set(cacheKey, students, { ex: 2592000 }); // 30 days

  return students;
};

export default getStudents;
