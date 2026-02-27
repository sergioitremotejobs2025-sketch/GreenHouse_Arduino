package dao

import (
	"auth-ms/helper"
	"auth-ms/model"

	"database/sql"
	"fmt"
	"log"
)

// MysqlRepository is the production implementation of Repository backed by MySQL.
type MysqlRepository struct{}

// NewMysqlRepository creates a production MySQL-backed repository.
func NewMysqlRepository() Repository {
	return &MysqlRepository{}
}

// connect Connect to MySQL Server
func connect() *sql.DB {
	user := helper.GetEnv("MYSQL_ROOT_USERNAME", "root")
	password := helper.GetEnv("MYSQL_ROOT_PASSWORD", "my-secret-pw")
	host := helper.GetEnv("MYSQL_HOSTNAME", "192.168.1.222")
	port := helper.GetEnv("MYSQL_SERVICE_PORT", "31000")
	database := helper.GetEnv("MYSQL_DATABASE_NAME", "iot")

	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", user, password, host, port, database))

	if err != nil {
		panic(err.Error())
	}

	return db
}

// Exists checks whether user credentials exist in the DB.
func (r *MysqlRepository) Exists(user model.User) (bool, model.User) {
	db := connect()
	defer db.Close()

	pStmt, _ := db.Prepare("SELECT * FROM iot.users WHERE username = ? AND password = ?")
	defer pStmt.Close()

	var dbUser model.User

	err := pStmt.QueryRow(user.Username, user.Password).Scan(&dbUser.Username, &dbUser.Password, &dbUser.RefreshToken)

	existUser := user.Username == dbUser.Username && user.Password == dbUser.Password

	if err != nil {
		existUser = false
		log.Println("User '" + user.Username + "' and password '***' not found in the DB")
	}

	return existUser, dbUser
}

// Insert adds new user credentials in the DB.
func (r *MysqlRepository) Insert(user model.User) bool {
	db := connect()
	defer db.Close()

	pStmt, _ := db.Prepare("INSERT INTO iot.users VALUES (?, ?, ?)")
	defer pStmt.Close()

	_, err := pStmt.Exec(user.Username, user.Password, user.RefreshToken)

	if err != nil {
		log.Println("The user inserted is already registered")
		return false
	}

	return true
}

// Update updates user credentials in the DB.
func (r *MysqlRepository) Update(credentials model.Credential) int64 {
	db := connect()
	defer db.Close()

	pStmt, _ := db.Prepare("UPDATE iot.users SET refresh_token = ? WHERE refresh_token = ? AND username = ?")
	defer pStmt.Close()

	result, err := pStmt.Exec(credentials.NewRefreshToken, credentials.RefreshToken, credentials.Username)

	if err != nil {
		log.Println("The transaction failed")
		return 0
	}

	rows, _ := result.RowsAffected()

	return rows
}
