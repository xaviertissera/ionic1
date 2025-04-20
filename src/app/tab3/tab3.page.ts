import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  constructor(private alertController: AlertController) {}

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help - Privacy & Security',
      message: `
        Use the search box to enter an item name and find details.
        Click "Load All" to view all inventory records from the system.
        Make sure to enter a valid item name (case sensitive).
      `,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
