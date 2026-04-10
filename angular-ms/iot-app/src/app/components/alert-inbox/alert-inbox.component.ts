import { Component, OnInit } from '@angular/core';
import { AlertHistoryService, AlertEntry } from '../../services/alert-history.service';

@Component({
  selector: 'app-alert-inbox',
  templateUrl: './alert-inbox.component.html',
  styleUrls: ['./alert-inbox.component.less']
})
export class AlertInboxComponent implements OnInit {

  constructor(private alertHistory: AlertHistoryService) { }

  ngOnInit(): void {
  }

  get history(): AlertEntry[] {
    return this.alertHistory.getHistory();
  }

  clearHistory(): void {
    this.alertHistory.clearHistory();
  }

}
