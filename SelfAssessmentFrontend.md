## Self Assessment

### useField Hook

```
useField.jsx
import { useState } from "react";

export default function useField(type) {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return { type, value, onChange };
};
```

#### Functionality
- **Purpose**: The useFieldhook is designed to manage the state and handle changes for form input fields.
- **Usage**: It is used in the Login and Signup components to manage the state of the username and password input fields.

#### Code Quality
- **Simplicity**: The hook is simple and easy to understand. It uses the useState hook to manage the value of the input field and provides an onChange handler to update the state when the input value changes.
- **Reusability**: The hook is reusable for any input field by simply passing the input type as an argument.
- **Readability**: The code is clean and well-structured, making it easy to read and maintain.

#### Performance
- **Efficiency**: The hook efficiently manages the state of the input field without any unnecessary re-renders or performance bottlenecks.

#### Example Usage
Here is an example of how the useField hook is used in the Login component:

```
Login.jsx
const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = useField("username");
  const password = useField("password");

  const { login, error } = useLogin("/api/users/login");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await login({ username: username.value, password: password.value });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Username:</label>
        <input {...username} />
        <label>Password:</label>
        <input {...password} />
        <button>Log in</button>
      </form>
    </div>
  );
};
```

In this example, the useField hook is used to manage the state of the username and password input fields, making the Login component more concise and easier to manage.

### Login

This code demonstrates a structured approach to implementing a useLogin hook and a Login component for handling user authentication.

```js
import { useState } from "react";

export default function useLogin(url) {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const login = async (object) => {
        setIsLoading(true);
        setError(null);
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(object),
        });
        const user = await response.json();
    
        if (!response.ok) {
          setError(user.error);
          setIsLoading(false);
          return error;
        }
    
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoading(false);
      };

      return { login, isLoading, error };
}

import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = useField("username");
  const password = useField("password");

  const { login, error } = useLogin("/api/users/login");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await login({ username: username.value, password: password.value });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };


  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
      <label>Username:</label>
        <input {...username} />
        <label>Password:</label>
        <input {...password} />
        <button>Log in</button>
      </form>
    </div>
  );
};

export default Login;
```

### Strengths:

Custom Hook Usage:

Encapsulating the login logic into a reusable custom hook (useLogin)

State Management:

Use of useState for managing error and isLoading states is clean and functional.

Flexibility:

The useLogin hook accepts a URL parameter, allowing it to be used for different endpoints if needed.

Modular Form Management:

Use of useField custom hook for managing form fields makes the form state reusable and concise.

Redirect After Login:

Using useNavigate from React Router to handle redirection after a successful login is a good approach.

### Areas for Improvement:

Error Handling:

Returning error directly in the login function might not work as intended due to how the asynchronous setError works.

Input Security:

The password field should include the type="password" attribute to mask the input.

Loading State Management:

While isLoading is set to true during the API call, it's not used in the UI. Displaying a loading spinner or disabling the submit button during loading would enhance user experience.

Error Feedback:

The UI does not currently display the error message to the user. Showing error messages near the form fields or as a toast notification would improve usability.

Form Validation:

No validation exists for empty or invalid inputs (e.g., minimum username/password length). Adding validation would ensure better data integrity.

LocalStorage Risks:

Storing user details in localStorage without encryption poses a security risk. Sensitive information like tokens should be handled securely, perhaps with HTTP-only cookies or encryption.

Memory Leak Risk:

If the login function is unmounted while still awaiting the API response, it might cause memory leaks.


### EditJobPage

This code provides an implementation of an EditJobPage component that allows editing job details using React and integrates with a backend API.

```js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditJobPage = () => {
  const [job, setJob] = useState(null); // Initialize job state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();

  // Declare state variables for form fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [postedDate, setPostedDate] = useState("");
  const [status, setStatus] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [requirements, setRequirements] = useState("");



  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const updateJob = async (job) => {
    try {
      const res = await fetch(/api/jobs/${id}, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${token},
        },
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error("Failed to update job");
      return res.ok;
    } catch (error) {
      console.error("Error updating job:", error);
      return false;
    }
  };

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(/api/jobs/${id});
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setJob(data); // Set the job data

        // Initialize form fields with fetched job data
        setTitle(data.title);
        setType(data.type);
        setDescription(data.description);
        setCompanyName(data.company.name);
        setContactEmail(data.company.contactEmail);
        setContactPhone(data.company.contactPhone);
        setWebsite(data.company.website);
        setLocation(data.location);
        setSalary(data.salary);
        setPostedDate(data.postedDate);
        setStatus(data.status);
        setApplicationDeadline(data.applicationDeadline);
        setRequirements(data.requirements);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchJob();
  }, [id]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const updatedJob = {
      id,
      title,
      type,
      description,
      company: {
        name: companyName,
        contactEmail,
        contactPhone,
        website
      },
       location,
       salary,
       postedDate,
       status,
       applicationDeadline,
       requirements
    };

    const success = await updateJob(updatedJob);
    if (success) {
      toast.success("Job Updated Successfully");
      navigate(/jobs/${id});
    } else {
      toast.error("Failed to update the job");
    }
  };

  return (
    <div className="create">
      <h2>Update Job</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
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
          <label>Company Website:</label>
          <input
                type="text"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
          />
          <label>Location: </label>
            <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <label>Salary: </label>
            <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
            />
            <label>Status: </label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
            </select>
            <label>Application deadline: </label>
            <input
                type="text"
                required
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
            />
            <label>Requirements: </label>
            <input
                type="text"
                required
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
            />
        
          <button>Update Job</button>
        </form>
      )}
    </div>
  );
};

export default EditJobPage;
```

### Strengths

Comprehensive Form Handling:

The component initializes form fields dynamically based on the fetched job data, ensuring that the form reflects the current state of the job.

Asynchronous Data Management:

The code uses useEffect to fetch job data and populate the form when the component is loaded, making it reactive to changes in the id parameter.

Error and Loading States:

The inclusion of loading and error states enhances user feedback, preventing users from interacting with incomplete or invalid data.

Security and Authorization:

The use of a token for authorization headers in the updateJob function ensures that API calls are secured.

User Feedback:

Integration with react-toastify provides clear success and error messages for user actions.

Clear Code Structure:

Separation of concerns between state management, API calls, and UI rendering makes the code easier to understand and maintain.

### Weaknesses

Hardcoded Inputs:

The input fields are tightly coupled with specific job properties. Dynamic rendering based on the schema of the job object would enhance flexibility.

Field Validation:

Client-side validation for fields such as email format, phone number format, and salary type is absent, which may lead to invalid data being submitted.

Error State Display:

Errors are logged to the console but are not displayed in a user-friendly format. Only the string message is shown in the UI, which may not be enough for end-users.

Inconsistent Date Handling:

The postedDate and applicationDeadline fields are treated as strings. No date picker or validation is used to ensure correct date formats.

Accessibility Issues:

label elements lack htmlFor attributes linking them to their corresponding input fields, which may impact screen readers and accessibility compliance.

Form Submission Robustness:

There is no feedback mechanism for the user during the form submission (e.g., a loading spinner or disabled button state).




