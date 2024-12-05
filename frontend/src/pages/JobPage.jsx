import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteJob = async (id) => {
    try {
      try {
        const token = JSON.parse(localStorage.getItem("user")).token;
        if (!token) {
            throw new Error("Not authorized");
        }
      const res = await fetch(`https://cm3-apiv1.onrender.com/api/jobs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,	
        }
      });
      if (!res.ok) {
        throw new Error("Failed to delete job");
      }
      navigate("/");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  } catch (error) {
    console.error("Error deleting job: ", error.message);
  }
};

  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log("id: ", id);
        const res = await fetch(`https://cm3-apiv1.onrender.com/api/jobs/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const onDeleteClick = (jobId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?" + jobId
    );
    if (!confirm) return;

    deleteJob(jobId);
  };

  return (
    <div className="job-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{job.title}</h2>
          <p>Type: {job.type}</p>
          <p>Description: {job.description}</p>
          <p>Company: {job.company.name}</p>
          <p>Email: {job.company.contactEmail}</p>
          <p>Phone: {job.company.contactPhone}</p>
          <p>Website: {job.company.website}</p>
          <p>Location: {job.location}</p>
          <p>Salary: {job.salary}</p>
          <p>Posted Date: {job.postedDate}</p>
          <p>Status: {job.status}</p>
          <p>Application Deadline: {job.applicationDeadline}</p>
          <p>Requirements: {job.requirements}</p>
          <button onClick={() => onDeleteClick(job._id)}>delete</button>
          <button onClick={() => navigate(`/jobs/edit-job/${job._id}`)}>edit</button>
        </>
      )}
    </div>
  );
};

export default JobPage;
