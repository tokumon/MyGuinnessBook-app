/**
 * バリデーション機能
 */

class Validation {
    constructor() {
        this.rules = window.APP_CONSTANTS.VALIDATION_RULES;
        this.errorMessages = window.APP_CONSTANTS.ERROR_MESSAGES;
    }

    /**
     * 記録データのバリデーション
     * @param {Object} record - 記録データ
     * @returns {Object} バリデーション結果
     */
    validateRecord(record) {
        const errors = {};

        // カテゴリのバリデーション
        if (!this.validateCategory(record.category)) {
            errors.category = this.errorMessages.REQUIRED;
        }

        // 値のバリデーション
        if (!this.validateValue(record.value)) {
            errors.value = this.errorMessages.INVALID_NUMBER;
        }

        // メモのバリデーション
        if (record.memo && !this.validateMemo(record.memo)) {
            errors.memo = this.errorMessages.TOO_LONG;
        }

        // 日付のバリデーション
        if (record.date && !this.validateDate(record.date)) {
            errors.date = this.errorMessages.INVALID_DATE;
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    /**
     * カテゴリのバリデーション
     * @param {string} category - カテゴリ名
     * @returns {boolean} バリデーション結果
     */
    validateCategory(category) {
        if (!category || typeof category !== 'string') {
            return false;
        }

        const trimmed = category.trim();
        const rules = this.rules.category;

        if (trimmed.length < rules.minLength || trimmed.length > rules.maxLength) {
            return false;
        }

        if (!rules.pattern.test(trimmed)) {
            return false;
        }

        return true;
    }

    /**
     * 値のバリデーション
     * @param {number} value - 数値
     * @returns {boolean} バリデーション結果
     */
    validateValue(value) {
        if (value === null || value === undefined) {
            return false;
        }

        const numValue = Number(value);
        const rules = this.rules.value;

        if (isNaN(numValue)) {
            return false;
        }

        if (numValue < rules.min || numValue > rules.max) {
            return false;
        }

        return true;
    }

    /**
     * メモのバリデーション
     * @param {string} memo - メモ
     * @returns {boolean} バリデーション結果
     */
    validateMemo(memo) {
        if (!memo || typeof memo !== 'string') {
            return true; // メモは任意
        }

        const rules = this.rules.memo;
        return memo.length <= rules.maxLength;
    }

    /**
     * 日付のバリデーション
     * @param {string} date - 日付文字列
     * @returns {boolean} バリデーション結果
     */
    validateDate(date) {
        if (!date || typeof date !== 'string') {
            return false;
        }

        const rules = this.rules.date;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return false;
        }

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return false;
        }

        const minDate = new Date(rules.minDate);
        const maxDate = new Date(rules.maxDate);

        return dateObj >= minDate && dateObj <= maxDate;
    }

