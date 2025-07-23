/**
 * データ管理クラス
 * localStorageを使用したデータの保存・取得・管理を行う
 */

class DataManager {
    constructor() {
        this.storageKeys = window.APP_CONSTANTS.STORAGE_KEYS;
        this.dataStructure = window.APP_CONSTANTS.DATA_STRUCTURE;
        this.defaultSettings = window.APP_CONSTANTS.DEFAULT_SETTINGS;
        this.validation = window.Validation;
        
        // 初期化
        this.initialize();
    }

    /**
     * データマネージャーの初期化
     */
    initialize() {
        try {
            // データの存在確認と初期化
            if (!this.hasData()) {
                this.createInitialData();
            } else {
                // 既存データの整合性チェック
                const integrity = this.validation.validateDataIntegrity(this.getData());
                if (!integrity.isValid) {
                    console.warn('データ整合性の問題を検出:', integrity.issues);
                    this.repairData();
                }
            }

            // メタデータの更新
            this.updateMetadata();
            
            console.log('DataManager initialized successfully');
        } catch (error) {
            console.error('DataManager initialization failed:', error);
            this.handleError(error);
        }
    }

    /**
     * データの存在確認
     * @returns {boolean} データが存在するかどうか
     */
    hasData() {
        try {
            const data = localStorage.getItem(this.storageKeys.APP_DATA);
            return data !== null && data !== undefined;
        } catch (error) {
            console.error('データ存在確認エラー:', error);
            return false;
        }
    }

    /**
     * 初期データの作成
     */
    createInitialData() {
        try {
            const initialData = {
                ...this.dataStructure,
                metadata: {
                    ...this.dataStructure.metadata,
                    created: new Date().toISOString(),
                    lastUpdate: new Date().toISOString()
                }
            };

            this.saveData(initialData);
            console.log('初期データを作成しました');
        } catch (error) {
            console.error('初期データ作成エラー:', error);
            this.handleError(error);
        }
    }

    /**
     * データの取得
     * @returns {Object} 保存されているデータ
     */
    getData() {
        try {
            const data = localStorage.getItem(this.storageKeys.APP_DATA);
            if (!data) {
                throw new Error('データが見つかりません');
            }

            const parsedData = JSON.parse(data);
            return parsedData;
        } catch (error) {
            console.error('データ取得エラー:', error);
            this.handleError(error);
            return this.dataStructure;
        }
    }

    /**
     * データの保存
     * @param {Object} data - 保存するデータ
     */
    saveData(data) {
        try {
            // データの整合性チェック
            const integrity = this.validation.validateDataIntegrity(data);
            if (!integrity.isValid) {
                throw new Error(`データ整合性エラー: ${integrity.issues.join(', ')}`);
            }

            const jsonData = JSON.stringify(data, null, 2);
            localStorage.setItem(this.storageKeys.APP_DATA, jsonData);
            
            // メタデータの更新
            this.updateMetadata();
            
            console.log('データを保存しました');
        } catch (error) {
            console.error('データ保存エラー:', error);
            this.handleError(error);
        }
    }

