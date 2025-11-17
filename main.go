package main

import (
	"log"
	"os"
	"strings"
	"time"

	config "nissyo/internal/config"
	shop "nissyo/internal/shop"
	staff "nissyo/internal/staff"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	if err := config.LoadEnvIfPresent(); err != nil {
		// 読み込み失敗は致命的ではないためログのみに留める（値はOS環境変数から取得される）
		log.Printf("init: .env load warning: %v", err)
	}

	router := gin.Default()

	// CORS AllowOrigins を環境変数 CORS_ALLOW_ORIGINS から読み込み（カンマ区切り）
	originsEnv := os.Getenv("CORS_ALLOW_ORIGINS")
	if strings.TrimSpace(originsEnv) == "" {
		originsEnv = "http://localhost:3000"
	}
	var allowOrigins []string
	for _, o := range strings.Split(originsEnv, ",") {
		t := strings.TrimSpace(o)
		if t != "" {
			allowOrigins = append(allowOrigins, t)
		}
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "PATCH", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := router.Group("/api")
	{
		api.GET("/staff-ledger", staff.GetStaffLedgerHandler)
		api.GET("/staff/:id", staff.GetStaffDetailHandler)
		api.PATCH("/staff/:id", staff.UpdateStaffHandler)
		api.GET("/shops", shop.GetShopListHandler)
		api.GET("/shops/:id", shop.GetShopDetailHandler)
	}

	router.Run(":8080")
}
