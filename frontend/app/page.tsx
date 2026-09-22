"use client";

import { useEffect, useState } from "react";

type Barang = {
  id: number;
  nama_barang: string;
  deskripsi: string;
  lokasi: string;
  tanggal: string;
  kategori: string;
  status: string;
};

export default function Home() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [filter, setFilter] = useState("Semua");
  const [memuat, setMemuat] = useState(true);

  async function ambilBarang() {
    try {
      const respons = await fetch("/api/barang");
      const data = await respons.json();

      setBarangs(data);
    } catch (kesalahan) {
      console.error("Gagal mengambil data:", kesalahan);
    } finally {
      setMemuat(false);
    }
  }

  async function hapusBarang(id: number) {
    const yakin = confirm("Yakin ingin menghapus laporan ini?");

    if (!yakin) {
      return;
    }

    try {
      const respons = await fetch(`/api/barang/${id}`, {
        method: "DELETE",
      });

      if (respons.ok) {
        setBarangs((data) => data.filter((barang) => barang.id !== id));
      }
    } catch (kesalahan) {
      console.error("Gagal menghapus barang:", kesalahan);
    }
  }

  useEffect(() => {
    ambilBarang();
  }, []);

  const barangDitampilkan =
    filter === "Semua"
      ? barangs
      : barangs.filter((barang) => barang.status === filter);

  return (
    <main className="halaman">
      <nav className="navbar">
        <div className="logo">
          <span>LOST</span> & FOUND ITS
        </div>

        <a href="/tambah" className="tombol-lapor">
          + Laporkan Barang
        </a>
      </nav>

      <section className="hero">
        <div>
          <p className="label">LOST & FOUND ITS</p>

          <h1>
            Temukan kembali
            <br />
            barangmu.
          </h1>

          <p className="deskripsi-hero">
            Platform sederhana untuk melaporkan dan mencari barang
            hilang maupun barang yang ditemukan di lingkungan ITS.
          </p>
        </div>
      </section>

      <section className="konten">
        <div className="judul-section">
          <div>
            <h2>Laporan Barang</h2>
            <p>Daftar barang hilang dan ditemukan.</p>
          </div>

          <div className="filter">
            {["Semua", "Hilang", "Ditemukan"].map((pilihan) => (
              <button
                key={pilihan}
                className={filter === pilihan ? "aktif" : ""}
                onClick={() => setFilter(pilihan)}
              >
                {pilihan}
              </button>
            ))}
          </div>
        </div>

        {memuat ? (
          <div className="kosong">Memuat data...</div>
        ) : barangDitampilkan.length === 0 ? (
          <div className="kosong">
            <div className="ikon-kosong">📦</div>
            <h3>Belum ada laporan</h3>
            <p>Belum ada barang yang sesuai dengan filter ini.</p>
          </div>
        ) : (
          <div className="daftar-barang">
            {barangDitampilkan.map((barang) => (
              <article className="kartu" key={barang.id}>
                <div className="atas-kartu">
                  <span
                    className={
                      barang.status === "Hilang"
                        ? "status hilang"
                        : "status ditemukan"
                    }
                  >
                    {barang.status}
                  </span>

                  <span className="kategori">{barang.kategori}</span>
                </div>

                <h3>{barang.nama_barang}</h3>

                <p className="deskripsi">{barang.deskripsi}</p>

                <div className="informasi">
                  <p>
                    <span>📍</span>
                    {barang.lokasi}
                  </p>

                  <p>
                    <span>📅</span>
                    {barang.tanggal}
                  </p>
                </div>

                <div className="aksi">
  <a href={`/barang/${barang.id}`} className="tombol-detail">
    Detail
  </a>

  <a
    href={`/barang/${barang.id}/edit`}
    className="tombol-edit-kecil"
  >
    Edit
  </a>

  <button
    className="tombol-hapus"
    onClick={() => hapusBarang(barang.id)}
  >
    Hapus
  </button>
</div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>
        <p>Lost & Found ITS — 2026</p>
      </footer>
    </main>
  );
}