package staff

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	supa "nissyo/internal/supabase"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func maskPhone(phone *string) *string {
	if phone == nil {
		return nil
	}
	p := strings.TrimSpace(*phone)
	if len(p) < 4 {
		masked := "****"
		return &masked
	}
	masked := "***-***-" + p[len(p)-4:]
	return &masked
}

func GetStaffHandler(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	client, err := supa.NewClientFromEnv()
	if err != nil {
		// 環境変数の詳細値はログに出さない
		log.Printf("DB_001: failed to init supabase client: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "backend initialization error"})
		return
	}

	q := url.Values{}
	q.Set("select", strings.Join([]string{
		"id", "sfid", "first_name", "last_name", "first_name_furigana", "last_name_furigana",
		"area_division", "group", "status", "phone_number", "remarks",
		"staff_car:vehicle(id,car_type,area,character,number,is_etc)",
	}, ","))
	q.Set("order", "created_at.desc")
	q.Set("limit", "100")

	body, _, getErr := client.Get(ctx, "/rest/v1/staff", q)
	if getErr != nil {
		log.Printf("DB_001: supabase get error: %v", getErr)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "database fetch error"})
		return
	}

	var rows []StaffDTO
	if err := json.Unmarshal(body, &rows); err != nil {
		log.Printf("DB_002: json decode error: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_002", Message: "response decode error"})
		return
	}

	// 個人情報(電話番号)は返却時にマスク
	for i := range rows {
		rows[i].PhoneNumber = maskPhone(rows[i].PhoneNumber)
	}

	c.JSON(http.StatusOK, rows)
}

