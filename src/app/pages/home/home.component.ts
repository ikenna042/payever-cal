import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { MatCalendarCellCssClasses, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { AddComponent } from 'src/app/components/add/add.component';
import { EventModel } from 'src/app/models/event';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatCardModule, MatIconModule, DragDropModule, DatePipe, MatButtonModule]
})
export class HomeComponent {
  selected = new Date();
  events: any[] = [
    { date: new Date('2024-04-01'), color: 'blue' },
    { date: new Date('2024-04-05'), color: 'green' },
    { date: new Date('2024-04-10'), color: 'red' }
    // Add more events as needed
  ];
  animal: string | undefined;
  name: string | undefined;

  allEvents: EventModel[] = []
  eventList: EventModel[] = []

  constructor(private dateAdapter: DateAdapter<Date>, public dialog: MatDialog) {}

  onDateSelected(date: Date) {
    this.selected = date;
    this.eventList = this.filterEventsByDate(date);
  }

  hasEvent(date: Date): boolean {
    return this.events.some(event => this.dateAdapter.compareDate(date, event.date) === 0);
  }

  getEventColor(date: Date): string {
    const event = this.events.find(event => this.dateAdapter.compareDate(date, event.date) === 0);
    return event ? event.color : '';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {name: this.name, date: this.selected},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.allEvents.push({ name: result, date: this.selected })
      this.eventList = this.filterEventsByDate(this.selected);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.eventList, event.previousIndex, event.currentIndex);
  }

  filterEventsByDate(date: Date): EventModel[] {
    return this.allEvents.filter((obj) => {
      return obj.date.getFullYear() === date.getFullYear() &&
             obj.date.getMonth() === date.getMonth() &&
             obj.date.getDate() === date.getDate();
    });
  }

  delete(ev: EventModel) {
    const index = this.allEvents.findIndex(item => item === ev);
    if (index !== -1) {
      this.allEvents.splice(index, 1);
      this.eventList = this.filterEventsByDate(this.selected); // Update eventList after deletion
    }
  }
  

}
