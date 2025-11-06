package config

import (
	"bufio"
	"errors"
	"os"
	"path/filepath"
	"strings"
)

// LoadEnvIfPresent loads environment variables from .env files if they exist.
// It does not override variables that are already set in the process environment.
func LoadEnvIfPresent() error {
	// Try multiple common filenames in priority order
	candidates := []string{".env.local", ".env"}
	var loadErrs []string

	cwd, _ := os.Getwd()
	for _, name := range candidates {
		path := filepath.Join(cwd, name)
		if _, err := os.Stat(path); err == nil {
			if err := loadEnvFile(path); err != nil {
				loadErrs = append(loadErrs, err.Error())
			}
		}
	}
	if len(loadErrs) > 0 {
		return errors.New(strings.Join(loadErrs, "; "))
	}
	return nil
}

func loadEnvFile(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		// support lines like: export KEY=VALUE
		if strings.HasPrefix(line, "export ") {
			line = strings.TrimSpace(strings.TrimPrefix(line, "export "))
		}
		// split on first '=' only
		eq := strings.IndexRune(line, '=')
		if eq <= 0 {
			continue
		}
		key := strings.TrimSpace(line[:eq])
		val := strings.TrimSpace(line[eq+1:])
		// strip surrounding quotes if any
		if len(val) >= 2 {
			if (strings.HasPrefix(val, "\"") && strings.HasSuffix(val, "\"")) ||
				(strings.HasPrefix(val, "'") && strings.HasSuffix(val, "'")) {
				val = val[1 : len(val)-1]
			}
		}
		if _, exists := os.LookupEnv(key); !exists {
			_ = os.Setenv(key, val)
		}
	}
	if err := scanner.Err(); err != nil {
		return err
	}
	return nil
}
