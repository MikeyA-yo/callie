package main

import (
	"embed"

	"github.com/joho/godotenv"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	e := godotenv.Load()
	if e != nil {
		println("Error:", e.Error())
	}
	//Uri := os.Getenv("MONGO_URI")
	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Callie",
		Width:  1024,
		Height: 720,
		AssetServer: &assetserver.Options{
			Assets:  assets,
			Handler: NewFileLoader(),
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			&User{},
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
