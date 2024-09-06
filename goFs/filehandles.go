package gofs

import (
	"bytes"
	"log"
	"os"
)

func ReadFile(name string) []byte {
	data, err := os.ReadFile(name)
	if err != nil {
		log.Fatal(err)
	}
	return data
}

func ByteToJsons(b []byte) string {
	buf := bytes.NewBuffer(b)
	return buf.String()
}

func JsonToBytes(s string) []byte {
	return []byte(s)
}
