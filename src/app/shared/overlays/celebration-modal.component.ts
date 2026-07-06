import { Component, inject, HostListener } from '@angular/core';
import { CelebrationService } from '../services/celebration.service';
import { getAvatarEmoji } from '../constants/avatars';

@Component({
  selector: 'app-celebration-modal',
  template: `
    @if (celeb.show()) { @let student = celeb.student(); @let stage = celeb.stage();
    <div class="fixed inset-0 bg-black/60 z-55 flex items-center justify-center p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="celebrationTitle" (click)="close()">
      <div class="modal-panel max-w-md text-center relative overflow-hidden" (click)="$event.stopPropagation()">
        <div class="w-20 h-20 bg-[var(--color-amber-light)] flex items-center justify-center mx-auto mb-5 relative">
          @if (stage) {
          <span class="material-icons text-4xl text-[var(--color-amber)]">{{ stage.badgeIcon }}</span>
          }
          <span class="absolute -top-2 -right-2 text-2xl animate-bounce">👑</span>
        </div>

        <p class="text-[11px] text-[var(--color-primary-dark)] font-bold tracking-widest uppercase">ارتقاء مبارك!</p>
        <h3 id="celebrationTitle" class="font-tajawal text-2xl font-bold text-[var(--color-text-primary)] mt-2 mb-4">مبارك الارتقاء!</h3>

        @if (student && stage) {
        <div class="my-4 p-5 bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
          <p class="text-xs text-[var(--color-text-secondary)] font-semibold">ارتقى البطل:</p>
          <p class="font-bold text-xl text-[var(--color-text-primary)] my-1 flex items-center justify-center gap-2">
            <span>{{ getAvatarEmoji(student.avatar) }}</span>
            <span>{{ student.name }}</span>
          </p>
          <div class="w-1/2 h-px border-t border-dashed border-[var(--color-border)] mx-auto my-3"></div>
          <p class="text-[11px] text-[var(--color-text-tertiary)] font-bold uppercase">إلى مستوى</p>
          <p class="font-tajawal text-lg font-bold text-[var(--color-primary-dark)] mt-1">{{ stage.name }}</p>
          <p class="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed px-4">{{ stage.description }}</p>
        </div>

        <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed px-6">
          وصل {{ student.name }} إلى
          <strong class="text-[var(--color-primary-dark)]">{{ student.memorizedHadithNumbers.length }} أحاديث نبوية</strong>
        </p>
        }

        <div class="mt-6 w-full">
          <button (click)="celeb.dismiss()"
            class="btn btn-primary btn-md w-full">
            <span class="material-icons">spa</span>
            مواصلة رحلة الحفظ
          </button>
        </div>
      </div>
    </div>
    }
  `,
})
export class CelebrationModalComponent {
  celeb = inject(CelebrationService);

  getAvatarEmoji = getAvatarEmoji;

  close() {
    this.celeb.dismiss();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
