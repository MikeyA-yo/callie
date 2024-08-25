package main

import (
	"context"
	"fmt"
	"io/fs"
	"log"
	gofs "myproject/goFs"
	"net/http"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// type User Struct
type User struct {
	Name string `json:"name"`
	Age  string `json:"age"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, How do you do today?", name)
}
func (a *App) Test(name string) string {
	return a.Greet(name)
}

func (u *User) SayAgenName(name, age string) User {
	u.Age = age
	u.Name = name
	return User{
		Name: u.Name,
		Age:  u.Age,
	}
}

func (a *App) OpenFile() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})
}

func (a *App) Write(dest string, data []byte) {
	os.Mkdir("usrMediaFiles", 0750)
	err := os.WriteFile(fmt.Sprintf("usrMediaFiles/%v", dest), data, 0666)
	if err != nil {
		log.Fatal(err)
	}
}

func (a *App) Read(name string) []byte {
	return gofs.ReadFile(name)
}

type Info struct {
	Name string      `json:"name"`
	Size int64       `json:"size"`
	Mode fs.FileMode `json:"mode"`
}

func (a *App) Stats(name string) Info {
	s, err := os.Lstat(name)
	if err != nil {
		log.Fatal(err)
	}

	return Info{
		Name: s.Name(),
		Size: s.Size(),
		Mode: s.Mode(),
	}
}

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	var err error
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/")
	println("Requesting file:", requestedFilename)
	fileData, err := os.ReadFile(requestedFilename)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
	}
	res.Write(fileData)
}
