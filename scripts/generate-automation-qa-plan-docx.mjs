import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType,
  BorderStyle
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'docs', 'Automation_QA_Plan_real_world_tests_pw.docx');

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, ...opts })]
  });
}

function bullet(text) {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 60 }
  });
}

function subheading(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24 })]
  });
}


function todoTable(rows) {
  return table(
    ['Пріоритет', 'Завдання', 'Файл / місце', 'Критерій готовності'],
    rows
  );
}

function table(headers, rows) {
  const headerCells = headers.map(
    (h) =>
      new TableCell({
        shading: { fill: 'E7E6E6', type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })]
      })
  );
  const bodyRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [new Paragraph({ text: String(cell) })]
            })
        )
      })
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: headerCells }), ...bodyRows]
  });
}

const doc = new Document({
  creator: 'real_world_tests_pw',
  title: 'Automation QA — ревʼю проєкту та план розвитку',
  description: 'Playwright RealWorld Conduit test framework',
  sections: [
    {
      properties: {},
      children: [
        heading('Automation QA: ревʼю проєкту та план розвитку'),
        para('Проєкт: real_world_tests_pw (Playwright + TypeScript, RealWorld / Conduit)'),
        para('Дата: 5 серпня 2026'),
        para('Призначення: навчальний / практичний фреймворк для переходу Manual QA → Automation QA.'),

        heading('1. Ревʼю проєкту', HeadingLevel.HEADING_1),

        heading('1.1 Загальна оцінка', HeadingLevel.HEADING_2),
        table(
          ['Критерій', 'Оцінка', 'Коментар'],
          [
            ['Архітектура (POM, fixtures, API client)', '8/10', 'pages/, fixtures/, api/clients/'],
            ['Покриття сценаріїв', '6/10', '~21 тест; немає settings, comments UI, delete article'],
            ['Якість коду', '6/10', 'Баги в ApiClient; змішані імпорти test'],
            ['Документація', '7/10', 'README детальний, частково застарів'],
            ['CI/CD', '5/10', 'GitHub Actions без env BASE_URL/API_URL'],
            ['Теги smoke/regression', '2/10', 'Скрипти є, тегів у тестах немає']
          ]
        ),
        para(''),

        subheading('1.1 Що доробити (підвищення оцінок)'),
        todoTable([
          [
            'High',
            'Додати UI: Settings, edit/delete article, comments',
            'tests/ui/, pages/',
            '≥5 нових spec або розширення існуючих'
          ],
          [
            'High',
            'Уніфікувати імпорт test (fixtures vs @playwright/test)',
            'tests/ui/*.spec.ts',
            'Правило в README або eslint; один підхід на файл'
          ],
          [
            'Medium',
            'Виправити ApiClient (comments, updateUser)',
            'api/clients/apiClient.ts',
            'Нові/існуючі API-тести зелені'
          ],
          [
            'Medium',
            'Теги @smoke / @regression',
            'tests/**/*.spec.ts',
            'npm run test:smoke знаходить ≥5 тестів'
          ],
          [
            'Medium',
            'CI: env + lint',
            '.github/workflows/playwright.yml',
            'PR зелений без ручного .env на машині'
          ]
        ]),
        para(''),

        heading('1.2 Сильні сторони', HeadingLevel.HEADING_2),
        bullet('Page Object Model — сторінки та компоненти (navigation, articlesGrid).'),
        bullet('Fixtures — registrationHelper, uiAuth (JWT у localStorage), testUser (worker scope).'),
        bullet('API + UI hybrid — підготовка даних через API, перевірка в UI (checkProfile).'),
        bullet('Контрактні тести — Zod у contract.spec.ts.'),
        bullet('Tooling — ESLint, Prettier, trace/video/screenshot на падіння.'),

        subheading('1.2 Що доробити (закріпити сильні сторони)'),
        bullet('Додати короткий ARCHITECTURE.md: коли ApiClient, коли ApiHelper, коли uiAuth.'),
        bullet('Винести повторювані navigation-кроки в HomePage / navigation.component.'),
        bullet('Розширити contract.spec: список статей, negative responses.'),
        bullet('Додати в README приклад hybrid-тесту (як checkProfile).'),

        heading('1.3 Ризики та проблеми', HeadingLevel.HEADING_2),
        table(
          ['Severity', 'Проблема', 'Де'],
          [
            ['Major', 'CI не передає BASE_URL / API_URL', '.github/workflows/playwright.yml'],
            ['Major', 'README (demo.realworld.io) ≠ .env.example (demo.realworld.show)', 'README / .env'],
            ['Major', 'Невірні URL: /api/articles/:slug', 'api/clients/apiClient.ts'],
            ['Medium', 'updateUser — headers всередині data', 'apiClient.ts'],
            ['Medium', 'test:smoke / test:regression без тегів у тестах', '*.spec.ts'],
            ['Medium', 'Два test: @playwright/test vs fixtures', 'checkLogin.spec.ts тощо'],
            ['Low', 'README не описує profile, helpers, contract', 'README.md'],
            ['Flaky', 'Усі статті з тегом у favorites helper', 'helpers/api.helper.ts']
          ]
        ),
        para(''),

        subheading('1.3 Що доробити (закрити ризики)'),
        todoTable([
          [
            'Critical',
            'Додати env у GitHub Actions',
            'playwright.yml',
            'BASE_URL і API_URL задані (env або secrets)'
          ],
          [
            'High',
            'Узгодити demo URL у README і .env.example',
            'README.md, .env.example',
            'Один canonical стенд, опис у README'
          ],
          [
            'High',
            'Виправити addComments: прибрати : перед slug, /api/ дубль',
            'apiClient.ts ~108–110',
            'POST .../articles/{slug}/comments + Authorization'
          ],
          [
            'High',
            'Виправити getComments URL',
            'apiClient.ts ~122–125',
            'GET .../articles/{slug}/comments'
          ],
          [
            'Medium',
            'updateUser: headers на рівні request, поле user.bio/image',
            'apiClient.ts updateUser',
            'API-тест update profile'
          ],
          [
            'Medium',
            'Обмежити favorites helper (max 3 статті)',
            'helpers/api.helper.ts',
            'checkProfile favorites < 30 сек стабільно'
          ],
          [
            'Low',
            'storageState.json — .gitignore або оновлення в CI doc',
            'корінь / README',
            'Немає застарілого JWT у репо'
          ]
        ]),
        para(''),

        heading('1.4 Інвентар тестів', HeadingLevel.HEADING_2),
        table(
          ['Шар', 'Файли', 'Призначення'],
          [
            ['UI', 'checkHomePage, checkLogin, checkRegistration, checkNavigationComponents, articlesGrid, checkArticle, checkProfile', 'E2E'],
            ['API', 'checkUserApi, checkArticleApi', 'HTTP, статуси'],
            ['Contract', 'contract.spec', 'Zod-валідація']
          ]
        ),
        para(''),

        subheading('1.4 Що доробити (покриття)'),
        todoTable([
          ['High', 'checkSettings.spec.ts — edit bio/username', 'pages/settings.page.ts', 'UI + assert на profile'],
          ['High', 'checkArticleDelete.spec.ts', 'article.page.ts', 'Стаття зникає з feed/profile'],
          ['High', 'checkComments.spec.ts (UI)', 'article.page.ts', 'Коментар видно після post'],
          ['Medium', 'API: update/delete article, unfavorite', 'tests/api/', 'Статуси 200/204/401'],
          ['Medium', 'API: comments CRUD', 'apiClient + spec', 'Після fix URL'],
          ['Medium', 'Follow user на profile', 'profile.page.ts', 'Follow → Unfollow'],
          ['Low', 'Pagination / tag filter на home', 'articlesGrid.component', 'Count або URL param']
        ]),
        para(''),

        heading('2. Поетапний план розвитку', HeadingLevel.HEADING_1),
        para('Орієнтир: 1–2 тижні на етап при 5–10 год/тиждень. Статуси оновлено за станом репозиторію (серпень 2026).'),
        para('Легенда: ✅ Готово | 🟡 Частково | ⬜ Не готово'),
        table(
          ['Етап', 'Статус', 'Що вже є в проєкті', 'Твій наступний крок'],
          [
            [
              '0 — Середовище',
              '✅ Готово',
              'package.json, playwright.config, .env.example, test:api / test:ui-only, README',
              'Лише перевір локально: .env + зелений npm test'
            ],
            [
              '1 — Читати код',
              '✅ Готово',
              'Усі файли з плану (fixtures, POM, API, checkProfile hybrid)',
              'Пройти trace для checkLogin; можеш ставити ✓ собі вручну'
            ],
            [
              '2 — Свій тест',
              '🟡 Частково',
              '21 тест; negative login (UI + API); positive registration',
              'Додати negative registration; написати 1 тест самостійно'
            ],
            [
              '3 — POM',
              '🟡 Частково',
              '6 pages + components; ProfilePage; checkProfile',
              'settings.page.ts; окремі locators для favorites'
            ],
            [
              '4 — API / Zod',
              '🟡 Частково',
              'checkUserApi, checkArticleApi, contract.spec; favorite через ApiClient',
              'Виправити URL comments; unfavorite; ArticlesListSchema'
            ],
            [
              '5 — Fixtures / data',
              '🟡 Частково',
              'dataFactory, article.factory, auth/api fixtures, ApiHelper',
              'Ліміт favorites; прибрати require у apiFixtures'
            ],
            ['6 — Smoke / regression', '⬜ Не готово', 'npm scripts test:smoke є', 'Додати tag @smoke / @regression у spec'],
            [
              '7 — CI',
              '🟡 Частково',
              'GitHub Actions: install + playwright test + report artifact',
              'env у workflow; lint у CI; оновити README'
            ],
            ['8 — Портфоліо', '⬜ Не готово', '—', 'Test strategy, другий browser, bug report з trace']
          ]
        ),
        para(''),

        heading('Етап 0 — Середовище [✅ ГОТОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Дія', 'Коментар у репо'],
          [
            ['0.1', '✅', 'npm install && npx playwright install', 'Залежності та @playwright/test у package.json'],
            ['0.2', '✅', 'cp .env.example .env', 'Є .env.example (BASE_URL, API_URL)'],
            ['0.3', '✅', 'npm run test:api', '7 API/contract тестів у tests/api/'],
            ['0.4', '✅', 'npm run test:ui-only', '14 UI тестів у tests/ui/'],
            ['0.5', '✅', 'npm run test:ui', 'Скрипт test:ui у package.json']
          ]
        ),
        para('Примітка: кроки 0.2–0.5 потребують твоєї локальної перевірки (.env і npx playwright install).'),
        subheading('Етап 0 — що доробити'),
        todoTable([
          [
            'Low',
            'Зафіксувати версію Node у README (18+)',
            'README.md',
            'Секція Requirements відповідає CI (lts/*)'
          ],
          [
            'Low',
            'Додати .env у .gitignore (якщо ще немає)',
            '.gitignore',
            'Секрети не потрапляють у git'
          ],
          [
            'Medium',
            'Скрипт postinstall або docs: playwright install',
            'package.json / README',
            'Новачок не забуває браузери'
          ]
        ]),
        para(''),

        heading('Етап 1 — Читати код як QA [✅ ГОТОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Файл', 'У репозиторії'],
          [
            ['1.1', '✅', 'fixtures/authFixtures.ts', 'registrationHelper + uiAuth'],
            ['1.2', '✅', 'login.page.ts + checkLogin.spec.ts', 'POM + positive/negative login'],
            ['1.3', '✅', 'apiClient.ts + checkUserApi.spec.ts', 'Token, 401 кейси'],
            ['1.4', '✅', 'checkProfile.spec.ts', 'API setup + UI assert']
          ]
        ),
        para('Практика: npx playwright test checkLogin --trace on → npx playwright show-report'),
        subheading('Етап 1 — що доробити (особисто)'),
        todoTable([
          [
            '—',
            'Пройти всі 4 файли з таблиці й коротко записати відповіді',
            'notes / doc',
            'Можеш пояснити uiAuth за 2 хв'
          ],
          [
            '—',
            'Відкрити trace для checkProfile (hybrid)',
            'Playwright UI',
            'Бачиш API + UI в одному тесті'
          ],
          [
            'Low',
            'Чеклист «розумію POM» у docs (опційно)',
            'docs/',
            'Для самоперевірки перед Етапом 2'
          ]
        ]),
        para(''),

        heading('Етап 2 — Перший свій тест [🟡 ЧАСТКОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Завдання', 'Факт у проєкті'],
          [
            ['2.1', '⬜', 'Negative registration', 'Є лише positive registration + link на login'],
            ['2.2', '🟡', 'Вибір test / fixtures', 'Приклади: base (authFixtures) і test (@playwright/test) у checkLogin'],
            ['2.3', '✅', 'Запуск одного тесту -g', 'Стандарт Playwright, проєкт налаштований']
          ]
        ),
        para('Критерій завершення етапу: ти додала negative registration і написала хоча б 1 тест без копіювання 1:1.'),
        subheading('Етап 2 — що доробити'),
        todoTable([
          [
            'High',
            'Тест: реєстрація з існуючим email → помилка на UI',
            'checkRegistration.spec.ts',
            'expect на error message; URL лишається /register'
          ],
          [
            'High',
            'Тест: короткий username / invalid email (boundary)',
            'checkRegistration.spec.ts',
            'Мінімум 2 negative кейси'
          ],
          [
            'Medium',
            'Уніфікувати checkLogin: один export test з fixtures',
            'checkLogin.spec.ts',
            'Negative login теж через fixture, якщо потрібен user'
          ],
          [
            'Medium',
            'Додати test.describe для групування login/registration',
            'tests/ui/',
            'Зручніше -g і читабельність'
          ]
        ]),
        para(''),

        heading('Етап 3 — Page Object і локатори [🟡 ЧАСТКОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Завдання', 'Факт у проєкті'],
          [
            ['3.1', '⬜', 'settings.page.ts', 'Файлу немає; Settings лише через navigation link у тестах'],
            ['3.2', '⬜', 'Bio через UI → profile', 'Сценарію немає'],
            ['3.3', '⬜', 'Окремі locators favorites', 'articles і favoriteArticles — обидва .article-preview'],
            ['—', '✅', 'Базовий POM', 'home, login, registration, article, articleCreating, profile + components']
          ]
        ),
        subheading('Етап 3 — що доробити'),
        todoTable([
          [
            'High',
            'Створити settings.page.ts (bio, username, image URL, save)',
            'pages/settings.page.ts',
            'Методи fillBio, save, goto'
          ],
          [
            'High',
            'checkSettings.spec.ts з uiAuth',
            'tests/ui/',
            'Bio на profile оновлено після save'
          ],
          [
            'Medium',
            'ProfilePage: myArticles vs favoritedArticles — різні scope',
            'profile.page.ts',
            'page.locator(...).filter або tab panel'
          ],
          [
            'Medium',
            'Замінити fragile селектори (h4) на getByRole де можливо',
            'profile.page.ts',
            'Менше flaky на redesign'
          ],
          [
            'Low',
            'footer.component — тести вже є; перевір посилання Conduit',
            'checkNavigationComponents',
            'Href assert'
          ]
        ]),
        para(''),

        heading('Етап 4 — API і контракти [🟡 ЧАСТКОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Завдання', 'Факт у проєкті'],
          [
            ['4.1', '⬜', 'Виправити comments URL', 'addComments/getComments — некоректні шляхи в apiClient.ts'],
            ['4.2', '🟡', 'favorite / unfavorite API', 'addToUserFavorites є; окремого unfavorite тесту немає'],
            ['4.3', '⬜', 'ArticlesListSchema', 'Є ArticleSchema, UserSchema у contract.spec'],
            ['—', '✅', 'Базові API + contract', 'checkUserApi, checkArticleApi, contract.spec']
          ]
        ),
        subheading('Етап 4 — що доробити'),
        todoTable([
          [
            'Critical',
            'Виправити URL comments у ApiClient',
            'apiClient.ts',
            'Інтеграційний тест post + get comment'
          ],
          [
            'High',
            'Метод removeFromUserFavorites + тест',
            'apiClient.ts, tests/api/',
            'DELETE favorite, 200/204'
          ],
          [
            'High',
            'Тест updateUser (bio) через API',
            'checkUserApi.spec.ts',
            '200 + body містить новий bio'
          ],
          [
            'Medium',
            'ArticlesListSchema + parse getArticles()',
            'schemas/, contract.spec',
            'articles[] валідні'
          ],
          [
            'Medium',
            'Прибрати expect(201) з ApiClient.createArticle (assert у тесті)',
            'apiClient.ts',
            'Client без test assertions (краща архітектура)'
          ],
          [
            'Low',
            'checkArticleApi: delete + get 404',
            'checkArticleApi.spec.ts',
            'Cleanup slug після create'
          ]
        ]),
        para(''),

        heading('Етап 5 — Fixtures і test data [🟡 ЧАСТКОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Завдання', 'Факт у проєкті'],
          [
            ['5.1', '🟡', 'ApiHelper vs ApiClient', 'Обидва використовуються; різниця не задокументована'],
            ['5.2', '⬜', 'Ліміт статей у favorites helper', 'addToUserFavoritesArticlesByTag — усі статті з тегом'],
            ['5.3', '⬜', 'apiFixtures без require', 'У testUser fixture ще require(@playwright/test)'],
            ['—', '✅', 'Factories + fixtures', 'createTestUser, createArticleData, authFixtures, apiFixtures']
          ]
        ),
        subheading('Етап 5 — що доробити'),
        todoTable([
          [
            'High',
            'apiFixtures testUser: використати playwright request fixture',
            'apiFixtures.ts',
            'Без require(); context.dispose у teardown'
          ],
          [
            'High',
            'addToUserFavoritesArticlesByTag(limit?: number)',
            'api.helper.ts',
            'Default 3; швидший checkProfile'
          ],
          [
            'Medium',
            'README або ARCHITECTURE: ApiHelper = composite steps для UI tests',
            'docs/',
            '1 абзац різниці з ApiClient'
          ],
          [
            'Medium',
            'article.factory: параметри title/tags для унікальності',
            'article.factory.ts',
            'override для collision tests'
          ],
          [
            'Low',
            'Teardown: delete articles after profile tests (optional)',
            'fixtures або afterEach',
            'Менше сміття на demo API'
          ]
        ]),
        para(''),

        heading('Етап 6 — Smoke / regression [⬜ НЕ ГОТОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Завдання', 'Факт у проєкті'],
          [
            ['6.1', '⬜', 'tag @smoke', 'У tests/ немає tag @smoke'],
            ['6.2', '⬜', 'tag @regression', 'У tests/ немає tag @regression'],
            ['6.3', '⬜', 'CI smoke vs full', 'CI завжди npx playwright test (повний прогін)']
          ]
        ),
        subheading('Етап 6 — що доробити'),
        todoTable([
          [
            'High',
            'Позначити @smoke: login, registration, home, article create, 1 API login',
            '5–7 тестів',
            'test:smoke проходить < 3 хв'
          ],
          [
            'High',
            'Позначити @regression: profile, grid, navigation, contract',
            'решта UI + API',
            'test:regression не дублює smoke'
          ],
          [
            'Medium',
            'playwright.config: grep invert або projects smoke/regression',
            'playwright.config.ts',
            'Опційно окремі projects'
          ],
          [
            'Medium',
            'CI: job smoke on PR, full on schedule',
            'playwright.yml',
            '2 jobs або workflow_dispatch'
          ]
        ]),
        para(''),

        heading('Етап 7 — CI і якість [🟡 ЧАСТКОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Завдання', 'Факт у проєкті'],
          [
            ['7.1', '⬜', 'env у workflow', '.github/workflows/playwright.yml без BASE_URL/API_URL'],
            ['7.2', '⬜', 'lint у CI', 'Є npm run lint локально; у CI не запускається'],
            ['7.3', '🟡', 'README актуальний', 'Є trace/pyramid; немає profile, contract, helpers; інший demo URL'],
            ['—', '✅', 'Базовий CI', 'push/PR → npm ci → playwright → artifact report']
          ]
        ),
        subheading('Етап 7 — що доробити'),
        todoTable([
          [
            'Critical',
            'env BASE_URL, API_URL у step Run tests',
            'playwright.yml',
            'CI green без локального .env'
          ],
          [
            'High',
            'Step: npm run lint перед тестами',
            'playwright.yml',
            'Lint fail блокує merge'
          ],
          [
            'High',
            'Оновити README: profile, helpers, contract, актуальне дерево',
            'README.md',
            'Структура = git ls'
          ],
          [
            'Medium',
            'Upload test-results on failure (trace zip)',
            'playwright.yml artifact',
            'Artifact містить trace для failed'
          ],
          [
            'Low',
            'prettier check у CI (optional)',
            'package.json script format:check',
            'format:check --check'
          ]
        ]),
        para(''),

        heading('Етап 8 — Портфоліо [⬜ НЕ ГОТОВО]', HeadingLevel.HEADING_2),
        table(
          ['Крок', 'Статус', 'Завдання', 'Факт у проєкті'],
          [
            ['8.1', '⬜', 'Test strategy doc', 'Окремого документу немає'],
            ['8.2', '⬜', 'Другий browser', 'playwright.config — лише chromium'],
            ['8.3', '⬜', 'Bug report + trace', 'README описує trace; прикладу report немає']
          ]
        ),
        subheading('Етап 8 — що доробити'),
        todoTable([
          [
            'High',
            'docs/TEST_STRATEGY.md (1–2 стор.)',
            'docs/',
            'Pyramid, smoke/regression, env, risks'
          ],
          [
            'Medium',
            'firefox project у playwright.config (1 smoke)',
            'playwright.config.ts',
            'Cross-browser @smoke green'
          ],
          [
            'Medium',
            'docs/BUG_REPORT_EXAMPLE.md з посиланням на trace',
            'docs/',
            'Steps / Expected / Actual + trace'
          ],
          [
            'Low',
            'Badge CI status у README',
            'README.md',
            'GitHub Actions badge'
          ]
        ]),
        para(''),

        heading('3. Формат роботи з ментором (чат)', HeadingLevel.HEADING_1),
        para('Етап X, крок Y'),
        para('Що зробила: ...'),
        para('Помилка / питання: ...'),
        para('→ Відповідь: команда, файл, очікуваний результат.'),
        subheading('3. Що доробити'),
        todoTable([
          [
            'Medium',
            'Шаблон повідомлення в docs/MENTOR_TEMPLATE.md',
            'docs/',
            'Copy-paste для чату'
          ],
          [
            'Low',
            'Журнал прогресу (таблиця етапів з датами)',
            'docs/ або цей .docx',
            'Оновлюєш статус після кожного етапу'
          ]
        ]),
        para(''),

        heading('4. Шпоргалка проєкту', HeadingLevel.HEADING_1),

        heading('4.1 Команди', HeadingLevel.HEADING_2),
        table(
          ['Команда', 'Коли'],
          [
            ['npm test', 'Повний прогін'],
            ['npm run test:api', 'Тільки API'],
            ['npm run test:ui-only', 'Тільки UI'],
            ['npm run test:ui', 'Навчання, інтерактив'],
            ['npm run test:debug', 'Debug'],
            ['npx playwright test -g "profile"', 'Один сценарій'],
            ['npx playwright show-report', 'Після падіння'],
            ['npm run lint / format', 'Перед комітом']
          ]
        ),
        para(''),

        heading('4.2 Змінні середовища', HeadingLevel.HEADING_2),
        table(
          ['Змінна', 'Призначення'],
          [
            ['BASE_URL', 'UI (demo RealWorld)'],
            ['API_URL', 'Backend, зазвичай .../api']
          ]
        ),
        para(''),

        heading('4.3 Структура репозиторію', HeadingLevel.HEADING_2),
        table(
          ['Потрібно', 'Шлях'],
          [
            ['Новий UI-тест', 'tests/ui/*.spec.ts'],
            ['Локатори / дії', 'pages/*.page.ts, pages/components/'],
            ['HTTP', 'api/clients/apiClient.ts'],
            ['Підготовка даних', 'helpers/api.helper.ts, utils/*.factory.ts'],
            ['UI auth', 'fixtures/authFixtures.ts → uiAuth'],
            ['API user', 'fixtures/apiFixtures.ts → testUser'],
            ['Zod', 'schemas/*.schema.ts'],
            ['Конфіг', 'playwright.config.ts']
          ]
        ),
        para(''),

        heading('4.4 Fixtures', HeadingLevel.HEADING_2),
        table(
          ['Fixture', 'Scope', 'Що дає'],
          [
            ['registrationHelper', 'test', 'Новий user + token з API'],
            ['uiAuth', 'test', 'JWT у localStorage + goto BASE_URL'],
            ['apiClient', 'test', 'ApiClient(request)'],
            ['testUser', 'worker', 'Один user на worker для API suite']
          ]
        ),
        para(''),

        heading('4.5 Debugging', HeadingLevel.HEADING_2),
        table(
          ['Симптом', 'Дія'],
          [
            ['Element not found', 'Trace → DOM snapshot перед кроком'],
            ['401 API', 'Перевір Token у Authorization'],
            ['Flaky UI', 'expect з auto-wait, без waitForTimeout'],
            ['Падіння в parallel', 'Унікальні users (createTestUser)']
          ]
        ),
        para(''),

        heading('4.6 Backlog сценаріїв RealWorld', HeadingLevel.HEADING_2),
        table(
          ['ID', 'Сценарій', 'Priority'],
          [
            ['TC-A01', 'Edit profile (image, bio)', 'High'],
            ['TC-A02', 'Follow / unfollow user', 'Medium'],
            ['TC-A03', 'Comment on article (UI + API)', 'High'],
            ['TC-A04', 'Delete own article', 'High'],
            ['TC-A05', 'Filter by tag / pagination home', 'Medium']
          ]
        ),
        para(''),

        subheading('4.1–4.6 Що доповнити в шпоргалці'),
        todoTable([
          ['Medium', 'Додати test:smoke / test:regression після тегів', 'розд. 4.1', 'Коли запускати кожну команду'],
          ['Medium', 'Приклад .env (io vs show) + попередження про sync з API', 'розд. 4.2', 'Один стенд на команду'],
          ['Medium', 'Рядки: helpers/, pages/profile, tests/api/contract', 'розд. 4.3', 'Повне дерево як у git'],
          ['Low', 'Коли НЕ використовувати uiAuth (guest tests)', 'розд. 4.4', '1–2 речення'],
          ['Low', 'Команда show-trace для конкретного zip', 'розд. 4.5', 'npx playwright show-trace path'],
          ['High', 'Звʼязати TC-A01…A05 з етапами 2–4', 'розд. 4.6', 'Колонка «Етап»']
        ]),
        para(''),

        heading('5. Підсумок', HeadingLevel.HEADING_1),
        para(
          'Готово в репо: Етап 0 (інфра), Етап 1 (приклади). Решта — таблиці «Що доробити» в кожному розділі.'
        ),
        subheading('5.1 Пріоритетний backlog (перші 2 тижні)'),
        todoTable([
          ['1', 'Negative registration (Етап 2)', 'checkRegistration.spec.ts', '2+ negative кейси'],
          ['2', 'settings.page + checkSettings (Етап 3)', 'pages/, tests/ui/', 'Bio на profile'],
          ['3', 'Fix ApiClient comments + env у CI (1.3, 7)', 'apiClient, playwright.yml', 'API comments + CI green'],
          ['4', 'Теги @smoke на 5 тестів (Етап 6)', 'tests/', 'npm run test:smoke працює'],
          ['5', 'README sync (Етап 7.3)', 'README.md', 'URL + структура папок']
        ]),
        para(
          'Оновлення документа: node scripts/generate-automation-qa-plan-docx.mjs'
        )
      ]
    }
  ]
});

const buffer = await Packer.toBuffer(doc);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buffer);
console.log('Saved:', outPath);
