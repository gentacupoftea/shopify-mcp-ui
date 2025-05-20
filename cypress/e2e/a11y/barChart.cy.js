/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('BarChart Accessibility Tests', () => {
  beforeEach(() => {
    // テスト用ページにアクセス
    cy.visit('/bar-chart-example');
    
    // ページが完全に読み込まれるのを待つ
    cy.get('[data-testid="bar-chart"]', { timeout: 10000 }).should('be.visible');
    
    // axe-coreを注入
    cy.injectAxe();
  });

  it('棒グラフコンポーネント全体がアクセシビリティ基準を満たしている', () => {
    // WCAG AA基準に対してテスト
    cy.checkA11y('[data-testid="bar-chart"]', {
      runOnly: {
        type: 'tag',
        values: ['wcag2aa'],
      }
    });
  });

  it('棒グラフにはアクセシビリティ対応のARIA属性が含まれている', () => {
    // 必要なARIA属性の確認
    cy.get('[data-testid="bar-chart"]')
      .should('have.attr', 'role', 'img')
      .and('have.attr', 'aria-label')
      .and('have.attr', 'aria-describedby');
    
    // 説明要素の存在確認
    cy.get('#bar-chart-desc').should('exist');
  });

  it('キーボードナビゲーションで棒グラフデータを操作できる', () => {
    // チャートにフォーカス
    cy.get('[data-testid="bar-chart"]').focus();
    
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

  it('異なる画面サイズでも棒グラフのアクセシビリティが保たれている', () => {
    // モバイルサイズ
    cy.viewport('iphone-x');
    cy.get('[data-testid="bar-chart"]').should('be.visible');
    cy.checkA11y('[data-testid="bar-chart"]');
    
    // タブレットサイズ
    cy.viewport('ipad-2');
    cy.get('[data-testid="bar-chart"]').should('be.visible');
    cy.checkA11y('[data-testid="bar-chart"]');
    
    // デスクトップサイズ
    cy.viewport(1280, 720);
    cy.get('[data-testid="bar-chart"]').should('be.visible');
    cy.checkA11y('[data-testid="bar-chart"]');
  });

  it('スクリーンリーダー用の非表示データテーブルが存在する', () => {
    // 非表示テーブルの存在確認
    cy.get('[data-testid="bar-chart"] table')
      .should('exist')
      .and('not.be.visible');
    
    // テーブルの基本構造確認
    cy.get('[data-testid="bar-chart"] table caption').should('exist');
    cy.get('[data-testid="bar-chart"] table thead').should('exist');
    cy.get('[data-testid="bar-chart"] table tbody').should('exist');
    cy.get('[data-testid="bar-chart"] table tfoot').should('exist');
  });

  it('ツールチップがアクセシビリティ対応している', () => {
    // ツールチップを表示させる
    cy.get('[data-testid="bar-chart"] .recharts-bar-rectangle').first().trigger('mouseover');
    
    // ツールチップのアクセシビリティをチェック
    cy.get('[data-testid="bar-chart-tooltip"]')
      .should('be.visible')
      .and('have.attr', 'role', 'tooltip')
      .and('have.attr', 'aria-live', 'polite');
    
    // ツールチップのアクセシビリティ基準チェック
    cy.checkA11y('[data-testid="bar-chart-tooltip"]');
  });
});