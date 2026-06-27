import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerState, VocabList, Student } from '../../state';
import { StudentCarouselComponent } from '../../shared/containers/student-carousel.component';
import { StudentStageCardComponent } from '../../shared/containers/student-stage-card.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-english-trail',
  imports: [CommonModule, StudentCarouselComponent, StudentStageCardComponent],
  template: `
    <style>@import url('https://fonts.googleapis.com/css2?family=Cause:wght@100..900&display=swap');</style>
    <div class="space-y-8" style="font-family: 'Cause', sans-serif;">
      <app-student-carousel />

      @if (state.selectedStudent(); as student) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <app-student-stage-card [student]="student" />

        <div class="space-y-6 lg:col-span-2">
          <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
              <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span class="material-icons text-[var(--color-primary)]">language</span>
                قوائم المفردات
              </h3>
              <div class="flex flex-col items-end gap-1 text-xs font-medium text-[var(--color-text-secondary)]">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-none bg-[var(--color-primary)]"></span> محفوظ</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-none bg-[var(--color-amber)]"></span> مراجعة</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-none bg-[var(--color-border)]"></span> لم يبدأ</span>
              </div>
            </div>

            <!-- Vocab Lists Grid -->
            <div class="grid grid-cols-4 sm:grid-cols-6 gap-3">
              @for (list of state.vocabLists(); track list.id) {
              @let listStatus = getVocabListStatus(student, list);
              @let progress = getListProgress(student, list);
              <button (click)="onVocabListNodeClick(list)"
                class="aspect-square rounded-none border flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer"
                [class.bg-[var(--color-surface)]]="listStatus === 'none'"
                [class.bg-emerald-50]="listStatus === 'memorized'"
                [class.bg-[var(--color-amber-light)]]="listStatus === 'review'"
                [class.border-[var(--color-primary)]]="listStatus === 'memorized' || selectedVocabListForDetail()?.id === list.id"
                [class.border-[var(--color-amber)]]="listStatus === 'review'"
                [class.border-[var(--color-border-light)]]="listStatus === 'none' && selectedVocabListForDetail()?.id !== list.id"
                [class.bg-[var(--color-primary-light)]]="selectedVocabListForDetail()?.id === list.id"
                title="{{ list.name }}">
                <span class="material-icons text-xl"
                  [class.text-[var(--color-primary)]]="listStatus !== 'review'"
                  [class.text-[var(--color-amber)]]="listStatus === 'review'">translate</span>
                <span class="text-[9px] font-semibold mt-1 leading-tight px-1 text-center line-clamp-2"
                  [class.text-[var(--color-text-secondary)]]="listStatus === 'none'"
                  [class.text-[var(--color-primary-dark)]]="listStatus === 'memorized'"
                  [class.text-[var(--color-text-primary)]]="listStatus === 'review'">{{ list.name }}</span>
                @if (progress.done > 0) {
                <span class="text-[8px] font-bold mt-0.5"
                  [class.text-[var(--color-primary)]]="listStatus === 'memorized'"
                  [class.text-[var(--color-amber)]]="listStatus === 'review'">{{ progress.done }}/{{ progress.total }}</span>
                }
              </button>
              } @empty {
              <div class="col-span-full text-center py-8 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
                <span class="material-icons text-3xl text-[var(--color-text-tertiary)]">translate</span>
                <p class="text-[var(--color-text-secondary)] font-medium mt-2 text-sm">لا توجد قوائم مفردات بعد</p>
                <p class="text-xs text-[var(--color-text-tertiary)] mt-1">أضف قوائم من صفحة المناهج التعليمية</p>
              </div>
              }
            </div>
          </div>

          <!-- Vocab List Detail -->
          @if (selectedVocabListForDetail(); as list) {
          @let progress = getListProgress(student, list);
          <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-light)]">
              <div class="flex-1">
                <h4 class="font-inter text-lg font-bold text-[var(--color-text-primary)]">{{ list.name }}</h4>
                <div class="flex items-center gap-3 mt-2">
                  <div class="flex-1 h-2 bg-[var(--color-canvas)] rounded-none overflow-hidden flex justify-end">
                    <div class="h-full bg-[var(--color-primary)] rounded-none transition-all duration-300"
                      [style.width.%]="progress.percent"></div>
                  </div>
                  <span class="text-xs font-bold text-[var(--color-text-secondary)] whitespace-nowrap">{{ progress.done }} / {{ progress.total }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 mr-4">
                <button (click)="onMarkAll(student.id, list)"
                  class="px-3 py-2 rounded-none text-xs font-semibold border transition-all cursor-pointer"
                  [class]="progress.done === progress.total
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-[var(--color-canvas)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'"
                  [attr.aria-label]="progress.done === progress.total ? 'تم تحديد الكل' : 'تحديد الكل كمحفوظ'">
                  <span class="material-icons text-sm align-middle">{{ progress.done === progress.total ? 'check_circle' : 'check_circle_outline' }}</span>
                  {{ progress.done === progress.total ? 'تم' : 'تحديد الكل' }}
                </button>
                @if (progress.done > 0) {
                <button (click)="onClearAll(student.id, list)"
                  class="px-3 py-2 rounded-none text-xs font-semibold border bg-[var(--color-canvas)] text-red-500 border-red-200 hover:bg-red-50 transition-all cursor-pointer"
                  aria-label="مسح التحديد">
                  <span class="material-icons text-sm align-middle">restart_alt</span>
                  مسح
                </button>
                }
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              @for (word of list.words; track $index) {
              @let wordId = list.id + '-' + $index;
              @let isMemorized = (student.memorizedVocabWords || []).includes(wordId);
              @let isReview = (student.reviewVocabWords || []).includes(wordId);
              @let wordStatus = isMemorized ? 'memorized' : (isReview ? 'review' : 'none');
              <button (click)="toggleWord(student, list, $index)"
                class="flex items-center gap-2 p-2.5 rounded-none border text-left transition-all cursor-pointer"
                [class.border-[var(--color-primary)]]="wordStatus === 'memorized'"
                [class.bg-[var(--color-emerald-light)]]="wordStatus === 'memorized'"
                [class.border-[var(--color-amber)]]="wordStatus === 'review'"
                [class.bg-[var(--color-amber-light)]]="wordStatus === 'review'"
                [class.border-[var(--color-border-light)]]="wordStatus === 'none'"
                [class.hover:border-[var(--color-primary)]]="wordStatus === 'none'">
                <span class="w-6 h-6 rounded-none border flex items-center justify-center flex-shrink-0 transition-all"
                  [class.bg-[var(--color-primary)]]="wordStatus === 'memorized'"
                  [class.border-[var(--color-primary)]]="wordStatus === 'memorized'"
                  [class.text-white]="wordStatus === 'memorized'"
                  [class.bg-[var(--color-amber)]]="wordStatus === 'review'"
                  [class.border-[var(--color-amber)]]="wordStatus === 'review'"
                  [class.text-white]="wordStatus === 'review'"
                  [class.border-[var(--color-border)]]="wordStatus === 'none'">
                  @if (wordStatus === 'memorized') {
                  <span class="material-icons text-xs">check</span>
                  } @else if (wordStatus === 'review') {
                  <span class="material-icons text-xs">sync</span>
                  }
                </span>
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-[var(--color-text-primary)] text-sm leading-tight">{{ word.word }}</p>
                  <p class="text-[10px] leading-tight"
                    [class.text-[var(--color-text-secondary)]]="wordStatus !== 'review'"
                    [class.text-[var(--color-text-primary)]]="wordStatus === 'review'">{{ word.definition }}</p>
                </div>
              </button>
              }
            </div>
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
})
export class EnglishTrailComponent {
  state = inject(TrackerState);
  toast = inject(ToastService);
  selectedVocabListForDetail = signal<VocabList | null>(null);

  getListProgress(student: Student, list: VocabList) {
    const memorized = student.memorizedVocabWords || [];
    const done = list.words.filter((_, i) => memorized.includes(list.id + '-' + i)).length;
    const total = list.words.length;
    return { done, total, percent: total > 0 ? (done / total) * 100 : 0 };
  }

  getVocabListStatus(student: Student, list: VocabList): 'memorized' | 'review' | 'none' {
    const { done, total } = this.getListProgress(student, list);
    if (done === total) return 'memorized';
    if (done > 0) return 'review';
    return 'none';
  }

  onVocabListNodeClick(list: VocabList) {
    this.selectedVocabListForDetail.set(list);
  }

  toggleWord(student: Student, list: VocabList, wordIndex: number) {
    const vocabId = `${list.id}-${wordIndex}`;
    const isMemorized = (student.memorizedVocabWords || []).includes(vocabId);
    const isReview = (student.reviewVocabWords || []).includes(vocabId);

    if (isMemorized) {
      this.state.toggleVocabStatus(student.id, list.id, wordIndex, 'review');
    } else if (isReview) {
      this.state.toggleVocabStatus(student.id, list.id, wordIndex, 'none');
    } else {
      this.state.toggleVocabStatus(student.id, list.id, wordIndex, 'memorized');
    }

    // Refresh template reference to trigger change detection
    this.selectedVocabListForDetail.set({ ...list });
  }

  onMarkAll(studentId: string, list: VocabList) {
    const progress = this.getListProgress(this.state.selectedStudent()!, list);
    if (progress.done === progress.total) return;
    this.state.markAllVocab(studentId, list.id, list.words.length);
    this.toast.show('تم تحديد جميع المفردات كمحفوظة.');
  }

  onClearAll(studentId: string, list: VocabList) {
    this.state.clearAllVocab(studentId, list.id, list.words.length);
    this.toast.show('تم مسح التحديد.');
  }
}
