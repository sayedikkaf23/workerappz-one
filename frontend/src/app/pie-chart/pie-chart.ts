
import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Dashboard } from '../services/dashboard';

@Component({
  selector: 'app-pie-chart',
  standalone: false,
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css'
})
export class PieChart implements OnInit, AfterViewInit {
  partnercode: any;
  monthlyData: any[] = [];
  monthlyTransactionSums: any[] = [];
  last4Months: string[] = [];

  chart: any;

  constructor(private dashbaordService: Dashboard) {}

  ngOnInit(): void {
    const adminRole = localStorage.getItem('AdminRole');
    this.partnercode = localStorage.getItem('partnerCode');

    if (adminRole === 'administrator') {
      this.partnercode = 'superadmin';
    }

    this.fetchUserCounts(this.partnercode);
  }

  fetchUserCounts(partnercode: any): void {
    this.dashbaordService.getAllIndividualAndBusinessUsers(partnercode).subscribe(
      (response) => {
        this.last4Months = response.last4Months || [];
        this.monthlyData = response.monthlyData || [];
        this.monthlyTransactionSums = response.monthlyTransactionSums || [];

        this.updateChart();
      },
      (error) => {
        console.error('Error fetching user counts:', error);
      }
    );
  }

  updateChart(): void {
    const labels = this.last4Months;

    const userCounts = labels.map((label) => {
      const match = this.monthlyData.find((item: any) => {
        const monthName = new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' });
        return `${monthName} ${item._id.year}` === label;
      });
      return match ? match.count : 0;
    });

    const transactionAmounts = labels.map((label) => {
      const match = this.monthlyTransactionSums.find((item) => item.month === label);
      return match ? match.totalAmount : 0;
    });

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = userCounts;
      this.chart.data.datasets[1].data = transactionAmounts;
      this.chart.update();
    }
  }

  ngAfterViewInit(): void {
    const ctx = (document.getElementById('myBarChart') as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'User Counts',
              data: [],
              backgroundColor: '#2c3e50',
              borderColor: '#1a2d40',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Transaction Amount (USD)',
              data: [],
              backgroundColor: '#9b59b6',
              borderColor: '#6f42c1',
              borderWidth: 1,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: false,
              beginAtZero: true
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'User Counts'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: {
                drawOnChartArea: false
              },
              title: {
                display: true,
                text: 'Transaction Amount (USD)'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                }
              }
            }
          }
        }
      });
    }
  }
}
 