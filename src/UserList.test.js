import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// ---- Mock axios ----
const mockGet = jest.fn();
const mockDelete = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: (...args) => mockGet(...args),
      delete: (...args) => mockDelete(...args),
    }),
  },
}));

const UserList = require("./UserList").default;

const sampleUsers = [
  { id: 1, nom: "Dupont", prenom: "Jean", ville: "Paris" },
  { id: 2, nom: "Martin", prenom: "Marie", ville: "Lyon" },
];

describe("UserList - mode public (sans token admin)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue({ data: { utilisateurs: sampleUsers } });
  });

  test("affiche le titre 'Liste des utilisateurs'", async () => {
    await act(async () => {
      render(<UserList adminToken={null} onLogout={jest.fn()} />);
    });
    expect(screen.getByText("Liste des utilisateurs")).toBeInTheDocument();
  });

  test("affiche les utilisateurs chargés depuis l'API", async () => {
    await act(async () => {
      render(<UserList adminToken={null} onLogout={jest.fn()} />);
    });
    expect(screen.getByText("Dupont")).toBeInTheDocument();
    expect(screen.getByText("Martin")).toBeInTheDocument();
    expect(screen.getByText("Jean")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  test("affiche le compteur d'utilisateurs", async () => {
    await act(async () => {
      render(<UserList adminToken={null} onLogout={jest.fn()} />);
    });
    expect(screen.getByText(/2 utilisateur\(s\) enregistré\(s\)/i)).toBeInTheDocument();
  });

  test("affiche 'Aucun utilisateur enregistré' quand la liste est vide", async () => {
    mockGet.mockResolvedValue({ data: { utilisateurs: [] } });
    await act(async () => {
      render(<UserList adminToken={null} onLogout={jest.fn()} />);
    });
    expect(screen.getByText(/aucun utilisateur enregistré/i)).toBeInTheDocument();
  });

  test("affiche un message d'erreur si l'API échoue", async () => {
    mockGet.mockRejectedValue(new Error("Network Error"));
    await act(async () => {
      render(<UserList adminToken={null} onLogout={jest.fn()} />);
    });
    expect(
      screen.getByText(/erreur lors du chargement des utilisateurs/i)
    ).toBeInTheDocument();
  });

  test("n'affiche pas le bouton 'Déconnexion' sans token admin", async () => {
    await act(async () => {
      render(<UserList adminToken={null} onLogout={jest.fn()} />);
    });
    expect(screen.queryByText("Déconnexion")).not.toBeInTheDocument();
  });

  test("n'affiche pas les colonnes admin sans token", async () => {
    await act(async () => {
      render(<UserList adminToken={null} onLogout={jest.fn()} />);
    });
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByText("Détails")).not.toBeInTheDocument();
  });
});

