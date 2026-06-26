import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/layout/sidebar.component';
import { HeaderComponent } from './shared/layout/header.component';
import { ToastComponent } from './shared/overlays/toast.component';
import { ConfirmModalComponent } from './shared/overlays/confirm-modal.component';
import { CelebrationModalComponent } from './shared/overlays/celebration-modal.component';
import { AddStudentModalComponent } from './shared/modals/add-student-modal.component';
import { EditStudentModalComponent } from './shared/modals/edit-student-modal.component';
import { AddHadithModalComponent } from './shared/modals/add-hadith-modal.component';
import { EditHadithModalComponent } from './shared/modals/edit-hadith-modal.component';
import { AddVocabListModalComponent } from './shared/modals/add-vocab-list-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    ToastComponent,
    ConfirmModalComponent,
    CelebrationModalComponent,
    AddStudentModalComponent,
    EditStudentModalComponent,
    AddHadithModalComponent,
    EditHadithModalComponent,
    AddVocabListModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
