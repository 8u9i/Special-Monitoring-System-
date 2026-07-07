import { ChangeDetectionStrategy, Component, computed, input, ModuleWithProviders, Provider } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Plus, ArrowLeft, BookOpen, CircleX, Check, CircleCheckBig, CircleCheck,
  Trash2, CheckCheck, Leaf, Pen, Trophy, TriangleAlert, ChevronDown, Folder,
  Users, Lightbulb, Lock, LogIn, Award, Trees, User, ChartColumn, RotateCcw,
  Flower2, Sparkles, RefreshCw, Languages, TrendingUp, Sun,
} from 'lucide-angular';
import { getLucideIconName } from '../../constants/icons';

const lucideProvider: Provider = (LucideAngularModule.pick({
  Plus, ArrowLeft, BookOpen, CircleX, Check, CircleCheckBig, CircleCheck,
  Trash2, CheckCheck, Leaf, Pen, Trophy, TriangleAlert, ChevronDown, Folder,
  Users, Lightbulb, Lock, LogIn, Award, Trees, User, ChartColumn, RotateCcw,
  Flower2, Sparkles, RefreshCw, Languages, TrendingUp, Sun,
}) as ModuleWithProviders<LucideAngularModule>).providers ?? [];

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  providers: lucideProvider,
  template: `
    @if (lucideName() !== null) {
      <lucide-angular
        [name]="lucideName()!"
        [size]="size()"
        [color]="color() || 'currentColor'"
        [strokeWidth]="2"
        [attr.aria-label]="alt() || null"
        [attr.role]="alt() ? 'img' : null"
      />
    }
  `,
  styles: [`:host { display: inline-flex; align-items: center; justify-content: center; }`],
})
export class AppIconComponent {
  name = input.required<string>();
  size = input<number>(24);
  alt = input<string>('');
  color = input<string | null>(null);

  lucideName = computed(() => getLucideIconName(this.name()));
}
