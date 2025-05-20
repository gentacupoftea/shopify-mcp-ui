/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('SalesChart Accessibility Tests', () => {
  beforeEach(() => {
    // ダッシュボードページにアクセス
    cy.visit('/dashboard');
    
    // ページが完全に読み込まれるのを待つ
    cy.get('[data-testid="sales-chart"]', { timeout: 10000 }).should('be.visible');
    
    // axe-coreを注入
    cy.injectAxe();
  });

  it('チャートコンポーネント全体がアクセシビリティ基準を満たしている', () => {
    // WCAG AA基準に対してテスト
    cy.checkA11y('[data-testid="sales-chart"]', {
      runOnly: {
        type: 'tag',
        values: ['wcag2aa'],
      }
    });
  });

  it('チャートにはアクセシビリティ対応のARIA属性が含まれている', () => {
    // 必要なARIA属性の確認
    cy.get('[data-testid="sales-chart"]')
      .should('have.attr', 'role', 'img')
      .and('have.attr', 'aria-label')
      .and('have.attr', 'aria-describedby');
    
    // 説明要素の存在確認
    cy.get('#sales-chart-desc').should('exist');
  });

  it('キーボードナビゲーションでチャートデータを操作できる', () => {
    // チャートにフォーカス
    cy.get('[data-testid="sales-chart"]').focus();
    
    // 右矢印キーでナビゲーション
    cy.focused().type('{rightarrow}');
    cy.get('[aria-live="polite"]').should('exist');
    
    // 左矢印キーでナビゲーション
    cy.focused().type('{leftarrow}');
    
    // Homeキーで最初のデータポイントに移動
    cy.focused().type('{home}');
    
    // Endキーで最後のデータポイントに移動
    cy.focused().type('{end}');
    
    // Escapeキーで選択解除
    cy.focused().type('{esc}');
  });

  it('異なる画面サイズでもアクセシビリティが保たれている', () => {
    // モバイルサイズ
    cy.viewport('iphone-x');
    cy.get('[data-testid="sales-chart"]').should('be.visible');
    cy.checkA11y('[data-testid="sales-chart"]');
    
    // タブレットサイズ
    cy.viewport('ipad-2');
    cy.get('[data-testid="sales-chart"]').should('be.visible');
    cy.checkA11y('[data-testid="sales-chart"]');
    
    // デスクトップサイズ
    cy.viewport(1280, 720);
    cy.get('[data-testid="sales-chart"]').should('be.visible');
    cy.checkA11y('[data-testid="sales-chart"]');
  });

  it('ダークモードでもコントラスト比が適切に保たれている', () => {
    // ダークモードに切り替え（実装によって異なる）
    cy.get('[data-testid="theme-toggle"]').click();
    
    // チャートのコントラスト比をチェック
    cy.get('[data-testid="sales-chart"] .recharts-cartesian-axis-tick text')
      .should('be.visible');
    
    // WCAG AAコントラスト基準でチェック (4.5:1)
    cy.checkA11y('[data-testid="sales-chart"]', {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });

  it('スクリーンリーダー用の非表示データテーブルが存在する', () => {
    // 非表示テーブルの存在確認
    cy.get('[data-testid="sales-chart"] table')
      .should('exist')
      .and('not.be.visible');
    
    // テーブルの基本構造確認
    cy.get('[data-testid="sales-chart"] table caption').should('exist');
    cy.get('[data-testid="sales-chart"] table thead').should('exist');
    cy.get('[data-testid="sales-chart"] table tbody').should('exist');
    cy.get('[data-testid="sales-chart"] table tfoot').should('exist');
  });

  it('ツールチップがアクセシビリティ対応している', () => {
    // ツールチップを表示させる
    cy.get('[data-testid="sales-chart"] .recharts-line').trigger('mouseover');
    
    // ツールチップのアクセシビリティをチェック
    cy.get('[data-testid="sales-chart-tooltip"]')
      .should('be.visible')
      .and('have.attr', 'role', 'tooltip')
      .and('have.attr', 'aria-live', 'polite');
    
    // ツールチップのアクセシビリティ基準チェック
    cy.checkA11y('[data-testid="sales-chart-tooltip"]');
  });
});