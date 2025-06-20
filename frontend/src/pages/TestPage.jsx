import { useEffect, useState } from "react";

const TestPage = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendStatus, setBackendStatus] = useState("Testing connection...");

    useEffect(() => {
        fetch("/api/vehicles/test")
            .then((res) => {
                if (!res.ok) throw new Error("Backend test failed");
                return res.text();
            })
            .then((data) => {
                setBackendStatus(`Backend connected: ${data}`);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Test Page</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-700">{backendStatus}</p>

                {loading && <p className="mt-2 text-gray-600">Loading vehicles...</p>}
                {error && <p className="mt-2 text-red-500">Error: {error}</p>}


            </div>
        </div>
    );
};

export default TestPage;
