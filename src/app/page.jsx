"use client";

import { useEffect, useState } from "react";
import Table from "./results/Table";

const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/getAllResults")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return <Table data={data} />;
};

export default Page;
