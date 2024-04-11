import getAvailableResults from "@/actions/getAvailableResults";
import Link from "next/link";

const page = async () => {
  const data = await getAvailableResults();
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Results</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                Exam Name
              </th>
              <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                Results Released On
              </th>
              <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                Last Date of RCRV
              </th>
              <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((result) => (
              <tr
                key={result.examId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-800">{result.name}</td>
                <td className="px-4 py-3 text-gray-800">
                  {result.resultsReleasedOn}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {result.lastDateOfRCRV}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/results/${result.examId}`}
                    className="text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
