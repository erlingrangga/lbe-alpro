package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	alamat := "host=localhost user=postgres password=Presiden1? dbname=lost_found_its port=5432 sslmode=disable"

	database, kesalahan := gorm.Open(postgres.Open(alamat), &gorm.Config{})

	if kesalahan != nil {
		log.Fatal("Gagal terhubung ke database:", kesalahan)
	}

	fmt.Println("Berhasil terhubung ke PostgreSQL")

	kesalahan = database.AutoMigrate(&Barang{})

	if kesalahan != nil {
		log.Fatal("Gagal membuat tabel:", kesalahan)
	}

	fmt.Println("Tabel barang berhasil dibuat")

	rute := gin.Default()

	rute.GET("/", func(konteks *gin.Context) {
		konteks.JSON(200, gin.H{
			"pesan": "Backend Lost & Found ITS berjalan",
		})
	})

	rute.GET("/api/barang", func(konteks *gin.Context) {
		var barangs []Barang

		hasil := database.Find(&barangs)

		if hasil.Error != nil {
			konteks.JSON(500, gin.H{
				"pesan": "Gagal mengambil data barang",
			})
			return
		}

		konteks.JSON(200, barangs)
	})

	rute.POST("/api/barang", func(konteks *gin.Context) {
	var barang Barang

	if kesalahan := konteks.ShouldBindJSON(&barang); kesalahan != nil {
		konteks.JSON(400, gin.H{
			"pesan": "Data yang dikirim tidak valid",
		})
		return
	}

	hasil := database.Create(&barang)

	if hasil.Error != nil {
		konteks.JSON(500, gin.H{
			"pesan": "Gagal menambahkan barang",
		})
		return
	}

	konteks.JSON(201, barang)
})

rute.GET("/api/barang/:id", func(konteks *gin.Context) {
	var barang Barang

	id := konteks.Param("id")

	hasil := database.First(&barang, id)

	if hasil.Error != nil {
		konteks.JSON(404, gin.H{
			"pesan": "Barang tidak ditemukan",
		})
		return
	}

	konteks.JSON(200, barang)
})

rute.PUT("/api/barang/:id", func(konteks *gin.Context) {
	var barang Barang

	id := konteks.Param("id")

	hasil := database.First(&barang, id)

	if hasil.Error != nil {
		konteks.JSON(404, gin.H{
			"pesan": "Barang tidak ditemukan",
		})
		return
	}

	if kesalahan := konteks.ShouldBindJSON(&barang); kesalahan != nil {
		konteks.JSON(400, gin.H{
			"pesan": "Data yang dikirim tidak valid",
		})
		return
	}

	hasil = database.Save(&barang)

	if hasil.Error != nil {
		konteks.JSON(500, gin.H{
			"pesan": "Gagal mengubah data barang",
		})
		return
	}

	konteks.JSON(200, barang)
})

rute.DELETE("/api/barang/:id", func(konteks *gin.Context) {
	var barang Barang

	id := konteks.Param("id")

	hasil := database.First(&barang, id)

	if hasil.Error != nil {
		konteks.JSON(404, gin.H{
			"pesan": "Barang tidak ditemukan",
		})
		return
	}

	hasil = database.Delete(&barang)

	if hasil.Error != nil {
		konteks.JSON(500, gin.H{
			"pesan": "Gagal menghapus barang",
		})
		return
	}

	konteks.JSON(200, gin.H{
		"pesan": "Barang berhasil dihapus",
	})
})

	fmt.Println("Server berjalan di http://localhost:8080")

	rute.Run(":8080")
}