import { Injectable, signal } from '@angular/core';
import { Student, Stage } from '../../state';

@Injectable({ providedIn: 'root' })
export class CelebrationService {
  readonly show = signal(false);
  readonly student = signal<Student | null>(null);
  readonly stage = signal<Stage | null>(null);

  trigger(student: Student, stage: Stage) {
    this.student.set(student);
    this.stage.set(stage);
    this.show.set(true);
  }

  dismiss() {
    this.show.set(false);
  }
}
