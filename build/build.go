package main

import (
	"bufio"
	"fmt"
	"os"
)

import (
	"regexp"
	"strings"
)

func main() {
	// Prompt the user for the server IP
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Enter server IP: ")
	serverIP, _ := reader.ReadString('\n')
	serverIP = strings.TrimSpace(serverIP) // Remove any trailing newline characters

	// Read the file
	filename := "../frontend/scripts/index.js"
	content, err := os.ReadFile(filename)
	if err != nil {
		panic(err)
	}

	// Replace localhost:port with the provided IP
	re := regexp.MustCompile(`localhost:\d+`)
	updatedContent := re.ReplaceAllString(string(content), serverIP)

	// Write the changes back to the file
	err = os.WriteFile(filename, []byte(updatedContent), 0644)
	if err != nil {
		panic(err)
	}

	fmt.Println("Swapped with server IP successfully.")
}
