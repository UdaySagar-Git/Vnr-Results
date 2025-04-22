import db from "@/utils/db";
import redis from "@/utils/redis";

const getChoices = async () => {
  const cachedChoices = await redis.get("choices");
  if (cachedChoices) {
    return cachedChoices;
  }

  const classes = await db.class.findMany({
    select: {
      id: true,
      accademicYear: {
        select: {
          startYear: true,
          endYear: true,
        },
      },
      branch: true,
      section: true,
      // _count: {
      //   select: {
      //     students: true,
      //   },
      // },
      // students: {
      //   select: {
      //     name: true,
      //     rollNumber: true,
      //   },
      // },
    },
  });

  await redis.set("choices", classes, { ex: 604800 }); // 7 days

  return classes;
};

export default getChoices;
