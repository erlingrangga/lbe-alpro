"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Barang = {
  id: number;
  nama_barang: string;
  deskripsi: string;
  lokasi: string;
  tanggal: string;
  kategori: string;
  status: string;
};

export default function DetailBarang() {
  const params = useParams();
  const router = useRouter();

  const [barang, setBarang] = useState<Barang | null>(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    async function ambilBarang() {
      try {
        const respons = await fetch(`/api/barang/${params.id}`);

        if (!respons.ok) {
          setBarang(null);
          return;
        }

        const data = await respons.json();
        setBarang(data);
      } catch (kesalahan) {
        console.error(kesalahan);
      } finally {
        setMemuat(false);
      }
    }

    ambilBarang();
  }, [params.id]);

  if (memuat) {
    return (
      <main className="halaman-detail">
        <div className="detail-container">
          <p>Memuat data...</p>
        </div>
      </main>
    );
  }

  if (!barang) {
    return (
      <main className="halaman-detail">
        <div className="detail-container">
          <h1>Barang tidak ditemukan</h1>

          <button
            className="tombol-kembali-detail"
            onClick={() => router.push("/")}
          >
            ← Kembali
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="halaman-detail">
      <div className="detail-container">
        <button
          className="tombol-kembali-detail"
          onClick={() => router.push("/")}
        >
          ← Kembali ke daftar
        </button>

        <div className="detail-kartu">
          <div className="detail-atas">
            <span
              className={
                barang.status === "Hilang"
                  ? "status hilang"
                  : "status ditemukan"
              }
            >
              {barang.status}
            </span>

            <span className="kategori">
              {barang.kategori}
            </span>
          </div>

          <h1>{barang.nama_barang}</h1>

          <p className="detail-deskripsi">
            {barang.deskripsi}
          </p>

          <div className="detail-info">
            <div>
              <span>📍 Lokasi</span>
              <strong>{barang.lokasi}</strong>
            </div>

            <div>
              <span>📅 Tanggal</span>
              <strong>{barang.tanggal}</strong>
            </div>

            <div>
              <span>🏷️ Kategori</span>
              <strong>{barang.kategori}</strong>
            </div>

            <div>
              <span>📌 Status</span>
              <strong>{barang.status}</strong>
            </div>
          </div>

          <div className="detail-aksi">
            <button
              className="tombol-edit"
              onClick={() => router.push(`/barang/${barang.id}/edit`)}
            >
              Edit Laporan
            </button>

            <button
              className="tombol-kembali-bawah"
              onClick={() => router.push("/")}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}