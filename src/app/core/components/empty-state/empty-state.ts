import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: "./empty-state.html",
  styleUrls: ['./empty-state.css']
})
export class EmptyStateComponent {
  @Input() message = 'ไม่พบข้อมูล';
  @Input() icon = '';
}