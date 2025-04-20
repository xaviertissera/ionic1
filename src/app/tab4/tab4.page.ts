import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page implements OnInit {

  // Dependency injection
  constructor(private alertController: AlertController) { }

  // Show help
  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Help - About This App',
      message: 'This mobile inventory management system was created using the Ionic Framework and Angular. It is designed to work seamlessly across platforms, providing users with a clean and responsive interface. The app enables easy searching, adding, updating, and deletion of inventory items while showcasing proper data handling and validation techniques. It also highlights good design practices and RESTful API integration for real-time interactions. This application is part of a coursework project and includes contributions from Xavier Tissera and Hasindu.'
      ,
      buttons: ['OK'],
    });

    await alert.present();
  }
  

  ngOnInit() {
  }

}
