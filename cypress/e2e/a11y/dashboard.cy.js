/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('Dashboard Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.injectAxe();
    // テーマモードをリセット（ライトモード）
    cy.window().then((win) => {
      win.localStorage.setItem('theme', 'light');
      win.location.reload();
    });
  });

  it('should not have any automatically detectable accessibility violations', () => {
    // ページ全体をチェック
    cy.checkA11y();
  });

  it('should have proper heading structure', () => {
    // 正しい見出し構造を確認
    cy.get('h1').should('exist');
    cy.get('h1').should('contain.text', 'Dashboard');
  });

  it('should have accessible chart components', () => {
    // チャートコンポーネントがロードされるのを待つ
    cy.get('[data-testid="sales-chart"]').should('exist');
    
    // チャートエリアのアクセシビリティをチェック
    cy.get('[data-testid="sales-chart"]')
      .should('have.attr', 'role', 'img')
      .should('have.attr', 'aria-label');
    
    // チャート内の要素もチェック
    cy.checkA11y('[data-testid="sales-chart"]', {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  it('should maintain accessibility in dark mode', () => {
    // ダークモードに切り替え
    cy.get('[data-testid="theme-toggle"]').click();
    
    // ダークモードが適用されたことを確認
    cy.get('html').should('have.class', 'dark');
    
    // ダークモードでのアクセシビリティをチェック
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  it('should handle keyboard navigation properly', () => {
    // タブキーでのナビゲーションをテスト
    cy.get('body').tab();
    
    // 最初のフォーカス可能な要素をチェック
    cy.focused().should('exist');
    
    // さらにタブキーを押し、フォーカスが移動することを確認
    cy.get('body').tab();
    cy.focused().should('not.equal', cy.get('body'));
    
    // ESCキーでダイアログやドロップダウンを閉じられることをテスト
    cy.get('[data-testid="date-range-selector"]').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });
});