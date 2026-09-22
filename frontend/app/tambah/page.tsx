"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahBarang() {
  const router = useRouter();

  const [data, setData] = useState({
    nama_barang: "",
    deskripsi: "",
    lokasi: "",
    tanggal: "",
    kategori: "",
    status: "Hilang",
  });

  const [memuat, setMemuat] = useState(false);

  function ubahData(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  }

  async function kirimData(event: FormEvent) {
    event.preventDefault();
    setMemuat(true);

    try {
      const respons = await fetch("/api/barang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!respons.ok) {
        alert("Gagal menambahkan laporan");
        return;
      }

      alert("Laporan berhasil ditambahkan!");
      router.push("/");
      router.refresh();
    } catch (kesalahan) {
      console.error(kesalahan);
      alert("Terjadi kesalahan saat mengirim laporan");
    } finally {
      setMemuat(false);
    }
  }

  return (
    <main className="halaman-form">
      <div className="form-container">
        <button
          className="tombol-kembali"
          onClick={() => router.push("/")}
        >
          ← Kembali
        </button>

        <div className="form-header">
          <p className="label">LOST & FOUND ITS</p>
          <h1>Laporkan Barang</h1>
          <p>
            Isi informasi barang yang hilang atau ditemukan.
          </p>
        </div>

        <form onSubmit={kirimData} className="form-barang">
          <div className="form-group">
            <label>Nama Barang</label>
            <input
              type="text"
              name="nama_barang"
              value={data.nama_barang}
              onChange={ubahData}
              placeholder="Contoh: Dompet Hitam"
              required
            />
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              name="deskripsi"
              value={data.deskripsi}
              onChange={ubahData}
              placeholder="Jelaskan ciri-ciri barang..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Lokasi</label>
            <input
              type="text"
              name="lokasi"
              value={data.lokasi}
              onChange={ubahData}
              placeholder="Contoh: Gedung Teknik Informatika ITS"
              required
            />
          </div>

          <div className="dua-kolom">
            <div className="form-group">
              <label>Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={data.tanggal}
                onChange={ubahData}
                required
              />
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select
                name="kategori"
                value={data.kategori}
                onChange={ubahData}
                required
              >
                <option value="">Pilih kategori</option>
                <option value="Barang Pribadi">Barang Pribadi</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Dokumen">Dokumen</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>

            <div className="pilihan-status">
              <label
                className={
                  data.status === "Hilang" ? "status-pilihan aktif" : "status-pilihan"
                }
              >
                <input
                  type="radio"
                  name="status"
                  value="Hilang"
                  checked={data.status === "Hilang"}
                  onChange={ubahData}
                />
                Barang Hilang
              </label>

              <label
                className={
                  data.status === "Ditemukan"
                    ? "status-pilihan aktif"
                    : "status-pilihan"
                }
              >
                <input
                  type="radio"
                  name="status"
                  value="Ditemukan"
                  checked={data.status === "Ditemukan"}
                  onChange={ubahData}
                />
                Barang Ditemukan
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="tombol-submit"
            disabled={memuat}
          >
            {memuat ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </form>
      </div>
    </main>
  );
}