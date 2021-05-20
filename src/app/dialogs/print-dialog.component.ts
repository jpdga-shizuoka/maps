import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TeePosition, TypePaper } from '../models';

@Component({
  selector: 'app-print-dialog',
  templateUrl: 'print-dialog.html',
  styleUrls: ['./print-dialog.css']
})
export class PrintDialogComponent {
  typePaper = 'rules' as TypePaper;
  teePosition = 'back' as TeePosition;

  constructor(
    public dialogRef: MatDialogRef<PrintDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  get results(): [TypePaper, TeePosition] {
    return [this.typePaper, this.teePosition];
  }
}
