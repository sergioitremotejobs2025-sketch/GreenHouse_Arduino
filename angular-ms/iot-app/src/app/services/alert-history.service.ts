import { Injectable } from '@angular/core';

export interface AlertEntry {
    message: string;
    type: 'success' | 'warning' | 'error';
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AlertHistoryService {
    private readonly STORAGE_KEY = 'alert_history';
    private readonly MAX_ALERTS = 50;

    private history: AlertEntry[] = [];

    constructor() {
        this.loadHistory();
    }

    getHistory(): AlertEntry[] {
        return this.history;
    }

    addAlert(alert: AlertEntry): void {
        this.history.unshift(alert);
        if (this.history.length > this.MAX_ALERTS) {
            this.history.pop();
        }
        this.saveHistory();
    }

    clearHistory(): void {
        this.history = [];
        this.saveHistory();
    }

    private loadHistory(): void {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.history = JSON.parse(saved);
            } catch (e) {
                this.history = [];
            }
        }
    }

    private saveHistory(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history));
    }
}
