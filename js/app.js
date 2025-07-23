/**
 * メインアプリケーション
 * アプリケーションの初期化とイベントハンドリングを行う
 */

class App {
    constructor() {
        this.dataManager = window.DataManager;
        this.validation = window.Validation;
        this.constants = window.APP_CONSTANTS;
        
        // 現在のページを取得
        this.currentPage = this.getCurrentPage();
        
        // 初期化
        this.initialize();
    }

    /**
     * アプリケーションの初期化
     */
    initialize() {
        try {
            console.log('アプリケーションを初期化中...');
            
            // ページ固有の初期化
            this.initializePage();
            
            // イベントリスナーの設定
            this.setupEventListeners();
            
            // データの読み込みと表示
            this.loadAndDisplayData();
            
            console.log('アプリケーションの初期化が完了しました');
        } catch (error) {
            console.error('アプリケーション初期化エラー:', error);
            this.showError('アプリケーションの初期化に失敗しました');
        }
    }

    /**
     * 現在のページを取得
     * @returns {string} ページ名
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        switch (filename) {
            case 'index.html':
            case '':
                return 'home';
            case 'history.html':
                return 'history';
            case 'stats.html':
                return 'stats';
            case 'settings.html':
                return 'settings';
            default:
                return 'home';
        }
    }

    /**
     * ページ固有の初期化
     */
    initializePage() {
        switch (this.currentPage) {
            case 'home':
                this.initializeHomePage();
                break;
            case 'history':
                this.initializeHistoryPage();
                break;
            case 'stats':
                this.initializeStatsPage();
                break;
            case 'settings':
                this.initializeSettingsPage();
                break;
        }
    }

    /**
     * ホームページの初期化
     */
    initializeHomePage() {
        // カテゴリセレクトの更新
        this.updateCategorySelect();
        
        // 今日の記録サマリーの表示
        this.displayTodaySummary();
    }

    /**
     * 履歴ページの初期化
     */
    initializeHistoryPage() {
        // 記録一覧の表示
        this.displayRecordsList();
        
        // 検索・フィルター機能の初期化
        this.initializeSearchAndFilter();
    }

    /**
     * 統計ページの初期化
     */
    initializeStatsPage() {
        // 統計サマリーの表示
        this.displayStatsSummary();
        
        // グラフの初期化（将来的に実装）
        this.initializeCharts();
    }

    /**
     * 設定ページの初期化
     */
    initializeSettingsPage() {
        // 設定値の読み込みと表示
        this.loadAndDisplaySettings();
        
        // カテゴリ一覧の表示
        this.displayCategoriesList();
        
        // アプリ情報の表示
        this.displayAppInfo();
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // ページ共通のイベントリスナー
        this.setupCommonEventListeners();
        
        // ページ固有のイベントリスナー
        switch (this.currentPage) {
            case 'home':
                this.setupHomeEventListeners();
                break;
            case 'history':
                this.setupHistoryEventListeners();
                break;
            case 'stats':
                this.setupStatsEventListeners();
                break;
            case 'settings':
                this.setupSettingsEventListeners();
                break;
        }
    }

