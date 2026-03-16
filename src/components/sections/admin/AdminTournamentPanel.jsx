import { useEffect, useState } from "react";
import "./AdminTournamentPanel.css";

const API_URL = "https://matrix-8of6.onrender.com";
const ADMIN_KEY = "matrix_super_admin_2026";

const initialForm = {
  title: "",
  description: "",
  mode: "5v5",
  status: "OPEN",
  region: "Online",
  prize: "",
  maxParticipants: 8,
  startDate: "",
  checkInEnabled: false,
  isPublic: true,
};

const AdminTournamentPanel = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const adminHeaders = {
    "Content-Type": "application/json",
    "x-admin-key": ADMIN_KEY,
  };

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${API_URL}/api/admin/tournaments`, {
        headers: {
          "x-admin-key": ADMIN_KEY,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load tournaments");
        setTournaments([]);
        return;
      }

      setTournaments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetchTournaments error:", error);
      setMessage("Failed to load tournaments");
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setSelectedId("");
    setMessage("Create mode enabled");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectTournament = (tournament) => {
    setSelectedId(tournament._id);
    setForm({
      title: tournament.title || "",
      description: tournament.description || "",
      mode: tournament.mode || "5v5",
      status: tournament.status || "OPEN",
      region: tournament.region || "Online",
      prize: tournament.prize || "",
      maxParticipants: tournament.maxParticipants || 8,
      startDate: tournament.startDate
        ? new Date(tournament.startDate).toISOString().slice(0, 16)
        : "",
      checkInEnabled: Boolean(tournament.checkInEnabled),
      isPublic: Boolean(tournament.isPublic),
    });
    setMessage(`Editing: ${tournament.title}`);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      setMessage("");

      const payload = {
        ...form,
        maxParticipants: Number(form.maxParticipants),
        startDate: form.startDate || null,
      };

      const res = await fetch(`${API_URL}/api/admin/tournaments`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Create failed");
        return;
      }

      setMessage("Tournament created successfully");
      resetForm();
      await fetchTournaments();
    } catch (error) {
      console.error("handleCreate error:", error);
      setMessage("Create failed");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      setMessage("Select a tournament first");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const payload = {
        ...form,
        maxParticipants: Number(form.maxParticipants),
        startDate: form.startDate || null,
      };

      const res = await fetch(
        `${API_URL}/api/admin/tournaments/${selectedId}`,
        {
          method: "PUT",
          headers: adminHeaders,
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      setMessage("Tournament updated successfully");
      await fetchTournaments();
    } catch (error) {
      console.error("handleUpdate error:", error);
      setMessage("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      setMessage("Select a tournament first");
      return;
    }

    const confirmed = window.confirm(
      "Delete this tournament? Participants and matches may also need cleanup.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setMessage("");

      const res = await fetch(
        `${API_URL}/api/admin/tournaments/${selectedId}`,
        {
          method: "DELETE",
          headers: {
            "x-admin-key": ADMIN_KEY,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Delete failed");
        return;
      }

      setMessage("Tournament deleted successfully");
      resetForm();
      await fetchTournaments();
    } catch (error) {
      console.error("handleDelete error:", error);
      setMessage("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mx-admin containers">
      <div className="mx-admin__header">
        <div>
          <p className="mx-admin__eyebrow">[ MATRIX // ADMIN NODE ]</p>
          <h2 className="mx-admin__title">TOURNAMENT CONTROL PANEL</h2>
        </div>

        <button className="mx-admin__refresh" onClick={fetchTournaments}>
          REFRESH
        </button>
      </div>

      <div className="mx-admin__layout">
        <aside className="mx-admin-panel">
          <div className="mx-admin-panel__chrome">
            <span>TOURNAMENT_LIST</span>
            <span>{tournaments.length} ITEMS</span>
          </div>

          <div className="mx-admin-panel__toolbar">
            <button
              className="mx-admin-btn mx-admin-btn--gold"
              onClick={resetForm}
            >
              NEW TOURNAMENT
            </button>
          </div>

          <div className="mx-admin-list">
            {loading ? (
              <div className="mx-admin-empty">LOADING...</div>
            ) : tournaments.length === 0 ? (
              <div className="mx-admin-empty">NO TOURNAMENTS</div>
            ) : (
              tournaments.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleSelectTournament(item)}
                  className={`mx-admin-card ${
                    selectedId === item._id ? "mx-admin-card--active" : ""
                  }`}
                >
                  <div className="mx-admin-card__top">
                    <span className="mx-admin-card__title">{item.title}</span>
                    <span className="mx-admin-card__status">{item.status}</span>
                  </div>

                  <div className="mx-admin-card__meta">
                    <span>{item.mode}</span>
                    <span>{item.region}</span>
                    <span>{item.maxParticipants} slots</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="mx-admin-panel">
          <div className="mx-admin-panel__chrome">
            <span>{selectedId ? "EDIT_MODE" : "CREATE_MODE"}</span>
            <span>FORM_EDITOR</span>
          </div>

          <div className="mx-admin-form">
            <div className="mx-admin-grid">
              <div className="mx-admin-field mx-admin-field--wide">
                <label>Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Matrix Pro League"
                />
              </div>

              <div className="mx-admin-field mx-admin-field--wide">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tournament description..."
                  rows={4}
                />
              </div>

              <div className="mx-admin-field">
                <label>Mode</label>
                <select name="mode" value={form.mode} onChange={handleChange}>
                  <option value="1v1">1v1</option>
                  <option value="2v2">2v2</option>
                  <option value="5v5">5v5</option>
                </select>
              </div>

              <div className="mx-admin-field">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="OPEN">OPEN</option>
                  <option value="LIVE">LIVE</option>
                  <option value="FINISHED">FINISHED</option>
                </select>
              </div>

              <div className="mx-admin-field">
                <label>Region</label>
                <input
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  placeholder="Online / Bishkek"
                />
              </div>

              <div className="mx-admin-field">
                <label>Prize</label>
                <input
                  name="prize"
                  value={form.prize}
                  onChange={handleChange}
                  placeholder="$500 / Sponsor rewards"
                />
              </div>

              <div className="mx-admin-field">
                <label>Max Participants</label>
                <input
                  name="maxParticipants"
                  type="number"
                  min="2"
                  value={form.maxParticipants}
                  onChange={handleChange}
                />
              </div>

              <div className="mx-admin-field">
                <label>Start Date</label>
                <input
                  name="startDate"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>

              <label className="mx-admin-check">
                <input
                  type="checkbox"
                  name="checkInEnabled"
                  checked={form.checkInEnabled}
                  onChange={handleChange}
                />
                <span>Check-in enabled</span>
              </label>

              <label className="mx-admin-check">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={form.isPublic}
                  onChange={handleChange}
                />
                <span>Public tournament</span>
              </label>
            </div>

            <div className="mx-admin-actions">
              <button
                className="mx-admin-btn mx-admin-btn--gold"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? "SAVING..." : "CREATE"}
              </button>

              <button
                className="mx-admin-btn"
                onClick={handleUpdate}
                disabled={saving || !selectedId}
              >
                {saving ? "UPDATING..." : "UPDATE"}
              </button>

              <button
                className="mx-admin-btn mx-admin-btn--danger"
                onClick={handleDelete}
                disabled={deleting || !selectedId}
              >
                {deleting ? "DELETING..." : "DELETE"}
              </button>
            </div>

            {message ? <div className="mx-admin-message">{message}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminTournamentPanel;
