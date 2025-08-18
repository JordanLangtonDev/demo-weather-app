"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  children: React.ReactElement
}

export function Chart({ data, children, className, ...props }: ChartProps) {
  return (
    <div className={cn("h-[350px] w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export function ChartTooltip({ children, ...props }: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip {...props}>{children}</Tooltip>
}

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  payload?: any[]
  nameKey?: string
  labelKey?: string
}

export function ChartTooltipContent({
  label,
  hideLabel = false,
  hideIndicator = false,
  indicator = "line",
  payload,
  nameKey = "name",
  labelKey = "value",
  className,
  ...props
}: ChartTooltipContentProps) {
  const tooltipLabel = hideLabel ? null : (
    <div className="font-medium">{label}</div>
  )

  if (!payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl transition-all ease-in-out hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const indicatorColor = item.fill || item.color

          return (
            <div
              key={index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              <>
                {!hideIndicator && (
                  <div
                    className={cn(
                      "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                      {
                        "h-2.5 w-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent":
                          indicator === "dashed",
                        "my-0.5": nestLabel && indicator === "dashed",
                      }
                    )}
                    style={
                      {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor,
                      } as React.CSSProperties
                    }
                  />
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    nestLabel ? "items-end" : "items-center"
                  )}
                >
                  <div className="grid gap-1.5">
                    {nestLabel ? tooltipLabel : null}
                    <span className="text-muted-foreground">{item[nameKey]}</span>
                  </div>
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {item[labelKey]?.toLocaleString()}
                  </span>
                </div>
              </>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ChartLegend({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  nameKey?: string
  colorKey?: string
}

export function ChartLegendContent({
  data,
  nameKey = "name",
  colorKey = "color",
  className,
  ...props
}: ChartLegendContentProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item[colorKey] }}
          />
          <span className="text-sm text-muted-foreground">{item[nameKey]}</span>
        </div>
      ))}
    </div>
  )
}

export { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Area, AreaChart }
