import { JSDOM } from "jsdom";

const getAvailableResults = async () => {
  const data = await fetch("https://vnrvjietexams.net/eduprime3exam/results/");
  const html = await data.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const table = document.querySelector("#exmlst table");
  const rows = table?.querySelectorAll("tr");
  const results = [];
  if (rows) {
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const columns = row.querySelectorAll("td");
      const examIdElement = columns[0].querySelector("a");
      const examId = examIdElement?.getAttribute("data-id") ?? "No data found";
      results.push({
        name: columns[0].textContent?.trim() ?? "No data found",
        examId: examId,
        resultsReleasedOn: columns[1].textContent?.trim() ?? "No data found",
        lastDateOfRCRV: columns[2].textContent?.trim() ?? "No data found",
      });
    }
  } else {
    results.push({ error: "No data found" });
  }

  return results;
};

export default getAvailableResults;