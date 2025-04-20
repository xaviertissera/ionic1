import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { MyData } from '../service/my.data';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  standalone: false,
})
export class Tab5Page {
  name: string = ''; // User input to search by item_name
  record?: MyData;   // Loaded record
  message: string = '';
  error: boolean = false;

  constructor(private service: DataService, private alertController: AlertController) {}

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help - Update or Delete Items',
      message: 'This page enables you to update or remove inventory items. To get started, search for an item by name. Once retrieved, you can edit its details and click the save button to apply changes. If the item needs to be removed from the inventory, you can use the delete option, which will prompt you for confirmation before deletion. Please note that deletion is restricted for certain items like "Laptop" to prevent the demonstration database from being empty. This feature supports inventory maintenance by ensuring outdated or incorrect records can be quickly managed.'
,
      buttons: ['OK'],
    });

    await alert.present();
  }
  
  // Load item by name
  loadItem() {
    this.message = '';
    this.error = false;

    if (!this.name || this.name.trim() === '') {
      this.message = 'Please enter a valid item name.';
      this.error = true;
      this.record = undefined;
      return;
    }

    this.service.getData(this.name.trim()).subscribe({
      next: (res) => {
        if (res.length === 0) {
          this.message = 'No item found with that name.';
          this.error = true;
          this.record = undefined;
        } else {
          this.record = res[0];
        }
      },
      error: () => {
        this.message = 'Error while fetching item.';
        this.error = true;
      }
    });
  }

  // Update the existing item
  updateItem() {
    this.message = '';
    this.error = false;
  
    if (!this.record) return;
  
    const requiredFields = [
      { key: 'item_name', label: 'Item Name' },
      { key: 'category', label: 'Category' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'price', label: 'Price' },
      { key: 'supplier_name', label: 'Supplier Name' },
      { key: 'stock_status', label: 'Stock Status' }
    ];
  
    const missingFields = requiredFields.filter(field => {
      const value = (this.record as any)[field.key];
      return value === null || value === undefined || value === '';
    });
  
    // Check if quantity and price are numeric
    const invalidNumericFields: string[] = [];
    const isNumeric = (value: any) => /^\d+$/.test(String(value));
  
    if (this.record.quantity && !isNumeric(this.record.quantity)) {
      invalidNumericFields.push('Quantity');
    }
  
    if (this.record.price && !isNumeric(this.record.price)) {
      invalidNumericFields.push('Price');
    }
  
    // Show errors if any
    if (missingFields.length > 0 || invalidNumericFields.length > 0) {
      const messages: string[] = [];
  
      if (missingFields.length > 0) {
        messages.push('Missing required field(s): ' + missingFields.map(f => f.label).join(', '));
      }
  
      if (invalidNumericFields.length > 0) {
        messages.push('The following fields must be numeric only: ' + invalidNumericFields.join(', '));
      }
  
      this.message = messages.join('\n');
      this.error = true;
      return;
    }
  
    // Proceed to update
    this.service.updateData(this.record).subscribe({
      next: () => {
        this.message = 'Item updated successfully.';
        this.error = false;
      },
      error: () => {
        this.message = 'Failed to update item.';
        this.error = true;
      }
    });
  }
  
  

  // Delete the item
  async deleteItem() {
    if (!this.record) return;
  
    const itemName = this.record.item_name;
  
    if (itemName.toLowerCase() === 'laptop') {
      this.message = 'Cannot delete "Laptop" as per system restriction.';
      this.error = true;
      return;
    }
  
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete "${itemName}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.service.deleteData(itemName).subscribe({
              next: () => {
                this.message = 'Item deleted successfully.';
                this.error = false;
                this.record = undefined;
                this.name = '';
              },
              error: () => {
                this.message = 'Failed to delete item.';
                this.error = true;
              }
            });
          }
        }
      ]
    });
  
    await alert.present();
  }
  
}
