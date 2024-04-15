"use client"

import React, { useState } from 'react';
import { resultsDummy } from './data';

const Selection = ({
  classes,
  params
}: {
  classes: any;
  params: any;
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleAcademicYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAcademicYear(event.target.value);
    setSelectedBranch('');
    setSelectedSection('');
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranch(event.target.value);
    setSelectedSection('');
  };

  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(event.target.value);
  };

  const sortResults = (columnName: string) => {

    if (sortBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortOrder('asc');
    }
    handleSortResults(columnName);
  };

  const handleSortResults = (columnName: string) => {
    const sortedResults = results.sort((a: any, b: any) => {
      if (columnName === 'rollNumber' || columnName === 'name') {
        return sortOrder === 'asc'
          ? a.student[columnName].localeCompare(b.student[columnName])
          : b.student[columnName].localeCompare(a.student[columnName]);
      } else {
        const aResult = a.result.find((res: any) => res.subjectCode === columnName);
        const bResult = b.result.find((res: any) => res.subjectCode === columnName);

        if (aResult && bResult) {
          if (aResult.gradePoints === "--" && bResult.gradePoints === "--") {
            return 0;
          } else if (aResult.gradePoints === "--") {
            return 1;
          } else if (bResult.gradePoints === "--") {
            return -1;
          } else {
            return sortOrder === 'asc'
              ? aResult.gradePoints - bResult.gradePoints
              : bResult.gradePoints - aResult.gradePoints;
          }
        } else {
          return 0;
        }
      }
    });

    setResults([...sortedResults]);
  }

  const filteredSections = classes.filter(
    (cls: any) =>
      cls.accademicYear.startYear === parseInt(selectedAcademicYear) &&
      cls.branch === selectedBranch
  );

  const filteredBranches = classes.filter(
    (cls: any) => cls.accademicYear.startYear === parseInt(selectedAcademicYear)
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResults([]);
    setSortBy('');

    const filteredClasses = classes.filter(
      (cls: any) =>
        cls.accademicYear.startYear === parseInt(selectedAcademicYear) &&
        (selectedBranch ? cls.branch === selectedBranch : true) &&
        (selectedSection ? cls.section === selectedSection : true)
    );

    try {
      setLoading(true);

      const resStudents = await fetch('/api/getStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classes: filteredClasses,
        }),
      });

      const students = resStudents.ok ? await resStudents.json() : [];

      const maxResultsPerRequest = 8;

      for (let i = 0; i < students.length; i += maxResultsPerRequest) {
        const chunk = students.slice(i, i + maxResultsPerRequest);

        const resResults = await fetch('/api/getResults', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            students: chunk,
            examId: params.id,
          }),
        });

        const resultsData = resResults.ok ? await resResults.json() : [];
        setResults(prevResults => [...prevResults, ...resultsData]);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <div className="bg-indigo-600 text-white text-center">
        <marquee>
          Some branches have not been added yet. This project is in the initial development stage. Please report errors <a href="https://github.com/UdaySagar-Git/Vnr-Results/issues/new" target="_blank" rel="noreferrer" className="text-yellow-300">here</a>.
        </marquee>
      </div>
      <div className="fixed top-4 w-full mx-auto">
        <h1 className="text-2xl font-bold p-4 text-center">Results</h1>
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 justify-center gap-10">
          <div className="flex flex-col w-32">
            <label htmlFor="academicYear" className="text-sm font-medium text-gray-700">
              Academic Year:
            </label>
            <select
              name="academicYear"
              id="academicYear"
              value={selectedAcademicYear}
              onChange={handleAcademicYearChange}
              className="mt-1 block w-full min-w-[150px] border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select Academic Year
              </option>
              {Array.from(new Set(classes.map((cls: any) => cls.accademicYear.startYear))).map(
                (startYear: any) => {
                  const endYear = startYear + 4;
                  const academicYear = `${startYear}-${endYear}`;
                  return (
                    <option key={academicYear} value={academicYear}>
                      {academicYear}
                    </option>
                  );
                }
              )}
            </select>
          </div>
          <div className="flex flex-col w-32">
            <label htmlFor="branch" className="text-sm font-medium text-gray-700">
              Branch:
            </label>
            <select
              name="branch"
              id="branch"
              value={selectedBranch}
              onChange={handleBranchChange}
              disabled={!selectedAcademicYear}
              className="mt-1 block w-full min-w-[150px] border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select Branch
              </option>
              {Array.from(new Set(filteredBranches.map((cls: any) => cls.branch))).map((branch: any) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-32">
            <label htmlFor="section" className="text-sm font-medium text-gray-700">
              Section:
            </label>
            <select
              name="section"
              id="section"
              value={selectedSection}
              onChange={handleSectionChange}
              disabled={!selectedBranch}
              className="mt-1 block w-full min-w-[150px] border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select Section
              </option>
              {Array.from(new Set(filteredSections.map((cls: any) => cls.section))).map((section: any) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit
          </button>
        </form>
      </div>
      <div className="my-5 pt-20" />
      {
        loading && (
          <div className="text-center animate-pulse flex justify-center items-center">
            <div className="text-3xl font-bold text-gray-500">Loading...</div>
          </div>
        )
      }

      <table className="min-w-full divide-y divide-gray-200 relative">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th
              onClick={() => sortResults('rollNumber')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 cursor-pointer"
            >
              Roll Number
              {sortBy === 'rollNumber' && (
                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th
              onClick={() => sortResults('name')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 cursor-pointer"
            >
              Student Name
              {sortBy === 'name' && (
                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th
              onClick={() => sortResults('branch')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Branch
              {sortBy === 'branch' && (
                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th
              onClick={() => sortResults('section')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Section
              {sortBy === 'section' && (
                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            {results.length > 0 && (
              results.reduce((acc, curr) => {
                if (Array.isArray(curr.result)) {
                  acc = curr.result;
                }
                return acc;
              }, []).map((subject: any) => (
                <th
                  key={subject.sno}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => sortResults(subject.subjectCode)}
                >
                  <div>{subject.subjectCode === "Result" ? "Total" : subject.subjectCode}</div>
                  <div className="text-xs text-gray-400">{subject.subjectTitle}</div>
                  {sortBy === subject.subjectCode && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 z-0">
          {results.map((result: any) => (
            <tr key={result.student.rollNumber}>
              <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                {result.student.rollNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                {result.student.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{result.student.class.branch}</td>
              <td className="px-6 py-4 whitespace-nowrap">{result.student.class.section}</td>
              {results.length > 0 &&
                results.reduce((acc, curr) => {
                  if (Array.isArray(curr.result)) {
                    acc = curr.result;
                  }
                  return acc;
                }, []).map((subject: any) => {
                  const subjectResult = Array.isArray(result.result) && result.result.find((res: any) => res.subjectCode === subject.subjectCode) || null;
                  if (!subjectResult) {
                    console.log(result.student.rollNumber, subject.subjectCode, result);
                    return (
                      <td key={subject.sno} className="px-6 py-4 whitespace-nowrap">
                        --
                      </td>
                    );
                  }
                  return (
                    <td key={subject.sno} className="px-6 py-4 whitespace-nowrap">
                      {subjectResult
                        ? subjectResult.result === "FAIL"
                          ? `${subjectResult.gradePoints} (${subjectResult.result})`
                          : subjectResult.gradePoints !== "--"
                            ? subjectResult.gradePoints
                            : subjectResult.grade
                        : "--"}
                    </td>
                  );

                }
                )}
            </tr>

          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Selection;
