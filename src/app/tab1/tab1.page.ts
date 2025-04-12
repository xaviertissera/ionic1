import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { MyData } from '../service/my.data';
import { AlertController } from '@ionic/angular'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  name1: string = '';
  record?: MyData;
  records: MyData[] = [];
  message: string = ''; // For showing success/error messages
  error: boolean = false;

  constructor(private service: DataService, private alertController: AlertController) {}

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help - Inventory Search',
      message: `
        Use the search box to enter an item name and find details.
        Click "Load All" to view all inventory records from the system.
        Make sure to enter a valid item name (case sensitive).
      `,
      buttons: ['OK'],
    });

    await alert.present();
  }
  getRecord() {
    this.message = '';
    this.error = false;

    if (!this.name1 || this.name1.trim() === '') {
      this.message = 'Please enter a valid item name.';
      this.error = true;
      this.record = undefined;
      return;
    }

    this.service.getData(this.name1.trim()).subscribe({
      next: (d: MyData[]) => {
        if (d.length === 0) {
          this.message = 'No item found with that name.';
          this.error = true;
          this.record = undefined;
        } else {
          this.record = d[0];
          this.message = 'Item found successfully!';
          this.error = false;
        }
      },
      error: () => {
        this.message = 'Error occurred while fetching data.';
        this.error = true;
        this.record = undefined;
      }
    });
  }

  getAllRecords() {
    this.service.getAllData().subscribe({
      next: (data: MyData[]) => this.records = data,
      error: () => alert("Failed to load records")
    });
  }
  
  
}
