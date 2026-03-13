import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form class="search-form" (ngSubmit)="submit()" aria-label="Formulario de busca no GitHub">
      <mat-form-field appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <input
          matInput
          [formControl]="queryControl"
          [placeholder]="placeholder"
          aria-label="Digite os termos de busca"
          autocomplete="off"
          [disabled]="loading"
        />
        @if (queryControl.invalid && queryControl.touched) {
          <mat-error>Digite um termo para pesquisar.</mat-error>
        }
      </mat-form-field>
      <button
        mat-flat-button
        color="primary"
        type="submit"
        aria-label="Pesquisar no GitHub"
        [disabled]="loading"
      >
        {{ buttonLabel }}
      </button>
    </form>
  `
})
export class SearchFormComponent {
  @Input() label = 'Buscar no GitHub';
  @Input() placeholder = 'Ex.: angular language:typescript';
  @Input() buttonLabel = 'Pesquisar';
  @Input() loading = false;
  @Input() set initialQuery(value: string) {
    if ((value ?? '') !== this.queryControl.value) {
      this.queryControl.setValue(value ?? '', { emitEvent: false });
    }
  }

  @Output() searchSubmit = new EventEmitter<string>();

  queryControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  submit() {
    if (this.queryControl.invalid) {
      this.queryControl.markAsTouched();
      return;
    }
    this.searchSubmit.emit(this.queryControl.value.trim());
  }
}
