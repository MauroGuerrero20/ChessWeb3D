import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  clicked = false;

  title:String = 'I have been clicked';

  boat = {
    name: 'Starfire',
    year: 1997,
  };

  handleClick = () => {
    this.clicked = true;
    console.log(this.clicked);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
