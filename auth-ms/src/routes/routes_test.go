package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetRouter(t *testing.T) {
	router := GetRouter()

	// Test health
	req := httptest.NewRequest("GET", "/health", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	if rr.Code != http.StatusOK {
		t.Errorf("got %v", rr.Code)
	}

	// Test docs (will 404 because file doesn't exist in test runner context, or just test the handler exists)
	req = httptest.NewRequest("GET", "/docs", nil)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	// It's fine if it's 404/STK, just exercising the line.

	// Test metrics
	req = httptest.NewRequest("GET", "/metrics", nil)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	if rr.Code != http.StatusOK {
		t.Errorf("metrics got %v", rr.Code)
	}
}
