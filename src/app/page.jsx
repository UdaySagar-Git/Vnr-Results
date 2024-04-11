"use client";

import { useEffect, useState } from "react";
import Table from "./results/Table";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      fetch("/api/getAvailableResults")
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(data)) {
    return <div>Data is not in the expected format.</div>;
  }

  return <Table data={data} />;
};

export default Page;