describe("UserList - mode admin (avec token)", () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue({ data: { utilisateurs: sampleUsers } });
    mockDelete.mockResolvedValue({ data: { message: "Supprimé" } });
  });

  test("affiche le bouton 'Déconnexion' avec un token admin", async () => {
    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });
    expect(screen.getByText("Déconnexion")).toBeInTheDocument();
  });

  test("appelle onLogout au clic sur Déconnexion", async () => {
    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });
    fireEvent.click(screen.getByText("Déconnexion"));
    expect(mockOnLogout).toHaveBeenCalled();
  });

  test("affiche les cases à cocher en mode admin", async () => {
    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    // 1 select-all + 2 utilisateurs
    expect(checkboxes.length).toBe(3);
  });

  test("coche / décoche un utilisateur individuel", async () => {
    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });
    const userCheckbox = document.getElementById("select-user-1");
    expect(userCheckbox.checked).toBe(false);
    fireEvent.click(userCheckbox);
    expect(userCheckbox.checked).toBe(true);
    fireEvent.click(userCheckbox);
    expect(userCheckbox.checked).toBe(false);
  });

  test("sélectionne tous les utilisateurs via select-all", async () => {
    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });
    const selectAll = document.getElementById("select-all");
    fireEvent.click(selectAll);
    const user1 = document.getElementById("select-user-1");
    const user2 = document.getElementById("select-user-2");
    expect(user1.checked).toBe(true);
    expect(user2.checked).toBe(true);
  });

  test("désélectionne tous via select-all quand tous sont sélectionnés", async () => {
    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });
    const selectAll = document.getElementById("select-all");
    // Sélectionne tout
    fireEvent.click(selectAll);
    // Désélectionne tout
    fireEvent.click(selectAll);
    const user1 = document.getElementById("select-user-1");
    expect(user1.checked).toBe(false);
  });

  test("supprime les utilisateurs sélectionnés après confirmation", async () => {
    window.confirm = jest.fn(() => true);
    mockGet
      .mockResolvedValueOnce({ data: { utilisateurs: sampleUsers } })
      .mockResolvedValueOnce({ data: { utilisateurs: [] } });

    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });

    fireEvent.click(document.getElementById("select-user-1"));

    await act(async () => {
      fireEvent.click(screen.getByText(/supprimer la sélection/i));
    });

    expect(mockDelete).toHaveBeenCalledWith("/users/1");
    await waitFor(() => {
      expect(screen.getByText(/1 utilisateur\(s\) supprimé\(s\)/i)).toBeInTheDocument();
    });
  });

  test("annule la suppression si l'utilisateur refuse la confirmation", async () => {
    window.confirm = jest.fn(() => false);

    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });

    fireEvent.click(document.getElementById("select-user-1"));
    fireEvent.click(screen.getByText(/supprimer la sélection/i));

    expect(mockDelete).not.toHaveBeenCalled();
  });

  test("affiche une erreur si la suppression échoue", async () => {
    window.confirm = jest.fn(() => true);
    mockDelete.mockRejectedValue(new Error("Erreur réseau"));

    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });

    fireEvent.click(document.getElementById("select-user-1"));

    await act(async () => {
      fireEvent.click(screen.getByText(/supprimer la sélection/i));
    });

    await waitFor(() => {
      expect(screen.getByText(/erreur lors de la suppression/i)).toBeInTheDocument();
    });
  });

  test("affiche les détails d'un utilisateur au clic sur 'Détails'", async () => {
    mockGet
      .mockResolvedValueOnce({ data: { utilisateurs: sampleUsers } })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          nom: "Dupont",
          prenom: "Jean",
          email: "jean@test.com",
          date_naissance: "1990-01-01",
          ville: "Paris",
          code_postal: "75001",
          created_at: "2024-01-01",
        },
      });

    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });

    const detailButtons = screen.getAllByText("Détails");
    await act(async () => {
      fireEvent.click(detailButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText("jean@test.com")).toBeInTheDocument();
    });
  });

  test("masque les détails au second clic sur 'Masquer'", async () => {
    mockGet
      .mockResolvedValueOnce({ data: { utilisateurs: sampleUsers } })
      .mockResolvedValueOnce({
        data: {
          id: 1, nom: "Dupont", prenom: "Jean",
          email: "jean@test.com", date_naissance: "1990-01-01",
          ville: "Paris", code_postal: "75001", created_at: "2024-01-01",
        },
      });

    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });

    const detailButtons = screen.getAllByText("Détails");
    await act(async () => { fireEvent.click(detailButtons[0]); });
    await waitFor(() => expect(screen.getByText("jean@test.com")).toBeInTheDocument());

    // Clic sur "Masquer"
    fireEvent.click(screen.getByText("Masquer"));
    expect(screen.queryByText("jean@test.com")).not.toBeInTheDocument();
  });

  test("affiche une erreur si le chargement des détails échoue", async () => {
    mockGet
      .mockResolvedValueOnce({ data: { utilisateurs: sampleUsers } })
      .mockRejectedValueOnce(new Error("Erreur réseau"));

    await act(async () => {
      render(<UserList adminToken="admin" onLogout={mockOnLogout} />);
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText("Détails")[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/erreur lors du chargement des détails/i)).toBeInTheDocument();
    });
  });
});
