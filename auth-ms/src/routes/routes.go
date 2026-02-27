package routes

import (
	"auth-ms/controller"
	"auth-ms/dao"

	"net/http"

	"github.com/gorilla/mux"
)

// App initializes routes for auth-ms using the MySQL-backed repository.
func App(port string) {
	repo := dao.NewMysqlRepository()
	handlers := controller.NewHandlers(repo)

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/login", handlers.Login).Methods("POST")
	router.HandleFunc("/register", handlers.Register).Methods("POST")
	router.HandleFunc("/refresh", handlers.Refresh).Methods("POST")
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"auth-ms"}`))
	}).Methods("GET")

	http.ListenAndServe(port, router)
}
