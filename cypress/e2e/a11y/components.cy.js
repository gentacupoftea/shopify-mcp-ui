/// <reference types="cypress" />
/// <reference types="cypress-axe" />

describe('共通コンポーネントのアクセシビリティテスト', () => {
  beforeEach(() => {
    // テスト用ページにアクセス
    cy.visit('/dashboard');
    cy.injectAxe();
  });

  it('ダッシュボード全体がアクセシビリティ基準を満たしている', () => {
    cy.checkA11y('body', {
      // Formコントロールのエラーは別途詳細にテストするため除外
      rules: {
        'label': { enabled: false },
        'form-field-multiple-labels': { enabled: false }
      }
    });
  });
  
  it('ErrorStateコンポーネントがアクセシビリティ基準を満たしている', () => {
    // エラー状態を表示するコンポーネントをマウント（必要に応じて実装）
    cy.visit('/dashboard?showError=true');
    
    cy.get('[data-testid="error-state"]')
      .should('be.visible')
      .and('have.attr', 'role', 'alert')
      .and('have.attr', 'aria-live', 'assertive');
    
    cy.checkA11y('[data-testid="error-state"]');
  });
  
  it('EmptyStateコンポーネントがアクセシビリティ基準を満たしている', () => {
    // 空の状態を表示するコンポーネントをマウント（必要に応じて実装）
    cy.visit('/dashboard?showEmpty=true');
    
    cy.get('[data-testid="empty-state"]')
      .should('be.visible')
      .and('have.attr', 'role', 'status');
    
    cy.checkA11y('[data-testid="empty-state"]');
  });
  
  it('SkeletonLoaderコンポーネントがアクセシビリティ基準を満たしている', () => {
    // ローディング状態を表示するコンポーネントをマウント（必要に応じて実装）
    cy.visit('/dashboard?loading=true');
    
    cy.get('[data-testid="skeleton-loader"]')
      .should('be.visible')
      .and('have.attr', 'aria-busy', 'true')
      .and('have.attr', 'aria-label');
    
    cy.checkA11y('[data-testid="skeleton-loader"]');
  });
  
  it('ヘッダーとサイドバーがキーボードでナビゲーション可能', () => {
    // フォーカス可能要素のリスト
    const focusableElements = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    // ヘッダー内のナビゲーション
    cy.get('header').find(focusableElements.join(', ')).each(($el) => {
      cy.wrap($el).focus().should('be.focused');
    });
    
    // サイドバー内のナビゲーション
    cy.get('aside').find(focusableElements.join(', ')).each(($el) => {
      cy.wrap($el).focus().should('be.focused');
    });
  });
  
  it('カラーテーマの切り替えでもコントラスト比が保たれる', () => {
    // ライトモードでのコントラストチェック
    cy.checkA11y('body', {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    
    // ダークモードに切り替え
    cy.get('[data-testid="theme-toggle"]').click();
    
    // ダークモードでのコントラストチェック
    cy.checkA11y('body', {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });
  
  it('フォーカス状態が視覚的に明確に表示される', () => {
    const interactiveElements = [
      'button',
      'a[href]',
      '[role="button"]',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    // 各インタラクティブ要素をフォーカスして確認
    cy.get(interactiveElements.join(', ')).each(($el) => {
      // 要素をフォーカス
      cy.wrap($el).focus();
      
      // フォーカス状態の視覚的確認
      // アウトラインスタイルをチェック（実装によって異なる）
      cy.wrap($el).should(($focused) => {
        const computedStyle = window.getComputedStyle($focused[0]);
        const hasOutline = computedStyle.outline !== 'none' && computedStyle.outline !== '';
        const hasBoxShadow = computedStyle.boxShadow !== 'none' && computedStyle.boxShadow !== '';
        
        // アウトラインかボックスシャドウのいずれかが設定されていることを確認
        expect(hasOutline || hasBoxShadow).to.be.true;
      });
    });
  });
});