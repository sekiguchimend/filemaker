package main

import (
	"log"
	"time"

	config "nissyo/internal/config"
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

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
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
	}

	router.Run(":8080")
}
