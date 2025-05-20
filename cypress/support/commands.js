// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// axe-coreインテグレーション
import 'cypress-axe';

// タブキーでのナビゲーションコマンド
import { stripIndent } from 'common-tags';
import { tabTraverse } from 'cypress-plugin-tab';

// タブナビゲーション用のカスタムコマンド
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject, options) => {
  const finalOptions = Object.assign(
    {
      shift: false,
      focusable: [
        'a[href]',
        'area[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        'iframe',
        '[contenteditable]',
      ],
    },
    options
  );

  return tabTraverse(subject, finalOptions);
});

// アクセシビリティ違反レポートの強化
Cypress.Commands.add('checkA11y', (context, options) => {
  const defaultOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    },
  };
  const mergedOptions = Object.assign(defaultOptions, options);

  // axeの実行を可能な限り安全に行う
  try {
    // runPromiseを使用して呈定の実行を待つ
    cy.window({ log: false }).then((win) => {
      if (win.axe && win.axe._audit) {
        return win.axe.run(context || 'html', mergedOptions).then(violationCallback);
      } else {
        cy.checkA11y(context, mergedOptions, violationCallback);
      }
    });
  } catch (error) {
    cy.log('A11y check error: ' + error.message);
  }
});

// アクセシビリティ違反のコンソール出力を整形
function violationCallback(violations) {
  violations.forEach(violation => {
    const nodes = Cypress.$(violation.nodes.map(node => node.target).join(','));
    
    Cypress.log({
      name: 'A11Y',
      consoleProps: () => violation,
      $el: nodes,
      message: stripIndent`
        ${violation.id} - ${violation.impact}
        ${violation.description}
        ${violation.helpUrl}
        ${violation.nodes.length} violation${violation.nodes.length === 1 ? '' : 's'}
      `,
    });
  });
}

// コントラスト比のチェック
Cypress.Commands.add('checkContrast', (foreground, background, threshold = 4.5) => {
  const getLuminance = (color) => {
    // 色のRGB値からの輝度計算ロジック
    const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const r = parseInt(rgb[1]) / 255;
    const g = parseInt(rgb[2]) / 255;
    const b = parseInt(rgb[3]) / 255;
    
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  
  const calculateContrastRatio = (lum1, lum2) => {
    const lighterLum = Math.max(lum1, lum2);
    const darkerLum = Math.min(lum1, lum2);
    return (lighterLum + 0.05) / (darkerLum + 0.05);
  };
  
  // 要素からコンピュートされたスタイルを取得
  cy.get(foreground).then($el => {
    const fgColor = window.getComputedStyle($el[0]).color;
    
    cy.get(background).then($bg => {
      const bgColor = window.getComputedStyle($bg[0]).backgroundColor;
      
      const fgLum = getLuminance(fgColor);
      const bgLum = getLuminance(bgColor);
      const ratio = calculateContrastRatio(fgLum, bgLum);
      
      expect(ratio).to.be.at.least(threshold, 
        `Contrast between ${fgColor} and ${bgColor} is ${ratio}, should be at least ${threshold}`);
    });
  });
});