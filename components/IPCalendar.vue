<template>
  <div ref="viz" class="my_dataviz"></div>
</template>

<script>
import * as d3 from 'd3'
// import { legend } from '@d3/color-legend'

export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  watch: {
    data(newValue, oldValue) {
      console.log('new calendar data')
      this.renderCalendar()
    },
  },
  /* eslint-disable no-unused-vars */
  mounted() {
    this.renderCalendar()
  },

  methods: {
    renderCalendar() {
      const weekday = 'sunday'
      const cellSize = 17
      //   console.log(data)
      const data = d3.pairs(
        this.data,
        ({ Close: Previous }, { Date, Close }) => {
          return {
            date: new window.Date(Date),
            value: (Close - Previous) / Previous,
            close: Close,
          }
        }
      )
      const minIncidents = d3.min(data, function (d) {
        return d.close
      })
      const maxIncidents = d3.max(data, function (d) {
        return d.close
      })
      const avgIncidents = d3.max(data, function (d) {
        return d.close
      })
      const color = () => {
        const closeValues = data
          .map((d) => Math.abs(d.close))
          .sort(d3.ascending)
        const min = d3.quantile(closeValues, 0.02)
        const max = d3.quantile(closeValues, 0.98)

        return d3
          .scaleSequential(d3.interpolateRgbBasis(['white', 'orange', 'red']))
          .domain([min, max])
      }

      const formatDay = (i) => 'SMTWTFS'[i]
      const formatDate = d3.utcFormat('%x')
      const formatClose = d3.format(',')
      const formatValue = d3.format('+.2%')
      const formatMonth = d3.utcFormat('%b')
      const pathMonth = (t) => {
        const n = weekday === 'weekday' ? 5 : 7
        const d = Math.max(0, Math.min(n, countDay(t.getUTCDay())))
        const w = timeWeek.count(d3.utcYear(t), t)
        return `${
          d === 0
            ? `M${w * cellSize},0`
            : d === n
            ? `M${(w + 1) * cellSize},0`
            : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
        }V${n * cellSize}`
      }
      const countDay = weekday === 'sunday' ? (i) => i : (i) => (i + 6) % 7
      const timeWeek = weekday === 'sunday' ? d3.utcSunday : d3.utcMonday
      const height = cellSize * (weekday === 'weekday' ? 7 : 9)
      const width = 954
      // console.log(data)
      const years = d3.groups(data, (d) => d.date.getUTCFullYear()).reverse()
      // eslint-disable-next-line no-unused-vars
      const chart = () => {
        const svg = d3
          .create('svg')
          .attr('viewBox', [0, 0, width, height * years.length])
          .attr('font-family', 'sans-serif')
          .attr('font-size', 10)

        const year = svg
          .selectAll('g')
          .data(years)
          .join('g')
          .attr(
            'transform',
            (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`
          )

        year
          .append('text')
          .attr('x', -5)
          .attr('y', -5)
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'end')
          .text(([key]) => key)

        year
          .append('g')
          .attr('text-anchor', 'end')
          .selectAll('text')
          .data(weekday === 'weekday' ? d3.range(1, 6) : d3.range(7))
          .join('text')
          .attr('x', -5)
          .attr('y', (i) => (countDay(i) + 0.5) * cellSize)
          .attr('dy', '0.31em')
          .text(formatDay)

        year
          .append('g')
          .selectAll('rect')
          .data(
            weekday === 'weekday'
              ? ([, values]) =>
                  values.filter((d) => ![0, 6].includes(d.date.getUTCDay()))
              : ([, values]) => values
          )
          .join('rect')
          .attr('width', cellSize - 1)
          .attr('height', cellSize - 1)
          .attr(
            'x',
            (d) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5
          )
          .attr('y', (d) => countDay(d.date.getUTCDay()) * cellSize + 0.5)
          .attr('fill', (d) => color()(d.close))
          .append('title')
          .text(
            (d) => `${formatDate(d.date)}
${formatClose(d.close)} incidents`
          )

        const month = year
          .append('g')
          .selectAll('g')
          .data(([, values]) =>
            d3.utcMonths(
              d3.utcMonth(values[0].date),
              values[values.length - 1].date
            )
          )
          .join('g')

        month
          .filter((d, i) => i)
          .append('path')
          .attr('fill', 'none')
          .attr('stroke', '#000')
          .attr('stroke-width', 3)
          .attr('d', pathMonth)

        month
          .append('text')
          .attr(
            'x',
            (d) =>
              timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2
          )
          .attr('y', -5)
          .text(formatMonth)

        return svg.node()
      }
      d3.select(this.$refs.viz)
        .html(null) // Clean out prior renders.
        .data([chart()])
        .append((d) => {
          return d
        })
      // this.$refs.viz.appendChild(chart())
    },
    async loadData() {
      // const data = await d3.csv('/data/dow.csv').then((data) => {
      return await this.$axios
        .post(this.$axios.defaults.baseURL + '/api/sql', {
          sql: `SELECT today.[Date], today.[Crimes] as [Close], yesterday.[Crimes] AS [Open] FROM 
            (SELECT REPLACE([Incident Date],'/','-') as [Date], COUNT(*) AS [Crimes] FROM incidents GROUP BY REPLACE([Incident Date],'/','-')) today
            LEFT OUTER JOIN
            (SELECT REPLACE([Incident Date],'/','-') as [Date], COUNT(*) AS [Crimes] FROM incidents GROUP BY REPLACE([Incident Date],'/','-')) yesterday
            ON today.[Date] = DATE(yesterday.[Date],'-1 Days') ORDER BY today.[Date] ASC`,
        })
        .then((res) => {
          const data = res.data.data
          // console.log(data)
          return d3.pairs(data, ({ Close: Previous }, { Date, Close }) => {
            return {
              date: new window.Date(Date),
              value: (Close - Previous) / Previous,
              close: Close,
            }
          })
        })
        .then((data) => {
          return data
        })
    },
  },
}
</script>
<style>
svg text {
  fill: #ffffff !important;
}
</style>
