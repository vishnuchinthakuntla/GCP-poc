import { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import './Charts.css';

export const sampleFormattedChartData = [
    { name: 'P1', y: 2, color: '#F43F5E' },
    { name: 'P2', y: 2, color: '#F5A524' },
    { name: 'P3', y: 1, color: '#4F8EF7' },
    { name: 'P4', y: 1, color: '#10D9A0' },
];

export const sampleTrendData = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
        { name: 'P1', data: [3, 2, 4, 1, 5, 2, 3] },
        { name: 'P2', data: [5, 4, 6, 3, 7, 4, 5] },
        { name: 'P3', data: [8, 7, 9, 6, 10, 8, 7] },
        { name: 'P4', data: [2, 3, 1, 4, 2, 3, 2] },
    ],
};

function Charts({ ticketChartData, trendData }) {
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);

    const barOptions = {
        chart: { type: 'column', backgroundColor: 'transparent', borderRadius: 10, style: { fontFamily: 'DM Sans,sans-serif' } },
        title: { text: '' },
        xAxis: {
            categories: sampleTrendData?.categories || [],
            labels: { style: { color: '#64748B', fontSize: '11px' } },
            lineColor: 'rgba(14,23,38,0.06)', tickColor: 'transparent', gridLineColor: 'transparent',
        },
        yAxis: {
            min: 0, title: { text: 'Tickets', style: { color: '#64748B' } },
            labels: { style: { color: '#64748B' } }, gridLineColor: 'rgba(14,23,38,0.06)',
        },
        legend: { enabled: true, itemStyle: { color: '#64748B', fontSize: '11px', fontWeight: '500' } },
        colors: ['#F43F5E', '#F5A524', '#4F8EF7', '#10D9A0'],
        series: (trendData?.series || []).map((s) => ({ type: 'column', name: s.name, data: s.data })),
        plotOptions: { column: { stacking: 'normal', borderWidth: 0, borderRadius: 5 } },
        credits: { enabled: false },
    };

    const pieOptions = {
        chart: { type: 'pie', backgroundColor: 'transparent', borderRadius: 10, style: { fontFamily: 'DM Sans,sans-serif' } },
        title: { text: '' },
        plotOptions: {
            pie: {
                innerSize: '58%', borderWidth: 2, borderColor: '#F4F7FD',
                dataLabels: { enabled: true, style: { color: '#94A3B8', textOutline: 'none', fontSize: '11px', fontWeight: '600' } },
                slicedOffset: 5,
            },
        },
        series: [{ type: 'pie', name: 'Tickets', data: sampleFormattedChartData.map((d) => ({ name: d.name, y: d.y, color: d.color })) }],
        credits: { enabled: false },
    };

    return (
        <div className="charts-row">
            <div className="chart-box">
                <h3>TICKETS - Last 7 Days</h3>
                <HighchartsReact highcharts={Highcharts} options={barOptions} ref={barChartRef} />
            </div>
            <div className="chart-box">
                <h3>Open Ticket (P1–P4)</h3>
                <HighchartsReact highcharts={Highcharts} options={pieOptions} ref={pieChartRef} />
            </div>
        </div>
    );
}

export default React.memo(Charts);
