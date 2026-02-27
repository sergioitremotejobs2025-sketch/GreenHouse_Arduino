package controller

import (
	"auth-ms/dao"
	"auth-ms/model"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// Handlers holds the repository dependency for all HTTP handlers.
type Handlers struct {
	Repo dao.Repository
}

// NewHandlers creates a new Handlers with the given repository.
func NewHandlers(repo dao.Repository) *Handlers {
	return &Handlers{Repo: repo}
}

// getBodyContent parses application/json body into a model.User struct.
func getBodyContent(r *http.Request) model.User {
	var user model.User
	reqBody, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Println("Error reading request body:", err.Error())
		return user
	}

	json.Unmarshal(reqBody, &user)
	return user
}

// Login handles POST /login.
func (h *Handlers) Login(w http.ResponseWriter, r *http.Request) {
	log.Println("POST /login")

	user := getBodyContent(r)
	existsUser, dbUser := h.Repo.Exists(user)
	loginCorrect := false

	if existsUser {
		var updateCredential model.Credential = model.Credential{
			Username:        user.Username,
			RefreshToken:    dbUser.RefreshToken,
			NewRefreshToken: user.RefreshToken,
		}

		rows := h.Repo.Update(updateCredential)
		loginCorrect = rows == 1
	}

	fmt.Fprintf(w, fmt.Sprintf("%t", loginCorrect))
}

// Register handles POST /register.
func (h *Handlers) Register(w http.ResponseWriter, r *http.Request) {
	log.Println("POST /register")

	user := getBodyContent(r)
	success := h.Repo.Insert(user)

	fmt.Fprintf(w, fmt.Sprintf("%t", success))
}

// Refresh handles POST /refresh.
func (h *Handlers) Refresh(w http.ResponseWriter, r *http.Request) {
	log.Println("POST /refresh")

	var credentials model.Credential
	reqBody, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Println("Error reading request body:", err.Error())
		fmt.Fprintf(w, "false")
		return
	}

	json.Unmarshal(reqBody, &credentials)

	rows := h.Repo.Update(credentials)
	success := rows == 1

	fmt.Fprintf(w, fmt.Sprintf("%t", success))
}
