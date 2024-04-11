import getAvailableResults from "@/actions/getAvailableResults";
import Table from './Table';

const page = async () => {
  const data = await getAvailableResults();
  return (
    <Table data={data} />
  );
};

export default page;
