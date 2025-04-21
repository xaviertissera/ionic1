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
  record?: MyData; // Loaded record
  message: string = '';
  error: boolean = false;

  constructor(
    private service: DataService,
    private alertController: AlertController
  ) {}

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help - Update or Delete Items',
      message:
        'This page enables you to update or remove inventory items. To get started, search for an item by name. Once retrieved, you can edit its details and click the save button to apply changes. If the item needs to be removed from the inventory, you can use the delete option, which will prompt you for confirmation before deletion. Please note that deletion is restricted for certain items like "Laptop" to prevent the demonstration database from being empty. This feature supports inventory maintenance by ensuring outdated or incorrect records can be quickly managed.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Load item by name
loadItem() {
  // Clear any previous messages
  this.message = '';
  this.error = false;

  // Validate the input: item name must not be empty or just whitespace
  if (!this.name || this.name.trim() === '') {
    this.message = 'Please enter a valid item name.'; // Set error message
    this.error = true; // Flag as error
    this.record = undefined; // Clear any previously loaded record
    return; // Stop execution
  }

  // Call the service to fetch item by name
  this.service.getData(this.name.trim()).subscribe({
    next: (res) => {
      // If no matching item is found
      if (res.length === 0) {
        this.message = 'No item found with that name.'; // Show not found message
        this.error = true;
        this.record = undefined; // Clear previously shown record
      } else {
        // If item found, assign it to the form
        this.record = res[0];
        // (Optional) You could show a success message here if desired
      }
    },
    error: () => {
      // Handle HTTP or server error
      this.message = 'Error while fetching item.';
      this.error = true;
    },
  });
}


  // Update the item
  updateItem() {
    // Reset previous message state
    this.message = '';
    this.error = false;

    // Stop if no item is currently loaded
    if (!this.record) return;

    const messages: string[] = []; // To collect all validation error messages

    // Utility: Check if a value is empty (null, undefined, or blank)
    const isEmpty = (val: any) =>
      val === null || val === undefined || String(val).trim() === '';

    // Utility: Check if value is not numeric (only digits allowed)
    const isNotNumeric = (val: any) => !/^\d+$/.test(String(val).trim());

    // Begin field validation
    if (!this.record.item_name?.trim()) {
      messages.push('Item Name is required.');
    }

    if (!this.record.category) {
      messages.push('Category is required.');
    }

    // Quantity validation: check presence then numeric
    if (isEmpty(this.record.quantity)) {
      messages.push('Quantity is required.');
    } else if (isNotNumeric(this.record.quantity)) {
      messages.push('Quantity must be a numeric value.');
    }

    // Price validation: check presence then numeric
    if (isEmpty(this.record.price)) {
      messages.push('Price is required.');
    } else if (isNotNumeric(this.record.price)) {
      messages.push('Price must be a numeric value.');
    }

    if (!this.record.supplier_name?.trim()) {
      messages.push('Supplier Name is required.');
    }

    if (!this.record.stock_status) {
      messages.push('Stock Status is required.');
    }

    // If there are validation errors, show them and stop
    if (messages.length > 0) {
      this.message = messages.join('\n'); // Combine all error messages into one string
      this.error = true;
      return;
    }

    // Convert quantity and price to numbers before sending to API
    this.record.quantity = Number(this.record.quantity);
    this.record.price = Number(this.record.price);

    // Send the update request to the server
    this.service.updateData(this.record).subscribe({
      next: () => {
        // If success, show confirmation
        this.message = 'Item updated successfully.';
        this.error = false;
      },
      error: () => {
        // If error, show failure message
        this.message = 'Failed to update item.';
        this.error = true;
      },
    });
  }

  // Delete the item
async deleteItem() {
  // Exit if no item is currently loaded
  if (!this.record) return;

  // Get the item name from the loaded record
  const itemName = this.record.item_name;

  // Prevent deletion of the protected item "Laptop"
  if (itemName.toLowerCase() === 'laptop') {
    this.message = 'Cannot delete "Laptop" as per system restriction.'; // Show restriction message
    this.error = true;
    return;
  }

  // Show confirmation dialog before deleting the item
  const alert = await this.alertController.create({
    header: 'Confirm Delete', // Dialog title
    message: `Are you sure you want to delete "${itemName}"?`, // Confirmation message
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel', // Automatically closes the dialog
      },
      {
        text: 'Delete',
        handler: () => {
          // Proceed with deletion if confirmed
          this.service.deleteData(itemName).subscribe({
            next: () => {
              // On successful deletion, show confirmation and reset form
              this.message = 'Item deleted successfully.';
              this.error = false;
              this.record = undefined;
              this.name = '';
            },
            error: () => {
              // On server error, show failure message
              this.message = 'Failed to delete item.';
              this.error = true;
            },
          });
        },
      },
    ],
  });

  // Display the confirmation alert
  await alert.present();
}

}
