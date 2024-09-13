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

func GetUserBytes() []byte {
	os.Mkdir("user", 0750)
	b, _ := os.ReadFile("user/user.json")
	return b
}

func UserBytesToJson() string {
	return ByteToJsons((GetUserBytes()))
}

func WriteUserData(d string) {
	b := []byte(d)
	os.WriteFile("user/user.json", b, 0666)
}

func GetMeetings() []byte {
	os.Mkdir("meetings", 0750)
	b, _ := os.ReadFile("meetings/meetings.json")
	return b
}
func AddMeeting(m string) {
	b := []byte(m)
	os.Mkdir("meetings", 0750)
	os.WriteFile("meetings/meetings.json", b, 0666)
}
