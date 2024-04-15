import db from "@/utils/db";
import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";

const getResultsById = async (htno, examId) => {
  const url =
    "https://vnrvjietexams.net/eduprime3exam/Results/Results?htno=" +
    htno +
    "&examid=" +
    examId;
  const data = await fetch(url);
  const html = (await data.text()) as string;

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const table = document.querySelector(
    "body > table > tbody > tr > td > div > table:nth-child(3) > tbody"
  );
  const rows = table?.querySelectorAll("tr");

  const results = [];

  if (!rows) {
    return {
      sno: "--",
      subjectCode: "--",
      subjectTitle: "--",
      status: "--",
      grade: "--",
      gradePoints: "--",
      credits: "--",
      result: "--",
    };
  }

  for (let i = 1; i < rows.length - 3; i++) {
    const row = rows[i];
    const columns = row.querySelectorAll("td");
    results.push({
      sno: columns[0]?.textContent?.trim() ?? "--",
      subjectCode: columns[1]?.textContent?.trim() ?? "--",
      subjectTitle: columns[2]?.textContent?.trim() ?? "--",
      status: columns[3]?.textContent?.trim() ?? "--",
      grade: columns[4]?.textContent?.trim() ?? "--",
      gradePoints: columns[5]?.textContent?.trim() ?? "--",
      credits: columns[6]?.textContent?.trim() ?? "--",
      result: columns[7]?.textContent?.trim() ?? "--",
    });
  }

  const result = document.querySelector(
    "body > table > tbody > tr > td > div > table:nth-child(3) > tbody > tr:nth-child(12) > td > table > tbody > tr:nth-child(1) > td:nth-child(1)"
  );
  const status = document.querySelector(
    "body > table > tbody > tr > td > div > table:nth-child(3) > tbody > tr:nth-child(12) > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > b"
  );

  const sgpa = document.querySelector(
    "body > table > tbody > tr > td > div > table:nth-child(3) > tbody > tr:nth-child(12) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)"
  );
  const sgpaValue = document.querySelector(
    "body > table > tbody > tr > td > div > table:nth-child(3) > tbody > tr:nth-child(12) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > b"
  );

  results.push({
    sno: result?.textContent?.trim() ?? "--",
    subjectCode: "Total",
    subjectTitle: sgpa?.textContent?.trim() ?? "--",
    status: "--",
    grade: "--",
    gradePoints: sgpaValue?.textContent?.trim() ?? "--",
    credits: "--",
    result: status?.textContent?.trim() ?? "--",
  });
  return results;
};

export default getResultsById;
