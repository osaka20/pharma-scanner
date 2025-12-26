package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

type State struct {
	V int             `json:"v"`
	P json.RawMessage `json:"p"`
	S json.RawMessage `json:"s"`
	O float64         `json:"o"`
}

func main() {
	cwd, err := os.Getwd()
	if err != nil { log.Fatal(err) }
	dataPath := filepath.Join(cwd, "pharma-data.json")

	fs := http.FileServer(http.Dir(cwd))
	http.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions { w.WriteHeader(http.StatusNoContent); return }

		switch r.Method {
		case http.MethodGet:
			b, err := os.ReadFile(dataPath)
			if err != nil {
				// initialize empty state
				s := []byte(`{"v":2,"p":[],"s":[],"o":0}`)
				_ = os.WriteFile(dataPath, s, 0644)
				b = s
			}
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write(b)
		case http.MethodPost:
			body, err := io.ReadAll(r.Body)
			if err != nil { http.Error(w, err.Error(), http.StatusBadRequest); return }
			// basic validation: ensure JSON starts with '{'
			if !strings.HasPrefix(strings.TrimSpace(string(body)), "{") {
				http.Error(w, "invalid json", http.StatusBadRequest); return
			}
			if err := os.WriteFile(dataPath, body, 0644); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError); return
			}
			w.WriteHeader(http.StatusNoContent)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// default to app-standalone.html
		if r.URL.Path == "/" { http.ServeFile(w, r, filepath.Join(cwd, "app-standalone.html")); return }
		fs.ServeHTTP(w, r)
	})

	addr := ":8080"
	fmt.Println("Pharma Scanner server running on http://localhost" + addr)
	fmt.Println("Data file:", dataPath)
	go func() {
		// Give server a brief moment to start, then open the default browser.
		time.Sleep(400 * time.Millisecond)
		_ = openBrowser("http://localhost" + addr)
	}()
	log.Fatal(http.ListenAndServe(addr, nil))
}

// openBrowser tries to launch the default browser on each platform.
func openBrowser(url string) error {
	cmds := [][]string{}
	switch os := runtime.GOOS; os {
	case "windows":
		cmds = append(cmds, []string{"rundll32", "url.dll,FileProtocolHandler", url})
	case "darwin":
		cmds = append(cmds, []string{"open", url})
	default:
		cmds = append(cmds, []string{"xdg-open", url})
	}

	for _, c := range cmds {
		cmd := exec.Command(c[0], c[1:]...)
		if err := cmd.Start(); err == nil {
			return nil
		}
	}
	return fmt.Errorf("unable to open browser")
}
