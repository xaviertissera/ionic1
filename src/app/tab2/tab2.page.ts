import { Component } from '@angular/core';
import { MyData } from '../service/my.data';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  // New item form data
  newItem: Partial<MyData> = {
    item_name: '',
    category: '',
    quantity: 0,
    price: 0,
    supplier_name: '',
    stock_status: '',
    featured_item: 0,
    special_note: ''
  };

  // Featured item list and message state
  featuredItems: MyData[] = [];
  messageLines: string[] = []; // holds multiple lines of success/error feedback
  error: boolean = false;

  constructor(private service: DataService) {}

  // Check if a value is numeric using regex
  isNumeric(value: any): boolean {
    return /^\d+$/.test(String(value));
  }

  // Handle adding a new item
  addRecord() {
    this.messageLines = [];
    this.error = false;

    const missingFields: string[] = [];
    const invalidNumericFields: string[] = [];

    // Check required fields
    if (!this.newItem.item_name?.trim()) missingFields.push('Item Name');
    if (!this.newItem.category) missingFields.push('Category');
    if (!this.newItem.quantity && this.newItem.quantity !== 0) missingFields.push('Quantity');
    if (!this.newItem.price && this.newItem.price !== 0) missingFields.push('Price');
    if (!this.newItem.supplier_name?.trim()) missingFields.push('Supplier Name');
    if (!this.newItem.stock_status) missingFields.push('Stock Status');

    // Check numeric-only fields
    if (this.newItem.quantity && !this.isNumeric(this.newItem.quantity)) invalidNumericFields.push('Quantity');
    if (this.newItem.price && !this.isNumeric(this.newItem.price)) invalidNumericFields.push('Price');

    // If validation fails, build error message list
    if (missingFields.length > 0 || invalidNumericFields.length > 0) {
      if (missingFields.length > 0) {
        this.messageLines.push(`Please fill the following required field(s): ${missingFields.join(', ')}`);
      }
      if (invalidNumericFields.length > 0) {
        this.messageLines.push(`The following field(s) must contain numbers only: ${invalidNumericFields.join(', ')}`);
      }
      this.error = true;
      return;
    }

    // Submit the item via POST if valid
    this.service.addData(this.newItem as MyData).subscribe({
      next: () => {
        this.messageLines = ['Item added successfully.'];
        this.error = false;
        this.newItem = {
          item_name: '',
          category: '',
          quantity: 0,
          price: 0,
          supplier_name: '',
          stock_status: '',
          featured_item: 0,
          special_note: ''
        };
        this.loadFeaturedItems(); // Refresh list
      },
      error: () => {
        this.messageLines = ['Failed to add item. It might already exist.'];
        this.error = true;
      }
    });
  }

  // Load all featured items from server
  loadFeaturedItems() {
    this.service.getAllData().subscribe({
      next: (data: MyData[]) => {
        this.featuredItems = data.filter(item => item.featured_item === 1);
      },
      error: () => {
        this.messageLines = ['Failed to load featured items.'];
        this.error = true;
      }
    });
  }

  // Load featured items when page becomes active
  ionViewWillEnter() {
    this.loadFeaturedItems();
  }
}