    /**
     * 記録の追加
     * @param {Object} record - 記録データ
     * @returns {boolean} 保存成功かどうか
     */
    addRecord(record) {
        try {
            // バリデーション
            const validation = this.validation.validateRecord(record);
            if (!validation.isValid) {
                console.error('記録バリデーションエラー:', validation.errors);
                return false;
            }

            const data = this.getData();
            
            // 記録データの正規化
            const normalizedRecord = {
                id: this.generateId(),
                category: this.validation.normalizeCategory(record.category),
                value: this.validation.normalizeValue(record.value),
                memo: this.validation.normalizeMemo(record.memo),
                date: this.validation.normalizeDate(record.date),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // 記録を追加
            data.data.records.push(normalizedRecord);

            // カテゴリが存在しない場合は追加
            if (!data.data.categories.includes(normalizedRecord.category)) {
                data.data.categories.push(normalizedRecord.category);
            }

            // データを保存
            this.saveData(data);
            
            console.log('記録を追加しました:', normalizedRecord);
            return true;
        } catch (error) {
            console.error('記録追加エラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * 記録の更新
     * @param {string} id - 記録ID
     * @param {Object} updates - 更新データ
     * @returns {boolean} 更新成功かどうか
     */
    updateRecord(id, updates) {
        try {
            const data = this.getData();
            const recordIndex = data.data.records.findIndex(record => record.id === id);
            
            if (recordIndex === -1) {
                console.error('記録が見つかりません:', id);
                return false;
            }

            // 更新データのバリデーション
            const updatedRecord = { ...data.data.records[recordIndex], ...updates };
            const validation = this.validation.validateRecord(updatedRecord);
            if (!validation.isValid) {
                console.error('記録更新バリデーションエラー:', validation.errors);
                return false;
            }

            // 記録を更新
            data.data.records[recordIndex] = {
                ...updatedRecord,
                updatedAt: new Date().toISOString()
            };

            // データを保存
            this.saveData(data);
            
            console.log('記録を更新しました:', id);
            return true;
        } catch (error) {
            console.error('記録更新エラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * 記録の削除
     * @param {string} id - 記録ID
     * @returns {boolean} 削除成功かどうか
     */
    deleteRecord(id) {
        try {
            const data = this.getData();
            const recordIndex = data.data.records.findIndex(record => record.id === id);
            
            if (recordIndex === -1) {
                console.error('記録が見つかりません:', id);
                return false;
            }

            // 記録を削除
            data.data.records.splice(recordIndex, 1);

            // データを保存
            this.saveData(data);
            
            console.log('記録を削除しました:', id);
            return true;
        } catch (error) {
            console.error('記録削除エラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * 記録の取得
     * @param {Object} filters - フィルター条件
     * @returns {Array} 記録の配列
     */
    getRecords(filters = {}) {
        try {
            const data = this.getData();
            let records = [...data.data.records];

            // カテゴリフィルター
            if (filters.category) {
                records = records.filter(record => record.category === filters.category);
            }

            // 日付フィルター
            if (filters.date) {
                records = records.filter(record => record.date === filters.date);
            }

            // 期間フィルター
            if (filters.startDate && filters.endDate) {
                records = records.filter(record => {
                    const recordDate = new Date(record.date);
                    const startDate = new Date(filters.startDate);
                    const endDate = new Date(filters.endDate);
                    return recordDate >= startDate && recordDate <= endDate;
                });
            }

            // 検索フィルター
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                records = records.filter(record => 
                    record.category.toLowerCase().includes(searchTerm) ||
                    record.memo.toLowerCase().includes(searchTerm)
                );
            }

            // ソート
            if (filters.sortBy) {
                records.sort((a, b) => {
                    const aValue = a[filters.sortBy];
                    const bValue = b[filters.sortBy];
                    
                    if (filters.sortOrder === 'desc') {
                        return bValue > aValue ? 1 : -1;
                    } else {
                        return aValue > bValue ? 1 : -1;
                    }
                });
            }

            return records;
        } catch (error) {
            console.error('記録取得エラー:', error);
            this.handleError(error);
            return [];
        }
    }

    /**
     * カテゴリの取得
     * @returns {Array} カテゴリの配列
     */
    getCategories() {
        try {
            const data = this.getData();
            return [...data.data.categories];
        } catch (error) {
            console.error('カテゴリ取得エラー:', error);
            this.handleError(error);
            return [];
        }
    }

    /**
     * カテゴリの追加
     * @param {string} category - カテゴリ名
     * @returns {boolean} 追加成功かどうか
     */
    addCategory(category) {
        try {
            // バリデーション
            if (!this.validation.validateCategory(category)) {
                console.error('カテゴリバリデーションエラー');
                return false;
            }

            const data = this.getData();
            const normalizedCategory = this.validation.normalizeCategory(category);

            // 既に存在する場合は追加しない
            if (data.data.categories.includes(normalizedCategory)) {
                console.warn('カテゴリは既に存在します:', normalizedCategory);
                return false;
            }

            // カテゴリを追加
            data.data.categories.push(normalizedCategory);

            // データを保存
            this.saveData(data);
            
            console.log('カテゴリを追加しました:', normalizedCategory);
            return true;
        } catch (error) {
            console.error('カテゴリ追加エラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * カテゴリの削除
     * @param {string} category - カテゴリ名
     * @returns {boolean} 削除成功かどうか
     */
    deleteCategory(category) {
        try {
            const data = this.getData();
            
            // カテゴリに関連する記録があるかチェック
            const relatedRecords = data.data.records.filter(record => record.category === category);
            if (relatedRecords.length > 0) {
                console.error('カテゴリに関連する記録が存在します:', relatedRecords.length);
                return false;
            }

            // カテゴリを削除
            const categoryIndex = data.data.categories.indexOf(category);
            if (categoryIndex === -1) {
                console.error('カテゴリが見つかりません:', category);
                return false;
            }

            data.data.categories.splice(categoryIndex, 1);

            // データを保存
            this.saveData(data);
            
            console.log('カテゴリを削除しました:', category);
            return true;
        } catch (error) {
            console.error('カテゴリ削除エラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * 設定の取得
     * @returns {Object} 設定データ
     */
    getSettings() {
        try {
            const data = this.getData();
            return { ...this.defaultSettings, ...data.settings };
        } catch (error) {
            console.error('設定取得エラー:', error);
            this.handleError(error);
            return { ...this.defaultSettings };
        }
    }

    /**
     * 設定の更新
     * @param {Object} settings - 更新する設定
     * @returns {boolean} 更新成功かどうか
     */
    updateSettings(settings) {
        try {
            // バリデーション
            const validation = this.validation.validateSettings(settings);
            if (!validation.isValid) {
                console.error('設定バリデーションエラー:', validation.errors);
                return false;
            }

            const data = this.getData();
            data.settings = { ...data.settings, ...settings };

            // データを保存
            this.saveData(data);
            
            console.log('設定を更新しました:', settings);
            return true;
        } catch (error) {
            console.error('設定更新エラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * データの削除
     */
    deleteAllData() {
        try {
            localStorage.removeItem(this.storageKeys.APP_DATA);
            localStorage.removeItem(this.storageKeys.SETTINGS);
            localStorage.removeItem(this.storageKeys.BACKUP);
            
            console.log('すべてのデータを削除しました');
        } catch (error) {
            console.error('データ削除エラー:', error);
            this.handleError(error);
        }
    }

    /**
     * データのエクスポート
     * @returns {string} JSON文字列
     */
    exportData() {
        try {
            const data = this.getData();
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('データエクスポートエラー:', error);
            this.handleError(error);
            return null;
        }
    }

    /**
     * データのインポート
     * @param {string} jsonData - JSON文字列
     * @returns {boolean} インポート成功かどうか
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // データの整合性チェック
            const integrity = this.validation.validateDataIntegrity(data);
            if (!integrity.isValid) {
                console.error('インポートデータの整合性エラー:', integrity.issues);
                return false;
            }

            // データを保存
            this.saveData(data);
            
            console.log('データをインポートしました');
            return true;
        } catch (error) {
            console.error('データインポートエラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * バックアップの作成
     * @returns {boolean} バックアップ成功かどうか
     */
    createBackup() {
        try {
            const data = this.getData();
            const backup = {
                data: data,
                timestamp: new Date().toISOString(),
                version: data.metadata.version
            };

            const backups = this.getBackups();
            backups.push(backup);

            // 最大10個まで保持
            if (backups.length > 10) {
                backups.shift();
            }

            localStorage.setItem(this.storageKeys.BACKUP, JSON.stringify(backups));
            
            console.log('バックアップを作成しました');
            return true;
        } catch (error) {
            console.error('バックアップ作成エラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * バックアップの取得
     * @returns {Array} バックアップの配列
     */
    getBackups() {
        try {
            const backups = localStorage.getItem(this.storageKeys.BACKUP);
            return backups ? JSON.parse(backups) : [];
        } catch (error) {
            console.error('バックアップ取得エラー:', error);
            return [];
        }
    }

    /**
     * バックアップからの復元
     * @param {string} timestamp - バックアップのタイムスタンプ
     * @returns {boolean} 復元成功かどうか
     */
    restoreBackup(timestamp) {
        try {
            const backups = this.getBackups();
            const backup = backups.find(b => b.timestamp === timestamp);
            
            if (!backup) {
                console.error('バックアップが見つかりません:', timestamp);
                return false;
            }

            // データを復元
            this.saveData(backup.data);
            
            console.log('バックアップを復元しました:', timestamp);
            return true;
        } catch (error) {
            console.error('バックアップ復元エラー:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * データの修復
     */
    repairData() {
        try {
            const data = this.getData();
            let repaired = false;

            // 必須フィールドの修復
            if (!data.settings) {
                data.settings = { ...this.defaultSettings };
                repaired = true;
            }

            if (!data.data) {
                data.data = { ...this.dataStructure.data };
                repaired = true;
            }

            if (!data.backup) {
                data.backup = { ...this.dataStructure.backup };
                repaired = true;
            }

            if (!data.metadata) {
                data.metadata = { ...this.dataStructure.metadata };
                repaired = true;
            }

            // 記録データの修復
            if (!Array.isArray(data.data.records)) {
                data.data.records = [];
                repaired = true;
            }

            // カテゴリデータの修復
            if (!Array.isArray(data.data.categories)) {
                data.data.categories = [...this.dataStructure.data.categories];
                repaired = true;
            }

            if (repaired) {
                this.saveData(data);
                console.log('データを修復しました');
            }
        } catch (error) {
            console.error('データ修復エラー:', error);
            this.handleError(error);
        }
    }

    /**
     * メタデータの更新
     */
    updateMetadata() {
        try {
            const data = this.getData();
            data.metadata.lastUpdate = new Date().toISOString();
            data.metadata.version = this.dataStructure.metadata.version;
            
            this.saveData(data);
        } catch (error) {
            console.error('メタデータ更新エラー:', error);
        }
    }

    /**
     * ユニークIDの生成
     * @returns {string} ユニークID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * エラーハンドリング
     * @param {Error} error - エラーオブジェクト
     */
    handleError(error) {
        console.error('DataManager Error:', error);
        
        // エラー通知の実装（将来的に拡張）
        if (typeof window.showNotification === 'function') {
            window.showNotification('データエラーが発生しました', 'error');
        }
    }

    /**
     * ストレージ容量の確認
     * @returns {Object} ストレージ情報
     */
    getStorageInfo() {
        try {
            const data = this.getData();
            const dataSize = JSON.stringify(data).length;
            
            return {
                dataSize: dataSize,
                dataSizeKB: Math.round(dataSize / 1024 * 100) / 100,
                recordCount: data.data.records.length,
                categoryCount: data.data.categories.length,
                lastUpdate: data.metadata.lastUpdate
            };
        } catch (error) {
            console.error('ストレージ情報取得エラー:', error);
            return {
                dataSize: 0,
                dataSizeKB: 0,
                recordCount: 0,
                categoryCount: 0,
                lastUpdate: null
            };
        }
    }
}

// グローバルインスタンスを作成
window.DataManager = new DataManager(); 