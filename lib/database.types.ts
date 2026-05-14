export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      anggota: {
        Row: {
          id: string;
          nama: string;
          kelas: string;
          jabatan: string | null;
          periode_kepengurusan: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          kelas: string;
          jabatan?: string | null;
          periode_kepengurusan: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          kelas?: string;
          jabatan?: string | null;
          periode_kepengurusan?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      kegiatan: {
        Row: {
          id: string;
          nama_kegiatan: string;
          jenis: "Kajian" | "Sosial" | "Shalat";
          tanggal: string;
          lokasi: string;
          deskripsi: string | null;
        };
        Insert: {
          id?: string;
          nama_kegiatan: string;
          jenis: "Kajian" | "Sosial" | "Shalat";
          tanggal: string;
          lokasi: string;
          deskripsi?: string | null;
        };
        Update: {
          id?: string;
          nama_kegiatan?: string;
          jenis?: "Kajian" | "Sosial" | "Shalat";
          tanggal?: string;
          lokasi?: string;
          deskripsi?: string | null;
        };
        Relationships: [];
      };
      absensi: {
        Row: {
          id: string;
          kegiatan_id: string;
          anggota_id: string;
          status: "Hadir" | "Izin" | "Sakit" | "Alpa";
          timestamp: string;
        };
        Insert: {
          id?: string;
          kegiatan_id: string;
          anggota_id: string;
          status: "Hadir" | "Izin" | "Sakit" | "Alpa";
          timestamp?: string;
        };
        Update: {
          id?: string;
          kegiatan_id?: string;
          anggota_id?: string;
          status?: "Hadir" | "Izin" | "Sakit" | "Alpa";
          timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "absensi_anggota_id_fkey";
            columns: ["anggota_id"];
            referencedRelation: "anggota";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "absensi_kegiatan_id_fkey";
            columns: ["kegiatan_id"];
            referencedRelation: "kegiatan";
            referencedColumns: ["id"];
          },
        ];
      };
      materi: {
        Row: {
          id: string;
          judul: string;
          tipe: "Artikel" | "Materi" | "Jadwal";
          file_url: string | null;
          content_body: string | null;
          author_id: string | null;
          created_at: string;
          slug: string | null;
          excerpt: string | null;
          gradient: string | null;
          reading_time: string | null;
          tag: string | null;
          date: string | null;
          author_name: string | null;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          judul: string;
          tipe: "Artikel" | "Materi" | "Jadwal";
          file_url?: string | null;
          content_body?: string | null;
          author_id?: string | null;
          created_at?: string;
          slug?: string | null;
          excerpt?: string | null;
          gradient?: string | null;
          reading_time?: string | null;
          tag?: string | null;
          date?: string | null;
          author_name?: string | null;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          judul?: string;
          tipe?: "Artikel" | "Materi" | "Jadwal";
          file_url?: string | null;
          content_body?: string | null;
          author_id?: string | null;
          created_at?: string;
          slug?: string | null;
          excerpt?: string | null;
          gradient?: string | null;
          reading_time?: string | null;
          tag?: string | null;
          date?: string | null;
          author_name?: string | null;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "materi_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "anggota";
            referencedColumns: ["id"];
          },
        ];
      };
      galeri: {
        Row: {
          id: string;
          caption: string;
          image_url: string;
          nama_kegiatan: string | null;
          tanggal: string | null;
          deskripsi: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          caption: string;
          image_url: string;
          nama_kegiatan?: string | null;
          tanggal?: string | null;
          deskripsi?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          caption?: string;
          image_url?: string;
          nama_kegiatan?: string | null;
          tanggal?: string | null;
          deskripsi?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
