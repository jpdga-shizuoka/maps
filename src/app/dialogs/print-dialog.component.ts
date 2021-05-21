import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TeePosition, TypePaper } from '../models';

export type PrintDialogResults = [TypePaper, TeePosition];

@Component({
  selector: 'app-print-dialog',
  templateUrl: 'print-dialog.html',
  styleUrls: ['./print-dialog.css']
})
export class PrintDialogComponent {
  typePaper = 'rules' as TypePaper;
  teePosition = 'back' as TeePosition;

  constructor(
    public dialogRef: MatDialogRef<PrintDialogComponent, PrintDialogResults>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  get results(): PrintDialogResults {
    return [this.typePaper, this.teePosition];
  }
}
