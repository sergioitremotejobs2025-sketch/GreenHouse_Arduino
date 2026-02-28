package dao

import (
	"auth-ms/model"
	"database/sql"
	"fmt"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	_ "github.com/go-sql-driver/mysql"
)

func TestMysqlRepository_Exists(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	repo := &MysqlRepository{DB: db}
	user := model.User{Username: "alice", Password: "pwd"}

	// Success case
	rows := sqlmock.NewRows([]string{"username", "password", "refresh_token"}).
		AddRow("alice", "pwd", "tok")
	mock.ExpectPrepare("SELECT \\* FROM iot.users").
		ExpectQuery().
		WithArgs("alice", "pwd").
		WillReturnRows(rows)

	exists, dbUser := repo.Exists(user)
	if !exists {
		t.Errorf("expected exists=true")
	}
	if dbUser.Username != "alice" {
		t.Errorf("expected username alice, got %s", dbUser.Username)
	}

	// Failure case (not found)
	mock.ExpectPrepare("SELECT \\* FROM iot.users").
		ExpectQuery().
		WithArgs("alice", "pwd").
		WillReturnError(sql.ErrNoRows)

	exists, _ = repo.Exists(user)
	if exists {
		t.Errorf("expected exists=false on error")
	}
}

func TestNewMysqlRepository(t *testing.T) {
	repo := NewMysqlRepository()
	if repo == nil {
		t.Errorf("expected non-nil repository")
	}
}

func TestMysqlRepository_Insert(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("error %s", err)
	}
	defer db.Close()

	repo := &MysqlRepository{DB: db}
	user := model.User{Username: "bob", Password: "p", RefreshToken: "r"}

	// Success
	mock.ExpectPrepare("INSERT INTO iot.users").
		ExpectExec().
		WithArgs("bob", "p", "r").
		WillReturnResult(sqlmock.NewResult(1, 1))

	if ok := repo.Insert(user); !ok {
		t.Errorf("expected true")
	}

	// Failure (duplicate)
	mock.ExpectPrepare("INSERT INTO iot.users").
		ExpectExec().
		WillReturnError(fmt.Errorf("dup"))

	if ok := repo.Insert(user); ok {
		t.Errorf("expected false on error")
	}
}

func TestMysqlRepository_Update(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("error %s", err)
	}
	defer db.Close()

	repo := &MysqlRepository{DB: db}
	creds := model.Credential{Username: "alice", RefreshToken: "old", NewRefreshToken: "new"}

	// Success
	mock.ExpectPrepare("UPDATE iot.users SET refresh_token").
		ExpectExec().
		WithArgs("new", "old", "alice").
		WillReturnResult(sqlmock.NewResult(0, 1))

	if rows := repo.Update(creds); rows != 1 {
		t.Errorf("expected 1, got %d", rows)
	}

	// Failure
	mock.ExpectPrepare("UPDATE iot.users SET refresh_token").
		ExpectExec().
		WillReturnError(fmt.Errorf("fail"))

	if rows := repo.Update(creds); rows != 0 {
		t.Errorf("expected 0 on error")
	}
}

func TestMysqlRepository_UpdatePassword(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("error %s", err)
	}
	defer db.Close()

	repo := &MysqlRepository{DB: db}

	// Success
	mock.ExpectPrepare("UPDATE iot.users SET password").
		ExpectExec().
		WithArgs("newpwd", "alice").
		WillReturnResult(sqlmock.NewResult(0, 1))

	if ok := repo.UpdatePassword("alice", "newpwd"); !ok {
		t.Errorf("expected true")
	}

	// Failure
	mock.ExpectPrepare("UPDATE iot.users SET password").
		ExpectExec().
		WillReturnError(fmt.Errorf("fail"))

	if ok := repo.UpdatePassword("alice", "newpwd"); ok {
		t.Errorf("expected false")
	}
}

func TestMysqlRepository_GetDB(t *testing.T) {
	repo := &MysqlRepository{}
	// This will call connect() which should work as it doesn't try to connect yet
	db := repo.getDB()
	if db == nil {
		t.Errorf("expected db")
	}
	// should reuse
	if repo.getDB() != db {
		t.Errorf("expected same db instance")
	}
}

func TestMysqlRepository_PrepareFail(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("e: %v", err)
	}
	defer db.Close()

	repo := &MysqlRepository{DB: db}

	// Exists
	mock.ExpectPrepare("SELECT").WillReturnError(fmt.Errorf("prepare fail"))
	exists, _ := repo.Exists(model.User{})
	if exists {
		t.Error("expected false")
	}

	// Insert
	mock.ExpectPrepare("INSERT").WillReturnError(fmt.Errorf("fail"))
	if repo.Insert(model.User{}) {
		t.Error("expected false")
	}

	// Update
	mock.ExpectPrepare("UPDATE").WillReturnError(fmt.Errorf("fail"))
	if repo.Update(model.Credential{}) != 0 {
		t.Error("expected 0")
	}

	// UpdatePassword
	mock.ExpectPrepare("UPDATE").WillReturnError(fmt.Errorf("fail"))
	if repo.UpdatePassword("a", "b") {
		t.Error("expected false")
	}
}
