package models

import (
	"encoding/base64"
	"fmt"
	"html"
	"strconv"
	"strings"
)

// contrastingTextColor returns "000000" or "ffffff" (no leading #) depending
// on which reads better against the given background hex color.
func contrastingTextColor(hex string) string {
	hex = strings.TrimPrefix(hex, "#")
	if len(hex) != 6 {
		return "ffffff"
	}
	r, _ := strconv.ParseInt(hex[0:2], 16, 0)
	g, _ := strconv.ParseInt(hex[2:4], 16, 0)
	b, _ := strconv.ParseInt(hex[4:6], 16, 0)
	luminance := 0.299*float64(r) + 0.587*float64(g) + 0.114*float64(b)
	if luminance > 150 {
		return "000000"
	}
	return "ffffff"
}

// Review is a single customer review on a product.
type Review struct {
	ID      int    `json:"id"`
	Author  string `json:"author"`
	Rating  int    `json:"rating"`
	Title   string `json:"title"`
	Comment string `json:"comment"`
	Date    string `json:"date"`
}

// Spec is one row of a product's specification table.
type Spec struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

// Product is a single sellable item, exactly as it is sent to the frontend.
type Product struct {
	ID             int      `json:"id"`
	Name           string   `json:"name"`
	Brand          string   `json:"brand"`
	Category       string   `json:"category"`
	Price          int      `json:"price"`
	OriginalPrice  int      `json:"originalPrice"`
	DiscountPct    int      `json:"discountPercent"`
	Rating         float64  `json:"rating"`
	ReviewCount    int      `json:"reviewCount"`
	Description    string   `json:"description"`
	Image          string   `json:"image"`
	Images         []string `json:"images"`
	Stock          int      `json:"stock"`
	Color          string   `json:"color"`
	ColorHex       string   `json:"colorHex"`
	Sizes          []string `json:"sizes,omitempty"`
	Specifications []Spec   `json:"specifications"`
	Reviews        []Review `json:"reviews"`
	RelatedIDs     []int    `json:"relatedIds"`
}

// seed is the hand-written definition of one product. Everything else
// (discount, rating, stock, specs, reviews) is worked out from it in
// GenerateProducts.
type seed struct {
	name        string
	brand       string
	category    string // only "Electronics" or "Fashion"
	price       int
	description string
	colorName   string
	colorHex    string
	sizes       []string
	// images: put your own image URLs here. The first one is the main picture.
	// Leave it empty ([]string{}) to use the built-in coloured picture.
	images []string
}

