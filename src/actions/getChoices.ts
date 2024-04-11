import db from "@/utils/db";

const getChoices = async () => {
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

  return classes;
};

export default getChoices;
