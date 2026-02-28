import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.less'],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  isOpen = false
  @Output() opened = new EventEmitter<boolean>()
  today = new Date()
  theme$ = this.themeService.theme$;

  constructor(private themeService: ThemeService) { }

  ngOnInit() { }

  toggle() {
    this.isOpen = !this.isOpen
    this.opened.emit(this.isOpen)
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

}