// 8 products: 4 Electronics + 4 Fashion.
var seeds = []seed{
	// ---------------- Electronics ----------------
	{
		name: "Wireless Over-Ear Headphones", brand: "SoundWave", category: "Electronics", price: 2499,
		description: "Over-ear wireless headphones with active noise cancellation and 40-hour battery life, built for daily commutes and long listening sessions.",
		colorName:   "Black", colorHex: "#1C1C1C",
		images: []string{"https://cdn.shopify.com/s/files/1/0965/6772/2266/files/61n2WdAQHcL.jpg?v=1785855676&width=1500"}, // TODO: paste the FULL headphones image URL here (the one you sent was cut off)
	},
	{
		name: "Smart Fitness Watch", brand: "PulseFit", category: "Electronics", price: 3999,
		description: "Track workouts, heart rate, sleep and SpO2 with a bright always-on display and 7-day battery life.",
		colorName:   "Blue", colorHex: "#2874F0",
		images: []string{"https://m.media-amazon.com/images/I/71JU-bUt-sL._AC_SL1500_.jpg"}, // TODO: paste the FULL smart watch image URL here (the one you sent was cut off)
	},
	{
		name: "Portable Bluetooth Speaker", brand: "SoundWave", category: "Electronics", price: 1999,
		description: "Compact, punchy Bluetooth speaker with 360° sound, IPX7 waterproofing and 18 hours of playtime.",
		colorName:   "Red", colorHex: "#C62828",
		images: []string{"https://tse1.mm.bing.net/th/id/OIF.tfExMx4LNLTybDOqwPxM0Q?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"},
	},
	{
		name: "True Wireless Earbuds", brand: "SoundWave", category: "Electronics", price: 1799,
		description: "Compact true wireless earbuds with touch controls, 24-hour battery with the charging case, and IPX5 sweat resistance.",
		colorName:   "Grey", colorHex: "#616161",
		images: []string{"https://i5.walmartimages.com/seo/VEATOOL-Bluetooth-Headphones-True-Wireless-Earbuds-65H-Playback-Power-Display-Earphones-Charging-Case-IPX7-Waterproof-in-Ear-Mic-TV-Smart-Phone-Compu_4fcdfe6c-8b6a-4cde-9d14-b2d02f026c7e.72bb21d7b7199d42acb8615ffbaa0470.jpeg?odnHeight=424&odnWidth=424&odnBg=FFFFFF"},
	},

	// ---------------- Fashion ----------------
	{
		name: "Running Shoes", brand: "Stride", category: "Fashion", price: 1799,
		description: "Lightweight running shoes with breathable mesh uppers and responsive cushioning for everyday training.",
		colorName:   "Orange", colorHex: "#FB8C00",
		sizes:  []string{"UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"},
		images: []string{"https://cdn.pixabay.com/photo/2014/06/18/18/41/running-shoe-371624_1280.jpg"},
	},
	{
		name: "Cotton Crew-Neck T-Shirt", brand: "Basics Co.", category: "Fashion", price: 499,
		description: "Soft, breathable 100% combed cotton t-shirt with a classic crew neck and regular fit.",
		colorName:   "Teal", colorHex: "#00838F",
		sizes:  []string{"S", "M", "L", "XL", "XXL"},
		images: []string{"https://image.hm.com/assets/hm/12/9c/129c25a0c5416aeef1810168496c181b166739f9.jpg?imwidth=1260"},
	},
	{
		name: "Travel Backpack 35L", brand: "Trailhead", category: "Fashion", price: 1499,
		description: "Rugged 35L backpack with a padded 15.6-inch laptop sleeve, rain cover, and multiple compartments.",
		colorName:   "Green", colorHex: "#2E7D32",
		images: []string{"https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/092816/01/mod01/fnd/IND/fmt/png/Scuderia-Ferrari-Pro-Weekender-Duffle-Bag-35L"},
	},
	{
		name: "Polarized Sunglasses", brand: "Horizon", category: "Fashion", price: 899,
		description: "UV400-protected polarized sunglasses with a lightweight acetate frame in a classic wayfarer style.",
		colorName:   "Purple", colorHex: "#7B1FA2",
		images: []string{"https://i.pinimg.com/originals/16/d8/59/16d85967a32b6c3745aa0f5b563d2fda.jpg"},
	},
}

var reviewBank = []struct {
	author  string
	rating  int
	title   string
	comment string
}{
	{"Ananya R.", 5, "Excellent quality", "Exactly as described and arrived well packaged. Using it daily and it's holding up great."},
	{"Vikram S.", 4, "Good value for money", "Does what it promises. Lost one star because delivery took a couple of extra days."},
	{"Priya M.", 5, "Would buy again", "Genuinely impressed with the build quality. Better than I expected at this price point."},
	{"Rahul K.", 3, "Decent, not outstanding", "It's okay. Gets the job done but nothing about it feels premium."},
	{"Sneha T.", 5, "Highly recommend", "Fast shipping, product matches the photos, and customer support was responsive when I had a question."},
	{"Arjun P.", 4, "Solid purchase", "Been using it for two weeks now, no complaints so far. Fits well and looks good."},
}

// categorySpecs returns the specification table for a category.
// Only Electronics and Fashion exist in this store.
func categorySpecs(category string) []Spec {
	switch category {
	case "Electronics":
		return []Spec{
			{"Power", "Rechargeable battery / USB powered"},
			{"Material", "ABS plastic + metal accents"},
			{"In the Box", "Unit, cable, user manual"},
			{"Warranty", "1 year manufacturer warranty"},
		}
	case "Fashion":
		return []Spec{
			{"Material", "Cotton / blended fabric"},
			{"Fit", "Regular fit"},
			{"Care", "Machine wash cold, do not bleach"},
			{"Country of Origin", "India"},
		}
	default:
		return []Spec{{"In the Box", "1 unit"}}
	}
}

