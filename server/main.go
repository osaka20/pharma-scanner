package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"
	"time"
	"unsafe"
)

// Embarque les fichiers statiques dans le binaire
//go:embed app-standalone.html pharma-data.json
var embeddedFiles embed.FS

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
	htmlPath := filepath.Join(cwd, "app-standalone.html")
	addr := ":8080"

	// Créer les fichiers depuis les fichiers embarqués s'ils n'existent pas
	ensureFilesExist(htmlPath, dataPath)

	// Check if port is already in use (server already running)
	if isPortInUse(addr) {
		// Server already running, just open browser
		_ = openBrowser("http://localhost" + addr)
		return
	}

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
		if r.URL.Path == "/" { http.ServeFile(w, r, htmlPath); return }
		fs.ServeHTTP(w, r)
	})

	fmt.Println("Pharma Scanner server running on http://localhost" + addr)
	fmt.Println("Data file:", dataPath)
	go func() {
		// Give server a brief moment to start, then open the default browser.
		time.Sleep(400 * time.Millisecond)
		_ = openBrowser("http://localhost" + addr)
	}()
	log.Fatal(http.ListenAndServe(addr, nil))
}

// isPortInUse checks if a TCP port is already in use
func isPortInUse(addr string) bool {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return true // Port is in use
	}
	ln.Close()
	return false
}

// openBrowser utilise l'API Windows native au lieu de exec.Command
func openBrowser(url string) error {
	if runtime.GOOS == "windows" {
		// Utiliser ShellExecuteW (API Windows native) au lieu de rundll32/cmd
		return shellExecute(url)
	}
	// Pour Linux/Mac, on ne fait rien (utilisateur ouvre manuellement)
	fmt.Println("Ouvrez votre navigateur à:", url)
	return nil
}

// shellExecute appelle directement l'API Windows sans passer par exec
func shellExecute(url string) error {
	if runtime.GOOS != "windows" {
		return nil
	}
	
	// Charger shell32.dll
	shell32, err := syscall.LoadDLL("shell32.dll")
	if err != nil {
		return err
	}
	defer shell32.Release()
	
	// Obtenir ShellExecuteW
	shellExecute, err := shell32.FindProc("ShellExecuteW")
	if err != nil {
		return err
	}
	
	// Convertir string en UTF16
	urlPtr, _ := syscall.UTF16PtrFromString(url)
	operationPtr, _ := syscall.UTF16PtrFromString("open")
	
	// Appeler ShellExecuteW directement
	ret, _, _ := shellExecute.Call(
		0,                           // hwnd
		uintptr(unsafe.Pointer(operationPtr)), // operation
		uintptr(unsafe.Pointer(urlPtr)),       // file
		0,                           // parameters
		0,                           // directory
		1,                           // show command (SW_SHOWNORMAL)
	)
	
	if ret <= 32 {
		return fmt.Errorf("failed to open browser")
	}
	return nil
}

// ensureFilesExist crée les fichiers s'ils n'existent pas
func ensureFilesExist(htmlPath, dataPath string) {
	// Créer app-standalone.html s'il n'existe pas
	if _, err := os.Stat(htmlPath); os.IsNotExist(err) {
		content, _ := embeddedFiles.ReadFile("app-standalone.html")
		os.WriteFile(htmlPath, content, 0644)
	}

	// Créer pharma-data.json s'il n'existe pas
	if _, err := os.Stat(dataPath); os.IsNotExist(err) {
		content, _ := embeddedFiles.ReadFile("pharma-data.json")
		os.WriteFile(dataPath, content, 0644)
	}
}
