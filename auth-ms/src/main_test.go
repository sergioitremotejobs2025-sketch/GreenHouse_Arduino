package main

import (
	"os"
	"testing"
)

func TestRunError(t *testing.T) {
	os.Setenv("PORT", "-1")
	err := Run()
	if err == nil {
		t.Error("expected an error")
	}
}
