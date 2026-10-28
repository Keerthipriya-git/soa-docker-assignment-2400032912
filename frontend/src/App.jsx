
import { useState, useEffect, useCallback } from "react";
import "./index.css";
import "./App.css";

const API = "http://localhost:2007/solar";

const emptyForm = {
  siteName: "",
  capacityKw: "",
  installationDate: "",
  operational: "true",
};

async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Check that your backend is running."
    );
  }

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Solar installation not found.");
    }

    if (response.status === 400 || response.status === 422) {
      throw new Error(
        typeof data === "string" && data.trim()
          ? data
          : "Please check your input and try again."
      );
    }

    if (response.status === 409) {
      throw new Error("This operation conflicts with existing data.");
    }

    throw new Error("Something went wrong. Please try again.");
  }

  return data;
}

function App() {
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadSites = useCallback(async (showMessage = false) => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(`${API}/DisplayAll`);
      setSites(Array.isArray(data) ? data : []);

      if (showMessage) {
        setSuccess("Solar installations loaded successfully!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.siteName.trim()) {
      setError("Please enter the solar site name.");
      return;
    }

    if (
      form.capacityKw === "" ||
      !Number.isFinite(Number(form.capacityKw)) ||
      Number(form.capacityKw) <= 0
    ) {
      setError("Please enter a valid capacity greater than zero.");
      return;
    }

    if (!form.installationDate) {
      setError("Please select the installation date.");
      return;
    }

    const payload = {
      siteName: form.siteName.trim(),
      capacityKw: Number(form.capacityKw),
      installationDate: form.installationDate,
      operational: form.operational === "true",
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await apiRequest(`${API}/Update/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setSuccess("Solar installation updated successfully!");
      } else {
        await apiRequest(`${API}/Add`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setSuccess("Solar installation created successfully!");
      }

      resetForm();
      await loadSites();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(site) {
    setEditingId(site.id);
    setForm({
      siteName: site.siteName ?? "",
      capacityKw: String(site.capacityKw ?? ""),
      installationDate: site.installationDate ?? "",
      operational: site.operational ? "true" : "false",
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this solar installation?"
    );

    if (!confirmed) return;

    setSuccess("");
    setError("");

    try {
      await apiRequest(`${API}/Delete/${id}`, {
        method: "DELETE",
      });

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Solar installation deleted successfully!");
      await loadSites();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredSites = sites.filter((site) =>
    String(site.siteName ?? "")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const operationalCount = sites.filter(
    (site) => site.operational === true
  ).length;

  const notOperationalCount = sites.length - operationalCount;

  const totalCapacity = sites.reduce(
    (total, site) => total + (Number(site.capacityKw) || 0),
    0
  );

  return (
    <>
      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">☀️</span>
          <span>SolarCare</span>
        </div>

        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#installations">Installations</a>
          <a href="#add-site">Manage Sites</a>
        </div>
      </nav>

      <main className="container" id="dashboard">
        <section className="hero">
          <div>
            <p className="hero-label">SOLAR MANAGEMENT SYSTEM</p>
            <h1>Solar Installation Dashboard</h1>
            <p>
              Monitor your solar installations and manage site information
              in one place.
            </p>
          </div>
          <div className="hero-icon">🌞</div>
        </section>

        {success && (
          <div className="alert success" role="status">
            <span>✓</span> {success}
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Close success message"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="alert error" role="alert">
            <span>!</span> {error}
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        <section className="stats">
          <div className="stat-card">
            <p>Total Installations</p>
            <h2>{sites.length}</h2>
            <span>Registered solar sites</span>
          </div>

          <div className="stat-card">
            <p>Operational Sites</p>
            <h2>{operationalCount}</h2>
            <span>Currently working</span>
          </div>

          <div className="stat-card">
            <p>Not Operational</p>
            <h2>{notOperationalCount}</h2>
            <span>Currently not working</span>
          </div>

          <div className="stat-card">
            <p>Total Capacity</p>
            <h2>{totalCapacity.toLocaleString()} kW</h2>
            <span>Combined site capacity</span>
          </div>
        </section>

        <section className="card" id="add-site">
          <div className="section-heading">
            <div>
              <h2>
                {editingId !== null
                  ? "Update Solar Installation"
                  : "Add Solar Installation"}
              </h2>
              <p>Enter the details of your solar installation.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="siteName">Site Name</label>
                <input
                  id="siteName"
                  name="siteName"
                  type="text"
                  placeholder="e.g. Green Valley Solar Farm"
                  value={form.siteName}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="capacityKw">Capacity (kW)</label>
                <input
                  id="capacityKw"
                  name="capacityKw"
                  type="number"
                  placeholder="e.g. 250.75"
                  value={form.capacityKw}
                  onChange={handleChange}
                  min="0.01"
                  step="any"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="installationDate">Installation Date</label>
                <input
                  id="installationDate"
                  name="installationDate"
                  type="date"
                  value={form.installationDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="operational">Operational Status</label>
                <select
                  id="operational"
                  name="operational"
                  value={form.operational}
                  onChange={handleChange}
                >
                  <option value="true">Operational</option>
                  <option value="false">Not Operational</option>
                </select>
              </div>
            </div>

            <div className="actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Please wait..."
                  : editingId !== null
                    ? "Update Installation"
                    : "Create Installation"}
              </button>

              {editingId !== null && (
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card" id="installations">
          <div className="section-heading">
            <div>
              <h2>Solar Installations</h2>
              <p>View, search, edit, or delete registered sites.</p>
            </div>

            <button
              className="btn btn-light"
              type="button"
              onClick={() => loadSites(true)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="search-row">
            <input
              className="search-input"
              type="search"
              placeholder="Search by site name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search solar installations"
            />
          </div>

          {loading ? (
            <p className="empty-state">Loading solar installations...</p>
          ) : filteredSites.length === 0 ? (
            <p className="empty-state">
              {sites.length === 0
                ? "No solar installations yet. Add your first site above."
                : "No sites match your search."}
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Site Name</th>
                    <th>Capacity (kW)</th>
                    <th>Installation Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSites.map((site) => (
                    <tr key={site.id}>
                      <td>{site.id}</td>
                      <td>{site.siteName}</td>
                      <td>{site.capacityKw}</td>
                      <td>{site.installationDate}</td>
                      <td>
                        <span
                          className={`status ${
                            site.operational
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          {site.operational
                            ? "Operational"
                            : "Not Operational"}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn btn-edit"
                            type="button"
                            onClick={() => handleEdit(site)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-delete"
                            type="button"
                            onClick={() => handleDelete(site.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>
          <p>SolarCare · Solar Installation Management System</p>
        </footer>
      </main>
    </>
  );
}

export default App;
