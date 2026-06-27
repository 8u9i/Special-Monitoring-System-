import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrackerState, QURAN_SURAHS } from '../../state';
import { Hadith } from '../../hadith-data';
import { ToastService } from '../../shared/services/toast.service';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-reference',
  imports: [CommonModule],
  template: `
    <div class="space-y-5">
      <!-- Subject Selector -->
      <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)] flex items-center gap-4">
        <label for="referenceSubject" class="text-xs font-semibold text-[var(--color-text-secondary)] whitespace-nowrap">المنهج:</label>
        <div class="relative flex-1 max-w-xs">
          <select id="referenceSubject" (change)="activeReferenceSubject.set($any($event.target).value)"
            class="w-full appearance-none rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer">
            <option value="hadith">الأحاديث الشريفة</option>
            <option value="quran">سور القرآن الكريم</option>
            <option value="english">المفردات الإنجليزية</option>
          </select>
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-lg pointer-events-none icon-expand-more">expand_more</span>
        </div>
      </div>

      @if (activeReferenceSubject() === 'hadith') {
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[var(--color-primary-light)] rounded-none border border-[var(--color-primary)]/10">
        <div>
          <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span class="material-icons text-[var(--color-primary)]">library_books</span>
            دليل الأحاديث الشريفة
          </h3>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">تصفح وأضف أو عدّل الأحاديث النبوية</p>
        </div>
        <button (click)="modal.showAddHadith.set(true)"
          class="sketch-button py-2.5 px-5 text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <span class="material-icons text-sm">add_circle</span>
          إضافة حديث جديد
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="bg-[var(--color-surface)] rounded-none p-4 border border-[var(--color-border)] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="w-full md:max-w-md relative">
          <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-lg select-none">search</span>
          <input type="text" [value]="state.searchQuery()" (input)="onSearchChange($event)"
            placeholder="ابحث برقم الحديث أو الباب أو النص..."
            class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] placeholder-[var(--color-text-tertiary)] transition-colors" />
        </div>
        <div class="flex flex-wrap gap-1.5 justify-center">
          <button (click)="onCategorySelect('all')"
            [class]="state.categoryFilter() === 'all' ? 'px-3 py-1.5 rounded-none bg-[var(--color-primary)] text-white text-xs font-semibold cursor-pointer' : 'px-3 py-1.5 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] text-xs font-semibold cursor-pointer'">
            الكل
          </button>
          @for (cat of uniqueCategories(); track cat) {
          <button (click)="onCategorySelect(cat)"
            [class]="state.categoryFilter() === cat ? 'px-3 py-1.5 rounded-none bg-[var(--color-primary)] text-white text-xs font-semibold cursor-pointer' : 'px-3 py-1.5 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] text-xs font-semibold cursor-pointer'">
            {{ cat }}
          </button>
          }
        </div>
      </div>

      <!-- Hadiths Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (hadith of filteredHadiths(); track hadith.number) {
        <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border-light)]">
              <div class="flex items-center gap-2">
                <span class="w-12 h-12 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-center font-bold text-xs text-[var(--color-text-primary)] font-inter">{{ hadith.number }}</span>
                <span class="text-[10px] font-bold text-[var(--color-primary-dark)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-none">{{ hadith.category }}</span>
              </div>
              <div class="flex items-center gap-1">
                <button (click)="openEditHadith(hadith)" class="w-12 h-12 rounded-none text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] cursor-pointer transition-all flex items-center justify-center" title="تعديل" aria-label="تعديل الحديث">
                  <span class="material-icons text-xs">edit</span>
                </button>
                <button (click)="onDeleteHadith(hadith.number, hadith.category)" class="w-12 h-12 rounded-none text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 cursor-pointer transition-all flex items-center justify-center" title="حذف" aria-label="حذف الحديث">
                  <span class="material-icons text-xs">delete</span>
                </button>
              </div>
            </div>
            <h4 class="font-inter text-sm font-bold text-[var(--color-text-primary)] mb-2">باب: {{ hadith.category }}</h4>
            <p class="font-amiri text-[var(--color-primary-dark)] text-base leading-relaxed bg-[var(--color-primary-light)]/50 p-3 rounded-none text-center mb-3">"{{ hadith.text }}"</p>
            <p class="text-xs text-[var(--color-text-secondary)] mb-3 leading-relaxed">{{ hadith.explanation }}</p>
          </div>
          <div class="border-t border-[var(--color-border-light)] pt-3 flex items-center justify-between">
            <span class="text-[10px] text-[var(--color-text-tertiary)] font-medium">الراوي: {{ hadith.reference }}</span>
            <button (click)="viewInTrail()" class="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] flex items-center gap-1 cursor-pointer transition-colors">
              <span class="material-icons text-sm material-icons-arrow-rtl">arrow_back</span>
              عرض في المسار
            </button>
          </div>
        </div>
        } @empty {
        <div class="col-span-2 text-center py-10 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
          <span class="material-icons text-4xl text-[var(--color-text-tertiary)]">manage_search</span>
          <p class="text-[var(--color-text-secondary)] mt-2 font-semibold text-sm">لم نعثر على أحاديث تطابق البحث</p>
        </div>
        }
      </div>
      }

      @if (activeReferenceSubject() === 'quran') {
      <div class="p-5 bg-[var(--color-primary-light)] rounded-none border border-[var(--color-primary)]/10">
        <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <span class="material-icons text-[var(--color-primary)]">auto_stories</span>
          دليل القرآن الكريم
        </h3>
        <p class="text-xs text-[var(--color-text-secondary)] mt-1">استعرض السور القرآنية وعدد صفحاتها</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (surah of allSurahs; track surah.number) {
        <div class="bg-[var(--color-surface)] rounded-none p-4 text-center border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer">
          <div class="w-10 h-10 mx-auto rounded-none bg-[var(--color-primary-light)] flex items-center justify-center font-bold text-[var(--color-primary)] text-sm mb-2 font-inter">{{ surah.number }}</div>
          <h4 class="font-inter font-bold text-sm text-[var(--color-text-primary)] mb-1">سورة {{ surah.name }}</h4>
          @if (surah.pagesCount) {
          <span class="text-[10px] bg-[var(--color-green-light)] text-green-700 px-2 py-0.5 rounded-none font-semibold">{{ surah.pagesCount }} صفحة</span>
          }
        </div>
        }
      </div>
      }

      @if (activeReferenceSubject() === 'english') {
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[var(--color-primary-light)] rounded-none border border-[var(--color-primary)]/10">
        <div>
          <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span class="material-icons text-[var(--color-primary)]">translate</span>
            دليل المفردات الإنجليزية
          </h3>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">الوحدات والكلمات</p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (unit of state.englishUnits(); track unit.unitNumber) {
        <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)]">
          <div class="flex justify-between items-start mb-3 pb-3 border-b border-[var(--color-border-light)]">
            <h4 class="font-inter font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <span class="material-icons text-[var(--color-primary)]">list_alt</span>
              الوحدة {{ unit.unitNumber }}
            </h4>
            <span class="text-xs text-[var(--color-text-secondary)]">{{ unit.words.length }} كلمة</span>
          </div>
          <div class="space-y-1.5">
            @for (word of unit.words; track $index) {
            <div class="flex justify-between items-center text-sm p-2.5 bg-[var(--color-canvas)] rounded-none border border-[var(--color-border-light)]">
              <span class="font-bold text-[var(--color-text-primary)] text-sm">{{ word.word }}</span>
              <span class="text-[var(--color-text-secondary)] text-xs">{{ word.definition }}</span>
            </div>
            }
          </div>
        </div>
        } @empty {
        <div class="col-span-1 md:col-span-2 text-center py-10 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
          <span class="material-icons text-4xl text-[var(--color-text-tertiary)]">translate</span>
          <p class="text-[var(--color-text-secondary)] mt-2 font-semibold text-sm">لا توجد وحدات إنجليزية بعد</p>
        </div>
        }
      </div>
      }
    </div>
  `,
})
export class ReferenceComponent {
  state = inject(TrackerState);
  toast = inject(ToastService);
  modal = inject(ModalService);
  private router = inject(Router);

