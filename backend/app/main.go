package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"time"
	"encoding/json"
)

// ログ構造体の定義
type LogEntry struct {
	Status     int           `json:"status"`
	Duration   string        `json:"duration"`
	ClientIP   string        `json:"clientIP"`
	Method     string        `json:"method"`
	Path       string        `json:"path"`
	Timestamp  string        `json:"timestamp"`
}

func main() {
	r := gin.Default()
	
	// JSON形式でログを出力するミドルウェア
	r.Use(func(c *gin.Context) {
		startTime := time.Now()
		c.Next()
		
		logEntry := LogEntry{
			Status:    c.Writer.Status(),
			Duration:  time.Since(startTime).String(),
			ClientIP:  c.ClientIP(),
			Method:    c.Request.Method,
			Path:      c.Request.RequestURI,
			Timestamp: time.Now().Format(time.RFC3339),
		}
		
		jsonLog, _ := json.Marshal(logEntry)
		log.Println(string(jsonLog))
	})

	r.GET("/", func(c *gin.Context) {
		log.Printf(`{"message": "リクエスト処理開始: /", "timestamp": "%s"}`, 
			time.Now().Format(time.RFC3339))
		c.JSON(200, gin.H{
			"message": "hello world from lambda with lwa",
		})
	})
	
	r.Run() // listen and serve on 0.0.0.0:8080
}
