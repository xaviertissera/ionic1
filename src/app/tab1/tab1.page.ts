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

// Tab1Page
export class Tab1Page {
  name1: string = '';
  record?: MyData;
  records: MyData[] = [];
  message: string = ''; // For showing success/error messages
  error: boolean = false;

  // Dependency injection
  constructor(private service: DataService, private alertController: AlertController) {}

  // Show help
  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help - Search Items',
      message: 'This page allows you to search for specific inventory items by entering their names in the input field. Once you type the name and press the search button, the system will retrieve and display the matching item’s details. If no match is found, a helpful error message will appear. You can also press the "Load All" button to display a list of all items currently in the inventory database. This is useful when browsing or verifying item availability. Make sure to type item names exactly as they appear, as the search is case sensitive and matches exact names only.'
      ,
      buttons: ['OK'],
    });

    await alert.present();
  }
  // Get record
  getRecord() {
    this.message = '';
    this.error = false;

    if (!this.name1 || this.name1.trim() === '') {
      this.message = 'Please enter a valid item name.';
      this.error = true;
      this.record = undefined;
      return;
    }

    // Fetch data
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

  // Get all records
  getAllRecords() {
    this.service.getAllData().subscribe({
      next: (data: MyData[]) => this.records = data,
      error: () => alert("Failed to load records")
    });
  }
  
  
}
