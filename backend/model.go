package main

type Barang struct {
	ID         uint   `json:"id" gorm:"primaryKey"`
	NamaBarang string `json:"nama_barang"`
	Deskripsi  string `json:"deskripsi"`
	Lokasi     string `json:"lokasi"`
	Tanggal    string `json:"tanggal"`
	Kategori   string `json:"kategori"`
	Status     string `json:"status"`
}