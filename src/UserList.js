import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function UserList({ adminToken, onLogout }) {
  const port = process.env.REACT_APP_SERVER_PORT || 8000;
  const apiBaseUrl = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://cicd-project-epmtgw9zh-quantix06s-projects.vercel.app' : `http://localhost:${port}`);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [expandedUser, setExpandedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const api = axios.create({
    baseURL: apiBaseUrl,
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data.utilisateurs);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(users.map((u) => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.size === 0) return;

    const confirmMsg = `Supprimer ${selectedUsers.size} utilisateur(s) ?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      for (const userId of selectedUsers) {
        await api.delete(`/users/${userId}`);
      }
      setDeleteMessage(`${selectedUsers.size} utilisateur(s) supprimé(s)`);
      setSelectedUsers(new Set());
      fetchUsers();
      setTimeout(() => setDeleteMessage(""), 3000);
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleViewDetails = async (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }

    if (!adminToken) {
      setError("Vous devez être connecté en tant qu'admin pour voir les détails");
      return;
    }

    try {
      const response = await api.get(`/users/${userId}`);
      setUserDetails((prev) => ({ ...prev, [userId]: response.data }));
      setExpandedUser(userId);
    } catch (err) {
      setError("Erreur lors du chargement des détails");
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Liste des utilisateurs</h2>
        {adminToken && (
          <button className="btn-logout" onClick={onLogout}>
            Déconnexion
          </button>
        )}
      </div>
      <p className="form-subtitle">
        {users.length} utilisateur(s) enregistré(s)
      </p>

      {error && <div className="error-message">✕ {error}</div>}
      {deleteMessage && <div className="success-message">✓ {deleteMessage}</div>}

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👤</span>
          <p>Aucun utilisateur enregistré</p>
        </div>
      ) : (
        <>
          {adminToken && selectedUsers.size > 0 && (
            <div className="bulk-actions">
              <span>{selectedUsers.size} sélectionné(s)</span>
              <button className="btn-delete" onClick={handleDeleteSelected}>
                🗑 Supprimer la sélection
              </button>
            </div>
          )}

          <div className="user-table-wrapper">
            <table className="user-table" id="user-table">
              <thead>
                <tr>
                  {adminToken && (
                    <th className="checkbox-col">
                      <input
                        type="checkbox"
                        id="select-all"
                        onChange={handleSelectAll}
                        checked={
                          users.length > 0 &&
                          selectedUsers.size === users.length
                        }
                      />
                    </th>
                  )}
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Ville</th>
                  {adminToken && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr
                      className={
                        selectedUsers.has(user.id) ? "row-selected" : ""
                      }
                    >
                      {adminToken && (
                        <td className="checkbox-col">
                          <input
                            type="checkbox"
                            id={`select-user-${user.id}`}
                            checked={selectedUsers.has(user.id)}
                            onChange={() => handleCheckboxChange(user.id)}
                          />
                        </td>
                      )}
                      <td>{user.nom}</td>
                      <td>{user.prenom}</td>
                      <td>{user.ville}</td>
                      {adminToken && (
                        <td>
                          <button
                            className="btn-details"
                            onClick={() => handleViewDetails(user.id)}
                          >
                            {expandedUser === user.id ? "Masquer" : "Détails"}
                          </button>
                        </td>
                      )}
                    </tr>
                    {expandedUser === user.id && userDetails[user.id] && (
                      <tr className="details-row">
                        <td colSpan={adminToken ? 5 : 3}>
                          <div className="user-details-panel">
                            <h4>Informations privées</h4>
                            <div className="details-grid">
                              <div className="detail-item">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">
                                  {userDetails[user.id].email}
                                </span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">
                                  Date de naissance
                                </span>
                                <span className="detail-value">
                                  {userDetails[user.id].date_naissance}
                                </span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">
                                  Code postal
                                </span>
                                <span className="detail-value">
                                  {userDetails[user.id].code_postal}
                                </span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">
                                  Inscrit le
                                </span>
                                <span className="detail-value">
                                  {userDetails[user.id].created_at}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default UserList;
