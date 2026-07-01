import { Injectable } from '@angular/core';
import type { Student } from './state';
import type { Hadith } from './hadith-data';

type Status = 'memorized' | 'review' | 'none';

interface ApiResponse<T> {
  success?: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api';

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `Request failed: ${res.status}`);
    }
    return res.json();
  }

  // ── Students ──
  async getStudents(): Promise<Student[]> {
    return this.request('GET', '/students');
  }

  async saveStudent(student: Partial<Student>): Promise<Student> {
    return this.request('POST', '/students', student);
  }

  async deleteStudent(id: string): Promise<ApiResponse<void>> {
    return this.request('DELETE', `/students/${id}`);
  }

  // ── Hadiths ──
  async getHadiths(): Promise<Hadith[]> {
    return this.request('GET', '/hadiths');
  }

  async saveHadith(hadith: Partial<Hadith>): Promise<Hadith> {
    return this.request('POST', '/hadiths', hadith);
  }

  async deleteHadith(number: number): Promise<ApiResponse<void>> {
    return this.request('DELETE', `/hadiths/${number}`);
  }

  // ── Student Hadith Status ──
  async setHadithStatus(studentId: string, hadithNumber: number, status: Status): Promise<{ xp: number }> {
    return this.request('POST', '/student-hadiths', { student_id: studentId, hadith_number: hadithNumber, status });
  }

  // ── Student Surah Status ──
  async setSurahStatus(studentId: string, surahNumber: number, status: Status): Promise<{ xp: number }> {
    return this.request('POST', '/student-surahs', { student_id: studentId, surah_number: surahNumber, status });
  }

  async markSurahPage(studentId: string, pageId: string): Promise<{ xp: number }> {
    return this.request('POST', '/student-surah-pages', { student_id: studentId, page_id: pageId });
  }

  async unmarkSurahPage(studentId: string, pageId: string): Promise<{ xp: number }> {
    return this.request('DELETE', `/student-surah-pages/${studentId}/${encodeURIComponent(pageId)}`);
  }

  // ── English Units ──
  async getEnglishUnits(): Promise<{ unitNumber: number; words: { word: string; definition: string }[] }[]> {
    return this.request('GET', '/english-units');
  }

  // ── Student English Progress ──
  async setEnglishProgress(studentId: string, unitNumber: number, status: Status): Promise<{ xp: number }> {
    return this.request('POST', '/student-english-progress', { student_id: studentId, unit_number: unitNumber, status });
  }

  // ── Badges ──
  async getBadges(): Promise<any[]> {
    return this.request('GET', '/badges');
  }

  async getAllStudentBadges(): Promise<any[]> {
    return this.request('GET', '/student-badges');
  }

}
