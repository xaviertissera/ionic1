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
      message: 'This page outlines the privacy and security measures taken within the app to protect your data. All interactions with the inventory database are conducted through a secure RESTful API, and user input is carefully validated before any operation is allowed. Item names must be unique, and only specific users can perform update or delete actions where permitted. Data transmission is designed to prevent unintended access or corruption, and sensitive logic such as deletion restrictions helps ensure data consistency. This reflects the importance of responsible data handling in real-world systems.'
,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
