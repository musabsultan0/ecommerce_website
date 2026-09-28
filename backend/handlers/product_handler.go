package handlers

import (
	"ecommerce-backend/models"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

// catalog is generated once at server startup and held in memory for the
// lifetime of the process. It intentionally resets on restart — there is
// no database in this project (see README, section 6).
var catalog = models.GenerateProducts()

// GetProducts handles GET /api/products and returns the full catalog as a
// JSON array. Supports an optional ?category= query filter used by the
// frontend's category chips.
func GetProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "method not allowed"})
		return
	}

	category := r.URL.Query().Get("category")
	if category == "" || strings.EqualFold(category, "all") {
		json.NewEncoder(w).Encode(catalog)
		return
	}

	filtered := make([]models.Product, 0)
	for _, p := range catalog {
		if strings.EqualFold(p.Category, category) {
			filtered = append(filtered, p)
		}
	}
	json.NewEncoder(w).Encode(filtered)
}

// GetProductByID handles GET /api/products/{id} and returns a single
// product, or a 404 JSON body if the id doesn't exist.
func GetProductByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "method not allowed"})
		return
	}

	idStr := strings.TrimPrefix(r.URL.Path, "/api/products/")
	idStr = strings.Trim(idStr, "/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid product id"})
		return
	}

	for _, p := range catalog {
		if p.ID == id {
			json.NewEncoder(w).Encode(p)
			return
		}
	}

	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(map[string]string{"error": "product not found"})
}
