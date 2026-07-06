import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalService } from '../services/modal.service';

import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-header',
  imports: [AppIconComponent],
  template: `
    <header class="mb-6 panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-2 text-[var(--color-primary)]">
          <app-icon name="yard" [size]="18"></app-icon>
          <span class="text-[11px] font-bold tracking-widest uppercase">مسيرة التمكين النبوي</span>
        </div>
        <h2 class="font-tajawal text-2xl font-bold text-[var(--color-text-primary)]">
          {{ title() }}
        </h2>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">
          {{ subtitle() }}
        </p>
      </div>

      <div class="shrink-0 flex gap-2 relative z-10">
        <button
          (click)="modalService.showAddStudent.set(true)"
          class="btn btn-primary btn-md"
        >
          <app-icon name="person_add" [size]="18"></app-icon>
          <span>إضافة طالب</span>
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private router = inject(Router);
  modalService = inject(ModalService);

  private routeData: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'لوحة المتابعة', subtitle: 'متابعة إحصائيات الطلاب ومراتهم في مسارات الحفظ.' },
    '/quran': { title: 'مسار القرآن الكريم', subtitle: 'خطوة بخطوة لارتقاء مراحل المعرفة وجمع الأوسمة.' },
    '/hadith': { title: 'مسار الأحاديث الشريفة', subtitle: 'خطوة بخطوة لارتقاء مراحل المعرفة وجمع الأوسمة.' },
    '/english': { title: 'مسار المفردات الإنجليزية', subtitle: 'تابع حفظ المفردات وادرس عن طريق القوائم المخصصة.' },
    '/stages': { title: 'لوحة الإدارة', subtitle: 'إدارة الطلاب، تعديل بياناتهم، وأدوات الحفظ السريعة.' },
    '/reference': { title: 'منهاج الأحاديث الأربعين', subtitle: 'دليل المعلم والطالب لقراءة وحفظ الأحاديث وشرحها.' },
  };

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  title = () => this.routeData[this.currentUrl()]?.title || 'لوحة المتابعة';
  subtitle = () => this.routeData[this.currentUrl()]?.subtitle || '';
}
