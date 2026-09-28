package main

import (
	"ecommerce-backend/handlers"
	"log"
	"net/http"
)

// enableCORS wraps a handler so the Next.js frontend (running on a
// different port, e.g. localhost:3000) is allowed to call this API
// (running on localhost:8080). Without this, browsers block the request.
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

	// /api/products        -> list all products
	// /api/products/{id}   -> single product
	// We route both through one pattern and let the handler decide,
	// based on whether a trailing id segment is present.
	mux.HandleFunc("/api/products", enableCORS(handlers.GetProducts))
	mux.HandleFunc("/api/products/", enableCORS(handlers.GetProductByID))

	// Simple health check endpoint — useful for debugging.
	mux.HandleFunc("/api/health", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	}))

	port := "8080"
	log.Printf("Backend server running at http://localhost:%s\n", port)
	log.Printf("Try: http://localhost:%s/api/products\n", port)

	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}
