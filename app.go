package main

import (
	gofs "callie/goFs"
	"callie/schedule"
	"context"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx   context.Context
	dburl string
}

// type User Struct
type User struct {
	Name string `json:"name"`
	Age  string `json:"age"`
}

// NewApp creates a new App application struct
func NewApp(dburl string) *App {
	return &App{dburl: dburl}
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
func (a *App) Schedule(exp int, owner, id string) bool {
	return schedule.Schedule(exp, owner, id, a.dburl)
}
func (a *App) Schedule2(exp int, owner, id string) bool {
	return schedule.Schedulev2(exp, owner, id, a.dburl)
}
func (a *App) DeleteSch(id string) {
	schedule.DeleteSchedule(id, a.dburl)
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

func (a *App) ShowInfo(i, t string) (string, error) {
	return runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    "info",
		Title:   t,
		Message: i,
	})
}

func (a *App) GetString(b []byte) string {
	return gofs.ByteToJsons(b)
}
func (a *App) GetByte(s string) []byte {
	return gofs.JsonToBytes(s)
}
func (a *App) GetUser() string {
	return gofs.UserBytesToJson()
}
func (a *App) EditUser(d string) {
	gofs.WriteUserData(d)
}
func (a *App) GetMeetings() string {
	return gofs.GetMeetings()
}
func (a *App) AddMeeting(m string) {
	gofs.AddMeeting(m)
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