    /**
     * 設定データのバリデーション
     * @param {Object} settings - 設定データ
     * @returns {Object} バリデーション結果
     */
    validateSettings(settings) {
        const errors = {};

        // テーマのバリデーション
        const validThemes = ['default', 'dark', 'retro', 'minimal'];
        if (settings.theme && !validThemes.includes(settings.theme)) {
            errors.theme = this.errorMessages.INVALID_FORMAT;
        }

        // 通知設定のバリデーション
        if (settings.notifications !== undefined && typeof settings.notifications !== 'boolean') {
            errors.notifications = this.errorMessages.INVALID_FORMAT;
        }

        // 自動保存設定のバリデーション
        if (settings.autoSave !== undefined && typeof settings.autoSave !== 'boolean') {
            errors.autoSave = this.errorMessages.INVALID_FORMAT;
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    /**
     * カテゴリ名の正規化
     * @param {string} category - カテゴリ名
     * @returns {string} 正規化されたカテゴリ名
     */
    normalizeCategory(category) {
        if (!category || typeof category !== 'string') {
            return '';
        }

        return category.trim();
    }

    /**
     * 数値の正規化
     * @param {*} value - 数値
     * @returns {number} 正規化された数値
     */
    normalizeValue(value) {
        if (value === null || value === undefined) {
            return 0;
        }

        const numValue = Number(value);
        return isNaN(numValue) ? 0 : Math.max(0, Math.floor(numValue));
    }

    /**
     * メモの正規化
     * @param {string} memo - メモ
     * @returns {string} 正規化されたメモ
     */
    normalizeMemo(memo) {
        if (!memo || typeof memo !== 'string') {
            return '';
        }

        return memo.trim();
    }

    /**
     * 日付の正規化
     * @param {string} date - 日付
     * @returns {string} 正規化された日付
     */
    normalizeDate(date) {
        if (!date) {
            return this.getCurrentDate();
        }

        if (typeof date === 'string') {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                return this.formatDate(dateObj);
            }
        }

        return this.getCurrentDate();
    }

    /**
     * 現在の日付を取得
     * @returns {string} YYYY-MM-DD形式の日付
     */
    getCurrentDate() {
        const now = new Date();
        return this.formatDate(now);
    }

    /**
     * 日付をフォーマット
     * @param {Date} date - 日付オブジェクト
     * @returns {string} YYYY-MM-DD形式の日付
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * データの整合性チェック
     * @param {Object} data - チェックするデータ
     * @returns {Object} チェック結果
     */
    validateDataIntegrity(data) {
        const issues = [];

        // データ構造のチェック
        if (!data || typeof data !== 'object') {
            issues.push('データ構造が不正です');
            return { isValid: false, issues };
        }

        // 必須フィールドのチェック
        const requiredFields = ['settings', 'data', 'backup', 'metadata'];
        for (const field of requiredFields) {
            if (!data[field]) {
                issues.push(`必須フィールド "${field}" が存在しません`);
            }
        }

        // 記録データのチェック
        if (data.data && data.data.records) {
            if (!Array.isArray(data.data.records)) {
                issues.push('記録データが配列ではありません');
            } else {
                // 各記録のバリデーション
                data.data.records.forEach((record, index) => {
                    const validation = this.validateRecord(record);
                    if (!validation.isValid) {
                        issues.push(`記録 ${index + 1} に問題があります: ${Object.values(validation.errors).join(', ')}`);
                    }
                });
            }
        }

        // カテゴリデータのチェック
        if (data.data && data.data.categories) {
            if (!Array.isArray(data.data.categories)) {
                issues.push('カテゴリデータが配列ではありません');
            } else {
                data.data.categories.forEach((category, index) => {
                    if (!this.validateCategory(category)) {
                        issues.push(`カテゴリ ${index + 1} に問題があります`);
                    }
                });
            }
        }

        return {
            isValid: issues.length === 0,
            issues: issues
        };
    }

    /**
     * エラーメッセージを取得
     * @param {string} key - エラーキー
     * @param {*} defaultValue - デフォルト値
     * @returns {string} エラーメッセージ
     */
    getErrorMessage(key, defaultValue = 'エラーが発生しました') {
        return this.errorMessages[key] || defaultValue;
    }

    /**
     * フィールドのエラー表示をクリア
     * @param {string} fieldName - フィールド名
     */
    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    /**
     * フィールドにエラーを表示
     * @param {string} fieldName - フィールド名
     * @param {string} message - エラーメッセージ
     */
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('error');
            
            // 既存のエラーメッセージを削除
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // 新しいエラーメッセージを追加
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = 'var(--error-color)';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = 'var(--space-xs)';
            
            field.parentNode.appendChild(errorElement);
        }
    }

    /**
     * フォーム全体のエラーをクリア
     * @param {string} formId - フォームID
     */
    clearFormErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const errorFields = form.querySelectorAll('.error');
            errorFields.forEach(field => {
                field.classList.remove('error');
            });

            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(message => {
                message.remove();
            });
        }
    }
}

// グローバルインスタンスを作成
window.Validation = new Validation(); 