import { Page } from '@playwright/test';
import { NavigationComponent } from './components/navigation.component';
import { ArticlesGridComponent } from './components/articlesGrid.component';
import { FooterComponent } from './components/footer.component';
import { LoginPage } from './login.page';
import * as dotenv from 'dotenv';
dotenv.config();

export class HomePage {
  private readonly page: Page;

  readonly navigation: NavigationComponent;
  readonly articles: ArticlesGridComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    this.page = page;

    this.navigation = new NavigationComponent(page);
    this.articles = new ArticlesGridComponent(page);
    this.footer = new FooterComponent(page);
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL || '');
  }

  async login(): Promise<LoginPage> {
    await this.navigation.signInLink.click();
    return new LoginPage(this.page);
  }
}
