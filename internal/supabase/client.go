package supabase

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"
)

type Client struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
}

func NewClientFromEnv() (*Client, error) {
	baseURL := os.Getenv("SUPABASE_URL")
	apiKey := os.Getenv("SUPABASE_API_KEY")
	if baseURL == "" || apiKey == "" {
		return nil, errors.New("missing SUPABASE_URL or SUPABASE_API_KEY")
	}
	return &Client{
		baseURL: baseURL,
		apiKey:  apiKey,
		httpClient: &http.Client{
			Timeout: 15 * time.Second,
		},
	}, nil
}

func (c *Client) Get(ctx context.Context, path string, query url.Values) ([]byte, int, error) {
	if c == nil {
		return nil, 0, errors.New("nil client")
	}
	u, err := url.Parse(c.baseURL)
	if err != nil {
		return nil, 0, err
	}
	u.Path = fmt.Sprintf("%s%s", u.Path, path)
	u.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, u.String(), nil)
	if err != nil {
		return nil, 0, err
	}
	req.Header.Set("apikey", c.apiKey)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, resp.StatusCode, err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return body, resp.StatusCode, fmt.Errorf("supabase error status=%d", resp.StatusCode)
	}
	return body, resp.StatusCode, nil
}

