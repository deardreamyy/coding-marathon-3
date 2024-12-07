import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Job Search</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/jobs/add-job">Add Job</Link>
      </div>
    </nav>
  );
}

export default Navbar;