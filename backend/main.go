package main

import (
	"ecommerce-backend/handlers"
	"log"
	"net/http"
	"os"
)

// enableCORS allows the Next.js frontend to call the Go backend.
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {

	mux := http.NewServeMux()

	// Get all products
	mux.HandleFunc(
		"/api/products",
		enableCORS(handlers.GetProducts),
	)

	// Get a single product by ID
	mux.HandleFunc(
		"/api/products/",
		enableCORS(handlers.GetProductByID),
	)

	// Health check endpoint
	mux.HandleFunc(
		"/api/health",
		enableCORS(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"status":"ok"}`))
		}),
	)

	// Get the port from the hosting platform
	port := os.Getenv("PORT")

	// Use 8080 for local development
	if port == "" {
		port = "8080"
	}

	log.Println("Backend server running on port", port)

	log.Fatal(http.ListenAndServe(":"+port, mux))
}