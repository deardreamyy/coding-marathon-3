import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Full-Time");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [requirements, setRequirements] = useState("");
  const [website, setWebsite] = useState("");

  const navigate = useNavigate();
 
  const addJob = async (newJob) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}api/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });
      if (!res.ok) {
        throw new Error("Failed to add job");
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();

    const newJob = {
      title,
      type,
      description,
      company: {
        name: companyName,
        contactEmail,
        contactPhone,
        website,
      },
      location, 
      salary, 
      postedDate, 
      status, 
      applicationDeadline, 
      requirements,
    };

    addJob(newJob);
    return navigate("/");
  };

  return (
    <div className="create">
      <h2>Add a New Job</h2>
      <form onSubmit={submitForm}>
        <label>Job title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Job type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
        </select>

        <label>Job Description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Company Name:</label>
        <input
          type="text"
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <label>Company Website:</label>
        <input
          type="text"
          required
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <label>Contact Email:</label>
        <input
          type="text"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <label>Contact Phone:</label>
        <input
          type="text"
          required
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <label>Location:</label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label>Salary:</label>
        <select value={salary} onChange={(e) => setSalary(e.target.value)}>
          <option value="Under $50K">Under $50K</option>
          <option value="$50K - 60K">$50K - $60K</option>
          <option value="$60K - 70K">$60K - $70K</option>
          <option value="$70K - 80K">$70K - $80K</option>
          <option value="$80K - 90K">$80K - $90K</option>
          <option value="$90K - 100K">$90K - $100K</option>
          <option value="$100K - 125K">$100K - $125K</option>
          <option value="$125K - 150K">$125K - $150K</option>
          <option value="$150K - 175K">$150K - $175K</option>
          <option value="$175K - 200K">$175K - $200K</option>
          <option value="Over $200K">Over $200K</option>
          </select>
          <label>Application Deadline:</label>
          <input
            type="date"
            required
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
          />
          <label>Requirements:</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          ></textarea>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        <button>Add Job</button>
      </form>
    </div>
  );
};

export default AddJobPage;