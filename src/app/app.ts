import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from "./core/components/dialog/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogComponent],
  template: `
  <app-confirm-dialog />
  <router-outlet />
  `
})
export class App {}