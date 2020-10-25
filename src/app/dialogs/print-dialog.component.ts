import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'print-dialog',
  templateUrl: 'print-dialog.html',
  styleUrls: ['./print-dialog.css'],
})
export class PrintDialogComponent {

  typePaper: 'rules' | 'layout' | 'card' = 'rules';
  teePosition: 'back' | 'front' = 'back';

  constructor(
    public dialogRef: MatDialogRef<PrintDialogComponent>,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  get results() {
    return [this.typePaper, this.teePosition];
  }
}
