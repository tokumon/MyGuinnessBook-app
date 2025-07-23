/**
 * アプリケーション定数定義
 */

// ストレージキー
const STORAGE_KEYS = {
    APP_DATA: 'myguinnessbook_data',
    SETTINGS: 'myguinnessbook_settings',
    BACKUP: 'myguinnessbook_backup'
};

// データ構造
const DATA_STRUCTURE = {
    settings: {
        theme: 'default',
        notifications: false,
        autoSave: true,
        version: '1.0.0'
    },
    data: {
        records: [],
        categories: [
            'あくびの回数',
            '猫と目が合った回数',
            '冷蔵庫を開けた回数',
            'しゃっくりの回数',
            'ジャンプした数'
        ],
        themes: []
    },
    backup: {
        auto: [],
        manual: []
    },
    metadata: {
        version: '1.0.0',
        lastUpdate: null,
        statistics: {}
    }
};

// デフォルト設定
const DEFAULT_SETTINGS = {
    theme: 'default',
    notifications: false,
    autoSave: true,
    language: 'ja',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h'
};

// バリデーションルール
const VALIDATION_RULES = {
    category: {
        minLength: 1,
        maxLength: 50,
        pattern: /^[^\s].*[^\s]$/ // 前後に空白なし
    },
    value: {
        min: 0,
        max: 999999,
        type: 'number'
    },
    memo: {
        maxLength: 500
    },
    date: {
        format: 'YYYY-MM-DD',
        minDate: '2020-01-01',
        maxDate: '2030-12-31'
    }
};

// エラーメッセージ
const ERROR_MESSAGES = {
    REQUIRED: 'この項目は必須です',
    INVALID_FORMAT: '形式が正しくありません',
    TOO_LONG: '文字数が多すぎます',
    TOO_SHORT: '文字数が少なすぎます',
    INVALID_NUMBER: '数値を入力してください',
    INVALID_DATE: '日付が正しくありません',
    STORAGE_ERROR: 'データの保存に失敗しました',
    LOAD_ERROR: 'データの読み込みに失敗しました',
    NETWORK_ERROR: 'ネットワークエラーが発生しました',
    UNKNOWN_ERROR: '予期しないエラーが発生しました'
};

// 成功メッセージ
const SUCCESS_MESSAGES = {
    SAVE_SUCCESS: '記録を保存しました',
    DELETE_SUCCESS: '記録を削除しました',
    UPDATE_SUCCESS: '記録を更新しました',
    EXPORT_SUCCESS: 'データをエクスポートしました',
    IMPORT_SUCCESS: 'データをインポートしました',
    BACKUP_SUCCESS: 'バックアップを作成しました',
    RESTORE_SUCCESS: 'バックアップを復元しました'
};

// 通知メッセージ
const NOTIFICATION_MESSAGES = {
    WELCOME: '今日もくだらない記録ありがとう！',
    FIRST_RECORD: '初回記録おめでとうございます！',
    MILESTONE: '記録が続いていますね！',
    ENCOURAGEMENT: '毎日の記録、素晴らしいです！'
};

// ページタイトル
const PAGE_TITLES = {
    HOME: '私のギネスブック - 今日の記録',
    HISTORY: '私のギネスブック - 記録履歴',
    STATS: '私のギネスブック - 統計・グラフ',
    SETTINGS: '私のギネスブック - 設定'
};

// グラフ設定
const CHART_CONFIG = {
    colors: [
        '#FF6B35',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FFEAA7',
        '#DDA0DD',
        '#98D8C8',
        '#F7DC6F'
    ],
    defaultType: 'bar',
    defaultPeriod: 'week',
    maxDataPoints: 50
};

// レスポンシブブレークポイント
const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1440
};

// アニメーション設定
const ANIMATION_CONFIG = {
    duration: 300,
    easing: 'ease-in-out',
    delay: 100
};

// ローカライゼーション
const LOCALE = {
    ja: {
        dateFormat: 'YYYY年MM月DD日',
        timeFormat: 'HH:mm',
        weekdays: ['日', '月', '火', '水', '木', '金', '土'],
        months: [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ]
    }
};

// エクスポート
window.APP_CONSTANTS = {
    STORAGE_KEYS,
    DATA_STRUCTURE,
    DEFAULT_SETTINGS,
    VALIDATION_RULES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    NOTIFICATION_MESSAGES,
    PAGE_TITLES,
    CHART_CONFIG,
    BREAKPOINTS,
    ANIMATION_CONFIG,
    LOCALE
}; 