// wrapWords splits text into lines of at most max characters.
func wrapWords(text string, max int) []string {
	var lines []string
	cur := ""
	for _, w := range strings.Fields(text) {
		switch {
		case cur == "":
			cur = w
		case len(cur)+1+len(w) <= max:
			cur += " " + w
		default:
			lines = append(lines, cur)
			cur = w
		}
	}
	if cur != "" {
		lines = append(lines, cur)
	}
	return lines
}

// placeholderImage draws a simple coloured picture (product name + brand) and
// returns it as a data: URI. It needs no internet connection and no extra
// files, so it always displays. It is only used when a product has no
// image URL of its own.
func placeholderImage(name, brand, hex, caption string) string {
	fg := "#" + contrastingTextColor(hex)
	lines := wrapWords(name, 16)

	var text strings.Builder
	startY := 300 - (len(lines)-1)*28
	for i, line := range lines {
		fmt.Fprintf(&text,
			`<text x="300" y="%d" text-anchor="middle" font-size="44" font-weight="700" fill="%s">%s</text>`,
			startY+i*56, fg, html.EscapeString(line))
	}

	svg := fmt.Sprintf(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" font-family="Arial, Helvetica, sans-serif">`+
		`<rect width="600" height="600" fill="%s"/>`+
		`<circle cx="500" cy="100" r="140" fill="%s" fill-opacity="0.08"/>`+
		`<circle cx="90" cy="520" r="110" fill="%s" fill-opacity="0.08"/>`+
		`<text x="300" y="90" text-anchor="middle" font-size="22" letter-spacing="3" fill="%s" fill-opacity="0.85">%s</text>`+
		`%s`+
		`<text x="300" y="530" text-anchor="middle" font-size="20" fill="%s" fill-opacity="0.85">%s</text>`+
		`</svg>`,
		hex, fg, fg, fg, html.EscapeString(strings.ToUpper(brand)), text.String(), fg, html.EscapeString(caption))

	return "data:image/svg+xml;base64," + base64.StdEncoding.EncodeToString([]byte(svg))
}

// GenerateProducts builds the in-memory catalog (8 products) from the seeds.
func GenerateProducts() []Product {
	products := make([]Product, 0, len(seeds))

	for i, s := range seeds {
		id := i + 1

		discountPct := 10 + (id % 5 * 7)
		originalPrice := s.price * 100 / (100 - discountPct)
		rating := 4.0 + float64((id*3)%10)/10.0
		if rating > 5.0 {
			rating = 5.0
		}

		// Use your own image URLs if given, otherwise the built-in picture.
		images := s.images
		if len(images) == 0 {
			images = []string{
				placeholderImage(s.name, s.brand, s.colorHex, "Front view"),
				placeholderImage(s.name, s.brand, s.colorHex, "Side view"),
				placeholderImage(s.name, s.brand, s.colorHex, "Close-up"),
			}
		}

		var reviews []Review
		for r := 0; r < 3; r++ {
			rb := reviewBank[(id+r)%len(reviewBank)]
			reviews = append(reviews, Review{
				ID:      r + 1,
				Author:  rb.author,
				Rating:  rb.rating,
				Title:   rb.title,
				Comment: rb.comment,
				Date:    fmt.Sprintf("2026-0%d-14", 1+(id+r)%9),
			})
		}

		// Related products: up to 3 others from the same category.
		var related []int
		for j, other := range seeds {
			if len(related) >= 3 {
				break
			}
			if j != i && other.category == s.category {
				related = append(related, j+1)
			}
		}

		products = append(products, Product{
			ID:             id,
			Name:           s.name,
			Brand:          s.brand,
			Category:       s.category,
			Price:          s.price,
			OriginalPrice:  originalPrice,
			DiscountPct:    discountPct,
			Rating:         rating,
			ReviewCount:    40 + (id*37)%160,
			Description:    s.description,
			Image:          images[0],
			Images:         images,
			Stock:          10 + (id*7)%30,
			Color:          s.colorName,
			ColorHex:       s.colorHex,
			Sizes:          s.sizes,
			Specifications: categorySpecs(s.category),
			Reviews:        reviews,
			RelatedIDs:     related,
		})
	}

	return products
}