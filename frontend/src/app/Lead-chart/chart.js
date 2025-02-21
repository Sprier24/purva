'use client';
import React, { useState, useEffect, useRef } from "react";
import { Chart } from 'chart.js/auto'; 

export default function CardChart() {
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [chartData, setChartData] = useState({});
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const statuses = ["Proposal", "New", "Discussion", "Demo", "Decided"];
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const statusData = {};

        for (const status of statuses) {
          const response = await fetch(`http://localhost:8000/api/v1/lead/getLeadsByStatus?status=${status}`);
          const data = await response.json();
          
          if (data.success) {
            const totalAmount = data.data.reduce((sum, deal) => sum + deal.amount, 0);
            statusData[status] = totalAmount;
          }
        }

        setChartData(statusData);
      } catch (error) {
        console.error("Error fetching deal data:", error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (!chartData || Object.keys(chartData).length === 0) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: selectedChartType,
      data: {
        labels: statuses,
        datasets: [
          {
            label: `${new Date().getFullYear()} Deal Values`,
            backgroundColor: selectedChartType === "bar" ? "#3182ce" : "rgba(49, 130, 206, 0.5)",
            borderColor: "#3182ce",
            data: statuses.map(status => chartData[status] || 0),
            fill: selectedChartType === "line" ? false : true,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "white" },
            align: "end",
            position: "bottom",
          },
          title: {
            display: false,
            text: "Sales Charts",
            color: "white",
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            ticks: { color: "white" },
            grid: { display: false, color: "rgba(33, 37, 41, 0.3)" },
          },
          y: {
            ticks: { color: "white" },
            grid: { color: "rgba(250, 250, 250, 0.15)" },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, selectedChartType]);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center justify-between">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">Overview</h6>
            <h2 className="text-white text-blueGray-100 font-semibold">Total Lead Value</h2>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedChartType}
              onChange={(e) => setSelectedChartType(e.target.value)}
              className="w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 flex-auto">
        <div className="relative" style={{ height: "500px", width: "100%" }}>
          <canvas ref={chartRef} style={{ height: "100%", width: "100%" }}></canvas>
        </div>
      </div>
    </div>
  );
}
