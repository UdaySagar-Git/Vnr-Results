"use client";

import { useEffect, useState } from "react";
import Table from "./results/Table";

const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    try{
      fetch("/api/getAvailableResults")
        .then((response) => response.json())
        .then((data) => setData(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return <Table data={data} />;
};

export default Page;
