import { useState } from "react";
import { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
const apiUrl = import.meta.env.VITE_API_URL;

function Protected() {
  const { request } = useApi();
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await request(`${apiUrl}/protected`);
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      setData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>A network error was encountered.</p>;

  return (
    <>
      <p>{data.message}</p>
    </>
  );
}

export default Protected;