    /**
     * 共通イベントリスナーの設定
     */
    setupCommonEventListeners() {
        // ページ読み込み完了時の処理
        document.addEventListener('DOMContentLoaded', () => {
            this.onPageLoaded();
        });

        // エラーハンドリング
        window.addEventListener('error', (event) => {
            console.error('グローバルエラー:', event.error);
            this.showError('予期しないエラーが発生しました');
        });

        // 未処理のPromiseエラー
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未処理のPromiseエラー:', event.reason);
            this.showError('非同期処理でエラーが発生しました');
        });
    }

    /**
     * ホームページのイベントリスナー設定
     */
    setupHomeEventListeners() {
        const recordForm = document.getElementById('recordForm');
        if (recordForm) {
            recordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRecordSubmit();
            });
        }

        const addCategoryBtn = document.getElementById('addCategoryBtn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.showAddCategoryDialog();
            });
        }
    }

    /**
     * 履歴ページのイベントリスナー設定
     */
    setupHistoryEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.handleCategoryFilter(e.target.value);
            });
        }

        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.handleDateFilter(e.target.value);
            });
        }
    }

    /**
     * 統計ページのイベントリスナー設定
     */
    setupStatsEventListeners() {
        const chartType = document.getElementById('chartType');
        if (chartType) {
            chartType.addEventListener('change', (e) => {
                this.handleChartTypeChange(e.target.value);
            });
        }

        const chartCategory = document.getElementById('chartCategory');
        if (chartCategory) {
            chartCategory.addEventListener('change', (e) => {
                this.handleChartCategoryChange(e.target.value);
            });
        }

        const chartPeriod = document.getElementById('chartPeriod');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', (e) => {
                this.handleChartPeriodChange(e.target.value);
            });
        }
    }

    /**
     * 設定ページのイベントリスナー設定
     */
    setupSettingsEventListeners() {
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.handleThemeChange(e.target.value);
            });
        }

        const notificationToggle = document.getElementById('notificationToggle');
        if (notificationToggle) {
            notificationToggle.addEventListener('change', (e) => {
                this.handleNotificationToggle(e.target.checked);
            });
        }

        const autoSaveToggle = document.getElementById('autoSaveToggle');
        if (autoSaveToggle) {
            autoSaveToggle.addEventListener('change', (e) => {
                this.handleAutoSaveToggle(e.target.checked);
            });
        }

        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.handleExportData();
            });
        }

        const importDataBtn = document.getElementById('importDataBtn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => {
                this.handleImportData();
            });
        }

        const deleteAllDataBtn = document.getElementById('deleteAllDataBtn');
        if (deleteAllDataBtn) {
            deleteAllDataBtn.addEventListener('click', () => {
                this.handleDeleteAllData();
            });
        }
    }

    /**
     * ページ読み込み完了時の処理
     */
    onPageLoaded() {
        console.log(`${this.currentPage}ページが読み込まれました`);
        
        // ページタイトルの設定
        this.setPageTitle();
        
        // データの読み込みと表示
        this.loadAndDisplayData();
    }

    /**
     * ページタイトルの設定
     */
    setPageTitle() {
        const titles = this.constants.PAGE_TITLES;
        let title = titles.HOME;
        
        switch (this.currentPage) {
            case 'home':
                title = titles.HOME;
                break;
            case 'history':
                title = titles.HISTORY;
                break;
            case 'stats':
                title = titles.STATS;
                break;
            case 'settings':
                title = titles.SETTINGS;
                break;
        }
        
        document.title = title;
    }

    /**
     * データの読み込みと表示
     */
    loadAndDisplayData() {
        try {
            switch (this.currentPage) {
                case 'home':
                    this.updateCategorySelect();
                    this.displayTodaySummary();
                    break;
                case 'history':
                    this.displayRecordsList();
                    break;
                case 'stats':
                    this.displayStatsSummary();
                    break;
                case 'settings':
                    this.loadAndDisplaySettings();
                    this.displayCategoriesList();
                    this.displayAppInfo();
                    break;
            }
        } catch (error) {
            console.error('データ表示エラー:', error);
            this.showError('データの表示に失敗しました');
        }
    }

    /**
     * カテゴリセレクトの更新
     */
    updateCategorySelect() {
        const categorySelects = document.querySelectorAll('#recordCategory, #categoryFilter, #chartCategory');
        const categories = this.dataManager.getCategories();
        
        categorySelects.forEach(select => {
            if (select) {
                // 既存のオプションを保持（最初の「選択してください」オプション）
                const firstOption = select.querySelector('option');
                select.innerHTML = '';
                
                if (firstOption) {
                    select.appendChild(firstOption);
                }
                
                // カテゴリオプションを追加
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    select.appendChild(option);
                });
            }
        });
    }

    /**
     * 今日の記録サマリーの表示
     */
    displayTodaySummary() {
        const summaryElement = document.getElementById('todaySummary');
        if (!summaryElement) return;

        const today = this.validation.getCurrentDate();
        const todayRecords = this.dataManager.getRecords({ date: today });

        if (todayRecords.length === 0) {
            summaryElement.innerHTML = '<p class="summary-placeholder">まだ記録がありません</p>';
        } else {
            const summaryHTML = todayRecords.map(record => `
                <div class="summary-item">
                    <span class="summary-category">${record.category}</span>
                    <span class="summary-value">${record.value}</span>
                </div>
            `).join('');
            
            summaryElement.innerHTML = summaryHTML;
        }
    }

    /**
     * 記録一覧の表示
     */
    displayRecordsList() {
        const recordsList = document.getElementById('recordsList');
        const recordsCount = document.getElementById('recordsCount');
        
        if (!recordsList) return;

        const records = this.dataManager.getRecords({ sortBy: 'date', sortOrder: 'desc' });

        if (recordsCount) {
            recordsCount.textContent = records.length;
        }

        if (records.length === 0) {
            recordsList.innerHTML = `
                <div class="no-records">
                    <p>まだ記録がありません</p>
                    <a href="index.html" class="btn btn-primary">記録を追加</a>
                </div>
            `;
        } else {
            const recordsHTML = records.map(record => `
                <div class="record-item" data-id="${record.id}">
                    <div class="record-info">
                        <div class="record-header">
                            <span class="record-category">${record.category}</span>
                            <span class="record-date">${this.formatDate(record.date)}</span>
                        </div>
                        <div class="record-value">${record.value}</div>
                        ${record.memo ? `<div class="record-memo">${record.memo}</div>` : ''}
                    </div>
                    <div class="record-actions">
                        <button class="btn btn-small btn-secondary" onclick="app.editRecord('${record.id}')">編集</button>
                        <button class="btn btn-small btn-danger" onclick="app.deleteRecord('${record.id}')">削除</button>
                    </div>
                </div>
            `).join('');
            
            recordsList.innerHTML = recordsHTML;
        }
    }

    /**
     * 統計サマリーの表示
     */
    displayStatsSummary() {
        const records = this.dataManager.getRecords();
        
        // 総記録数
        const totalRecordsElement = document.getElementById('totalRecords');
        if (totalRecordsElement) {
            totalRecordsElement.textContent = records.length;
        }

        // 記録日数
        const recordDaysElement = document.getElementById('recordDays');
        if (recordDaysElement) {
            const uniqueDates = [...new Set(records.map(r => r.date))];
            recordDaysElement.textContent = `${uniqueDates.length}日`;
        }

        // 最多記録項目
        const topCategoryElement = document.getElementById('topCategory');
        if (topCategoryElement) {
            const categoryCounts = {};
            records.forEach(record => {
                categoryCounts[record.category] = (categoryCounts[record.category] || 0) + 1;
            });
            
            const topCategory = Object.keys(categoryCounts).reduce((a, b) => 
                categoryCounts[a] > categoryCounts[b] ? a : b, '');
            
            topCategoryElement.textContent = topCategory || '-';
        }

        // 平均記録数
        const averageRecordsElement = document.getElementById('averageRecords');
        if (averageRecordsElement) {
            const uniqueDates = [...new Set(records.map(r => r.date))];
            const average = uniqueDates.length > 0 ? Math.round(records.length / uniqueDates.length * 10) / 10 : 0;
            averageRecordsElement.textContent = average;
        }
    }

    /**
     * 設定の読み込みと表示
     */
    loadAndDisplaySettings() {
        const settings = this.dataManager.getSettings();
        
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = settings.theme || 'default';
        }

        const notificationToggle = document.getElementById('notificationToggle');
        if (notificationToggle) {
            notificationToggle.checked = settings.notifications || false;
        }

        const autoSaveToggle = document.getElementById('autoSaveToggle');
        if (autoSaveToggle) {
            autoSaveToggle.checked = settings.autoSave !== false;
        }
    }

    /**
     * カテゴリ一覧の表示
     */
    displayCategoriesList() {
        const categoriesList = document.getElementById('categoriesList');
        if (!categoriesList) return;

        const categories = this.dataManager.getCategories();
        const records = this.dataManager.getRecords();

        const categoriesHTML = categories.map(category => {
            const categoryRecords = records.filter(r => r.category === category);
            return `
                <div class="category-item">
                    <div class="category-info">
                        <span class="category-name">${category}</span>
                        <span class="category-count">${categoryRecords.length}件の記録</span>
                    </div>
                    <div class="category-actions">
                        <button class="btn btn-small btn-secondary" onclick="app.editCategory('${category}')">編集</button>
                        <button class="btn btn-small btn-danger" onclick="app.deleteCategory('${category}')">削除</button>
                    </div>
                </div>
            `;
        }).join('');

        categoriesList.innerHTML = categoriesHTML;
    }

    /**
     * アプリ情報の表示
     */
    displayAppInfo() {
        const storageInfo = this.dataManager.getStorageInfo();
        
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            const lastUpdate = storageInfo.lastUpdate ? 
                new Date(storageInfo.lastUpdate).toLocaleDateString('ja-JP') : 
                '未設定';
            lastUpdateElement.textContent = lastUpdate;
        }

        const dataSizeElement = document.getElementById('dataSize');
        if (dataSizeElement) {
            dataSizeElement.textContent = `${storageInfo.dataSizeKB} KB`;
        }
    }

    /**
     * 記録送信の処理
     */
    handleRecordSubmit() {
        const form = document.getElementById('recordForm');
        if (!form) return;

        // フォームエラーのクリア
        this.validation.clearFormErrors('recordForm');

        // フォームデータの取得
        const formData = new FormData(form);
        const record = {
            category: formData.get('recordCategory') || document.getElementById('recordCategory').value,
            value: parseInt(formData.get('recordValue') || document.getElementById('recordValue').value),
            memo: formData.get('recordMemo') || document.getElementById('recordMemo').value
        };

        // バリデーション
        const validation = this.validation.validateRecord(record);
        if (!validation.isValid) {
            Object.keys(validation.errors).forEach(field => {
                this.validation.showFieldError(`record${field.charAt(0).toUpperCase() + field.slice(1)}`, validation.errors[field]);
            });
            return;
        }

        // 記録の保存
        if (this.dataManager.addRecord(record)) {
            this.showSuccess('記録を保存しました');
            form.reset();
            this.displayTodaySummary();
        } else {
            this.showError('記録の保存に失敗しました');
        }
    }

    /**
     * 検索処理
     */
    handleSearch(searchTerm) {
        const records = this.dataManager.getRecords({ search: searchTerm });
        this.displayFilteredRecords(records);
    }

    /**
     * カテゴリフィルター処理
     */
    handleCategoryFilter(category) {
        const records = this.dataManager.getRecords({ category: category });
        this.displayFilteredRecords(records);
    }

    /**
     * 日付フィルター処理
     */
    handleDateFilter(dateFilter) {
        let records = [];
        
        switch (dateFilter) {
            case 'today':
                const today = this.validation.getCurrentDate();
                records = this.dataManager.getRecords({ date: today });
                break;
            case 'week':
                // 今週の記録を取得（簡易実装）
                records = this.dataManager.getRecords();
                break;
            case 'month':
                // 今月の記録を取得（簡易実装）
                records = this.dataManager.getRecords();
                break;
            case 'year':
                // 今年の記録を取得（簡易実装）
                records = this.dataManager.getRecords();
                break;
            default:
                records = this.dataManager.getRecords();
        }
        
        this.displayFilteredRecords(records);
    }

    /**
     * フィルターされた記録の表示
     */
    displayFilteredRecords(records) {
        const recordsList = document.getElementById('recordsList');
        const recordsCount = document.getElementById('recordsCount');
        
        if (recordsCount) {
            recordsCount.textContent = records.length;
        }

        if (records.length === 0) {
            recordsList.innerHTML = '<div class="no-records"><p>該当する記録がありません</p></div>';
        } else {
            const recordsHTML = records.map(record => `
                <div class="record-item" data-id="${record.id}">
                    <div class="record-info">
                        <div class="record-header">
                            <span class="record-category">${record.category}</span>
                            <span class="record-date">${this.formatDate(record.date)}</span>
                        </div>
                        <div class="record-value">${record.value}</div>
                        ${record.memo ? `<div class="record-memo">${record.memo}</div>` : ''}
                    </div>
                    <div class="record-actions">
                        <button class="btn btn-small btn-secondary" onclick="app.editRecord('${record.id}')">編集</button>
                        <button class="btn btn-small btn-danger" onclick="app.deleteRecord('${record.id}')">削除</button>
                    </div>
                </div>
            `).join('');
            
            recordsList.innerHTML = recordsHTML;
        }
    }

    /**
     * 記録の編集
     */
    editRecord(id) {
        // 将来的に実装
        console.log('記録を編集:', id);
    }

    /**
     * 記録の削除
     */
    deleteRecord(id) {
        if (confirm('この記録を削除しますか？')) {
            if (this.dataManager.deleteRecord(id)) {
                this.showSuccess('記録を削除しました');
                this.displayRecordsList();
            } else {
                this.showError('記録の削除に失敗しました');
            }
        }
    }

    /**
     * カテゴリの編集
     */
    editCategory(category) {
        // 将来的に実装
        console.log('カテゴリを編集:', category);
    }

    /**
     * カテゴリの削除
     */
    deleteCategory(category) {
        if (confirm(`カテゴリ「${category}」を削除しますか？`)) {
            if (this.dataManager.deleteCategory(category)) {
                this.showSuccess('カテゴリを削除しました');
                this.displayCategoriesList();
                this.updateCategorySelect();
            } else {
                this.showError('カテゴリの削除に失敗しました');
            }
        }
    }

    /**
     * テーマ変更の処理
     */
    handleThemeChange(theme) {
        const settings = { theme: theme };
        if (this.dataManager.updateSettings(settings)) {
            this.showSuccess('テーマを変更しました');
        } else {
            this.showError('テーマの変更に失敗しました');
        }
    }

    /**
     * 通知設定の処理
     */
    handleNotificationToggle(enabled) {
        const settings = { notifications: enabled };
        if (this.dataManager.updateSettings(settings)) {
            this.showSuccess('通知設定を更新しました');
        } else {
            this.showError('通知設定の更新に失敗しました');
        }
    }

    /**
     * 自動保存設定の処理
     */
    handleAutoSaveToggle(enabled) {
        const settings = { autoSave: enabled };
        if (this.dataManager.updateSettings(settings)) {
            this.showSuccess('自動保存設定を更新しました');
        } else {
            this.showError('自動保存設定の更新に失敗しました');
        }
    }

    /**
     * データエクスポートの処理
     */
    handleExportData() {
        const data = this.dataManager.exportData();
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `myguinnessbook_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccess('データをエクスポートしました');
        } else {
            this.showError('データのエクスポートに失敗しました');
        }
    }

    /**
     * データインポートの処理
     */
    handleImportData() {
        const input = document.getElementById('importFile');
        if (input) {
            input.click();
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const data = e.target.result;
                        if (this.dataManager.importData(data)) {
                            this.showSuccess('データをインポートしました');
                            this.loadAndDisplayData();
                        } else {
                            this.showError('データのインポートに失敗しました');
                        }
                    };
                    reader.readAsText(file);
                }
            };
        }
    }

    /**
     * 全データ削除の処理
     */
    handleDeleteAllData() {
        if (confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
            this.dataManager.deleteAllData();
            this.showSuccess('すべてのデータを削除しました');
            this.loadAndDisplayData();
        }
    }

    /**
     * 新しいカテゴリ追加ダイアログの表示
     */
    showAddCategoryDialog() {
        const category = prompt('新しい記録項目を入力してください:');
        if (category && category.trim()) {
            if (this.dataManager.addCategory(category.trim())) {
                this.showSuccess('記録項目を追加しました');
                this.updateCategorySelect();
                if (this.currentPage === 'settings') {
                    this.displayCategoriesList();
                }
            } else {
                this.showError('記録項目の追加に失敗しました');
            }
        }
    }

    /**
     * 検索・フィルター機能の初期化
     */
    initializeSearchAndFilter() {
        // 将来的に実装
    }

    /**
     * グラフの初期化
     */
    initializeCharts() {
        // 将来的に実装（Chart.jsを使用）
    }

    /**
     * グラフタイプ変更の処理
     */
    handleChartTypeChange(type) {
        // 将来的に実装
        console.log('グラフタイプ変更:', type);
    }

    /**
     * グラフカテゴリ変更の処理
     */
    handleChartCategoryChange(category) {
        // 将来的に実装
        console.log('グラフカテゴリ変更:', category);
    }

    /**
     * グラフ期間変更の処理
     */
    handleChartPeriodChange(period) {
        // 将来的に実装
        console.log('グラフ期間変更:', period);
    }

    /**
     * 日付のフォーマット
     * @param {string} dateString - 日付文字列
     * @returns {string} フォーマットされた日付
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP');
    }

    /**
     * 成功メッセージの表示
     * @param {string} message - メッセージ
     */
    showSuccess(message) {
        console.log('Success:', message);
        // 将来的にトースト通知を実装
        alert(message);
    }

    /**
     * エラーメッセージの表示
     * @param {string} message - メッセージ
     */
    showError(message) {
        console.error('Error:', message);
        // 将来的にトースト通知を実装
        alert(message);
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 