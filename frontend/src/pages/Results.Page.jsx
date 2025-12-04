import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q");
  const handleOpenVideo = (id) => {
    navigate(`/watch/${id}`);
  };
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Search results for: {query}</h1>

      {/* list of videos based on search */}
      <div className="space-y-4">
        {/* Replace with mapped search results */}
        <div className="space-y-4">
          {/* Example card, later replace with .map() */}
          <div
            className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition"
            onClick={() => handleOpenVideo("12345")} // replace with video._id
          >
            Video result example (click to open details)
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
