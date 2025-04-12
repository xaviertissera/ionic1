export class MyData {
    item_id: number;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
    supplier_name: string;
    stock_status: string;
    featured_item: number;
    special_note?: string;
  
    constructor(
      item_id: number,
      item_name: string,
      category: string,
      quantity: number,
      price: number,
      supplier_name: string,
      stock_status: string,
      featured_item: number,
      special_note?: string
    ) {
      this.item_id = item_id;
      this.item_name = item_name;
      this.category = category;
      this.quantity = quantity;
      this.price = price;
      this.supplier_name = supplier_name;
      this.stock_status = stock_status;
      this.featured_item = featured_item;
      this.special_note = special_note;
    }
  }
  