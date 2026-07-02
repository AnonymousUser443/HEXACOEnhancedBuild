import { use } from 'echarts/core'
import {
  RadarChart,
  HeatmapChart,
  BarChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  RadarChart,
  HeatmapChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
  GridComponent,
  VisualMapComponent,
  CanvasRenderer
])

export {
  RadarChart,
  HeatmapChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
  GridComponent,
  VisualMapComponent,
  CanvasRenderer
}

export default null
