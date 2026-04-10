import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';

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
  lang$ = this.languageService.lang$;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService
  ) { }

  ngOnInit() { }

  toggle() {
    this.isOpen = !this.isOpen
    this.opened.emit(this.isOpen)
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLanguage() {
    const current = this.languageService.getCurrentLang();
    this.languageService.setLanguage(current === 'es' ? 'en' : 'es');
  }

}