  activeReferenceSubject = signal<'hadith' | 'quran' | 'english'>('hadith');
  allSurahs = QURAN_SURAHS;

  filteredHadiths = computed(() => {
    const query = this.state.searchQuery().trim().toLowerCase();
    const cat = this.state.categoryFilter();
    return this.state.hadiths().filter((h) => {
      const matchesQuery =
        h.title.toLowerCase().includes(query) ||
        h.category.toLowerCase().includes(query) ||
        h.text.toLowerCase().includes(query) ||
        h.number.toString() === query ||
        h.explanation.toLowerCase().includes(query);
      const matchesCategory = cat === 'all' || h.category === cat;
      return matchesQuery && matchesCategory;
    });
  });

  uniqueCategories = computed(() => {
    const cats = new Set<string>();
    this.state.hadiths().forEach((h) => cats.add(h.category));
    return Array.from(cats);
  });

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.state.searchQuery.set(target.value);
  }

  onCategorySelect(cat: string) {
    this.state.categoryFilter.set(cat);
  }

  openEditHadith(hadith: Hadith) {
    window.dispatchEvent(new CustomEvent('editHadith', { detail: hadith }));
  }

  onDeleteHadith(number: number, category: string) {
    this.modal.confirm(`هل أنت متأكد من حذف الحديث الشريف ضمن باب (${category})؟`, () => {
      this.state.deleteHadith(number);
      this.toast.show('تم حذف الحديث الشريف وسجلاته.');
      this.modal.confirmState.set(null);
    });
  }

  viewInTrail() {
    this.router.navigate(['/hadith']);
  }

}
