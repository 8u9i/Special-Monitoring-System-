import { Injectable } from '@angular/core';
import type { Student, VocabList } from './state';
import type { Hadith } from './hadith-data';

type Status = 'memorized' | 'review' | 'none';

interface ApiResponse<T> {
  success?: boolean;
  error?: string;
}

interface SyncPayload {
  students?: Partial<Student>[];
  hadiths?: Partial<Hadith>[];
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

  async saveHadith(hadith: Partial<Hadith> & { number: number }): Promise<Hadith> {
    return this.request('POST', '/hadiths', hadith);
  }

  async deleteHadith(number: number): Promise<ApiResponse<void>> {
    return this.request('DELETE', `/hadiths/${number}`);
  }

  // ── Student Hadith Status ──
  async setHadithStatus(studentId: string, hadithNumber: number, status: Status): Promise<void> {
    await this.request('POST', '/student-hadiths', { student_id: studentId, hadith_number: hadithNumber, status });
  }

  // ── Student Surah Status ──
  async setSurahStatus(studentId: string, surahNumber: number, status: Status): Promise<void> {
    await this.request('POST', '/student-surahs', { student_id: studentId, surah_number: surahNumber, status });
  }

  async markSurahPage(studentId: string, pageId: string): Promise<void> {
    await this.request('POST', '/student-surah-pages', { student_id: studentId, page_id: pageId });
  }

  async unmarkSurahPage(studentId: string, pageId: string): Promise<void> {
    await this.request('DELETE', `/student-surah-pages/${studentId}/${encodeURIComponent(pageId)}`);
  }

  // ── Vocab Lists ──
  async getVocabLists(): Promise<VocabList[]> {
    return this.request('GET', '/vocab-lists');
  }

  async saveVocabList(list: { id: string; name: string; words: { word: string; definition: string }[] }): Promise<ApiResponse<void>> {
    return this.request('POST', '/vocab-lists', list);
  }

  async deleteVocabList(id: string): Promise<ApiResponse<void>> {
    return this.request('DELETE', `/vocab-lists/${id}`);
  }

  // ── Student Vocab Status ──
  async setVocabStatus(studentId: string, vocabId: string, status: Status): Promise<void> {
    await this.request('POST', '/student-vocab', { student_id: studentId, vocab_id: vocabId, status });
  }

  // ── English Units ──
  async setEnglishUnitStatus(studentId: string, unitId: string, status: Status): Promise<void> {
    await this.request('POST', '/student-english-units', { student_id: studentId, unit_id: unitId, status });
  }

  // ── Bulk Sync ──
  async sync(data: SyncPayload): Promise<ApiResponse<void>> {
    return this.request('POST', '/sync', data);
  }
}
