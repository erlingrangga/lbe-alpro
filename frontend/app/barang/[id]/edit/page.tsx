"use client";

import { FormEvent, useEffect, useState } from "react";
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

export default function EditBarang() {
  const params = useParams();
  const router = useRouter();

  const [data, setData] = useState<Barang | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);

  useEffect(() => {
    async function ambilBarang() {
      try {
        const respons = await fetch(`/api/barang/${params.id}`);

        if (!respons.ok) {
          return;
        }

        const hasil = await respons.json();
        setData(hasil);
      } catch (kesalahan) {
        console.error(kesalahan);
      } finally {
        setMemuat(false);
      }
    }

    ambilBarang();
  }, [params.id]);

  function ubahData(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    if (!data) {
      return;
    }

    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  }

  async function simpanData(event: FormEvent) {
    event.preventDefault();

    if (!data) {
      return;
    }

    setMenyimpan(true);

    try {
      const respons = await fetch(`/api/barang/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_barang: data.nama_barang,
          deskripsi: data.deskripsi,
          lokasi: data.lokasi,
          tanggal: data.tanggal,
          kategori: data.kategori,
          status: data.status,
        }),
      });

      if (!respons.ok) {
        alert("Gagal mengubah laporan");
        return;
      }

      alert("Laporan berhasil diubah!");

      router.push(`/barang/${params.id}`);
      router.refresh();
    } catch (kesalahan) {
      console.error(kesalahan);
      alert("Terjadi kesalahan saat mengubah laporan");
    } finally {
      setMenyimpan(false);
    }
  }

  if (memuat) {
    return (
      <main className="halaman-form">
        <div className="form-container">
          <p>Memuat data...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="halaman-form">
        <div className="form-container">
          <h1>Barang tidak ditemukan</h1>

          <button
            className="tombol-kembali"
            onClick={() => router.push("/")}
          >
            ← Kembali
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="halaman-form">
      <div className="form-container">
        <button
          className="tombol-kembali"
          onClick={() => router.push(`/barang/${data.id}`)}
        >
          ← Kembali ke detail
        </button>

        <div className="form-header">
          <p className="label">LOST & FOUND ITS</p>

          <h1>Edit Laporan</h1>

          <p>
            Ubah informasi barang yang sudah dilaporkan.
          </p>
        </div>

        <form onSubmit={simpanData} className="form-barang">
          <div className="form-group">
            <label>Nama Barang</label>

            <input
              type="text"
              name="nama_barang"
              value={data.nama_barang}
              onChange={ubahData}
              required
            />
          </div>

          <div className="form-group">
            <label>Deskripsi</label>

            <textarea
              name="deskripsi"
              value={data.deskripsi}
              onChange={ubahData}
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
                <option value="Barang Pribadi">
                  Barang Pribadi
                </option>
                <option value="Elektronik">
                  Elektronik
                </option>
                <option value="Dokumen">
                  Dokumen
                </option>
                <option value="Aksesoris">
                  Aksesoris
                </option>
                <option value="Lainnya">
                  Lainnya
                </option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>

            <div className="pilihan-status">
              <label
                className={
                  data.status === "Hilang"
                    ? "status-pilihan aktif"
                    : "status-pilihan"
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
            disabled={menyimpan}
          >
            {menyimpan ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </main>
  );
}