import { useState, useMemo } from 'react';
import {
  SxProps,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart } from 'echarts/charts';
import { formatNumber } from 'helpers/formatNumber';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';

echarts.use([LineChart, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

interface ClientChartProps {
  data: { date: string; close: number; volume: number; trade_code: string }[];
  tradeCodes: string[];
  sx?: SxProps;
}

// Define a type for the tooltip params
interface TooltipParam {
  name: string; // Date from xAxis
  value: number; // Value of the series (close or volume)
  seriesName: string; // 'Close' or 'Volume'
}

const ReportsChart = ({ data, tradeCodes, ...rest }: ClientChartProps) => {
  const theme = useTheme();
  const [selectedTradeCode, setSelectedTradeCode] = useState<string>(tradeCodes[0] || '');

  const handleTradeCodeChange = (event: SelectChangeEvent<string>) => {
    setSelectedTradeCode(event.target.value as string);
  };

  // Filter and sort data based on selected trade code
  const filteredData = useMemo(() => {
    return data
      .filter((item) => item.trade_code === selectedTradeCode)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, selectedTradeCode]);

  const dates = filteredData.map((item) => item.date);
  const closeValues = filteredData.map((item) => item.close);
  const volumeValues = filteredData.map((item) => item.volume);

  const option = useMemo(
    () => ({
      grid: {
        top: 50,
        bottom: 50,
        left: 60,
        right: 60,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          snap: true,
          lineStyle: {
            type: 'dashed',
            width: 1,
            color: theme.palette.primary.main,
          },
        },
        formatter: (params: TooltipParam[]) => {
          const close = params.find((p) => p.seriesName === 'Close')?.value ?? 0;
          const volume = params.find((p) => p.seriesName === 'Volume')?.value ?? 0;
          return `
            <div style="padding: 8px;">
              <strong>${params[0]?.name ?? ''}</strong><br/>
              Close: ${formatNumber(close)}<br/>
              Volume: ${volume >= 1000 ? `${(volume / 1000).toFixed(1)}K` : volume}
            </div>
          `;
        },
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        textStyle: {
          color: theme.palette.text.primary,
        },
      },
      legend: {
        data: ['Close', 'Volume'],
        textStyle: {
          color: theme.palette.text.secondary,
          fontFamily: theme.typography.fontFamily,
        },
        top: 10,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisTick: { show: false },
        axisLine: {
          lineStyle: { color: theme.palette.divider },
        },
        axisLabel: {
          color: theme.palette.text.disabled,
          fontSize: theme.typography.caption.fontSize,
          rotate: dates.length > 10 ? 45 : 0,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Close',
          position: 'left',
          min: 0,
          max: Math.max(...closeValues) * 1.1 || 100,
          axisLabel: {
            formatter: (value: number) => formatNumber(value),
            color: theme.palette.text.disabled,
          },
          splitLine: {
            lineStyle: {
              color: theme.palette.divider,
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          name: 'Volume',
          position: 'right',
          min: 0,
          max: Math.max(...volumeValues) * 1.1 || 1000,
          axisLabel: {
            formatter: (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value),
            color: theme.palette.text.disabled,
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Close',
          type: 'line',
          data: closeValues,
          smooth: true,
          lineStyle: {
            width: 2,
            color: theme.palette.primary.main,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: theme.palette.primary.light + '33' },
              { offset: 1, color: 'transparent' },
            ]),
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          data: volumeValues,
          yAxisIndex: 1,
          itemStyle: {
            color: theme.palette.secondary.main,
            opacity: 0.7,
          },
        },
      ],
    }),
    [theme, dates, closeValues, volumeValues]
  );

  return (
    <>
      <FormControl sx={{ mb: 2 }}>
        <InputLabel>Trade Code</InputLabel>
        <Select
          value={selectedTradeCode}
          onChange={handleTradeCodeChange}
          label="Trade Code"
          sx={{ width: 200 }}
        >
          {tradeCodes.map((tradeCode) => (
            <MenuItem key={tradeCode} value={tradeCode}>
              {tradeCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filteredData.length > 0 ? (
        <ReactEchart echarts={echarts} option={option} {...rest} />
      ) : (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          No data available for the selected trade code.
        </Typography>
      )}
    </>
  );
};

export default ReportsChart;