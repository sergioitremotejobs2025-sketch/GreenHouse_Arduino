package controller

import (
	"auth-ms/model"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// mockRepository is a test double that does not touch any database.
type mockRepository struct {
	existsResult bool
	existsUser   model.User
	insertResult bool
	updateRows   int64
}

func (m *mockRepository) Exists(user model.User) (bool, model.User) {
	return m.existsResult, m.existsUser
}

func (m *mockRepository) Insert(user model.User) bool {
	return m.insertResult
}

func (m *mockRepository) Update(credentials model.Credential) int64 {
	return m.updateRows
}

func newTestHandlers(repo *mockRepository) *Handlers {
	return &Handlers{Repo: repo}
}

// ── Login tests ───────────────────────────────────────────────────────────────

func TestLogin_Success(t *testing.T) {
	mock := &mockRepository{
		existsResult: true,
		existsUser:   model.User{Username: "alice", Password: "secret", RefreshToken: "old"},
		updateRows:   1,
	}
	h := newTestHandlers(mock)

	body, _ := json.Marshal(model.User{Username: "alice", Password: "secret", RefreshToken: "new"})
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	h.Login(w, req)

	resp := w.Result()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 got %d", resp.StatusCode)
	}

	var got string
	json.NewDecoder(resp.Body).Decode(&got)
	if got != "true" {
		t.Errorf("expected body 'true', got %q", got)
	}
}

func TestLogin_UserNotFound(t *testing.T) {
	mock := &mockRepository{existsResult: false}
	h := newTestHandlers(mock)

	body, _ := json.Marshal(model.User{Username: "nobody", Password: "wrong"})
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	h.Login(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 got %d", w.Code)
	}
	if w.Body.String() != "false" {
		t.Errorf("expected 'false', got %q", w.Body.String())
	}
}

func TestLogin_UpdateFails(t *testing.T) {
	mock := &mockRepository{
		existsResult: true,
		existsUser:   model.User{Username: "alice", Password: "secret"},
		updateRows:   0, // update returns 0 rows
	}
	h := newTestHandlers(mock)

	body, _ := json.Marshal(model.User{Username: "alice", Password: "secret"})
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	h.Login(w, req)

	if w.Body.String() != "false" {
		t.Errorf("expected 'false', got %q", w.Body.String())
	}
}

// ── Register tests ────────────────────────────────────────────────────────────

func TestRegister_Success(t *testing.T) {
	mock := &mockRepository{insertResult: true}
	h := newTestHandlers(mock)

	body, _ := json.Marshal(model.User{Username: "bob", Password: "pass123", RefreshToken: "tok"})
	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	h.Register(w, req)

	if w.Body.String() != "true" {
		t.Errorf("expected 'true', got %q", w.Body.String())
	}
}

func TestRegister_DuplicateUser(t *testing.T) {
	mock := &mockRepository{insertResult: false}
	h := newTestHandlers(mock)

	body, _ := json.Marshal(model.User{Username: "existing", Password: "pass"})
	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	h.Register(w, req)

	if w.Body.String() != "false" {
		t.Errorf("expected 'false', got %q", w.Body.String())
	}
}

// ── Refresh tests ─────────────────────────────────────────────────────────────

func TestRefresh_Success(t *testing.T) {
	mock := &mockRepository{updateRows: 1}
	h := newTestHandlers(mock)

	body, _ := json.Marshal(model.Credential{
		Username:        "alice",
		RefreshToken:    "old-token",
		NewRefreshToken: "new-token",
	})
	req := httptest.NewRequest(http.MethodPost, "/refresh", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	h.Refresh(w, req)

	if w.Body.String() != "true" {
		t.Errorf("expected 'true', got %q", w.Body.String())
	}
}

func TestRefresh_TokenNotFound(t *testing.T) {
	mock := &mockRepository{updateRows: 0}
	h := newTestHandlers(mock)

	body, _ := json.Marshal(model.Credential{Username: "alice", RefreshToken: "bad"})
	req := httptest.NewRequest(http.MethodPost, "/refresh", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	h.Refresh(w, req)

	if w.Body.String() != "false" {
		t.Errorf("expected 'false', got %q", w.Body.String())
	}
}

func TestRefresh_EmptyBody(t *testing.T) {
	mock := &mockRepository{updateRows: 0}
	h := newTestHandlers(mock)

	req := httptest.NewRequest(http.MethodPost, "/refresh", bytes.NewBuffer([]byte{}))
	w := httptest.NewRecorder()

	h.Refresh(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}
