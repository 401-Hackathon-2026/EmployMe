"use client"

import { ResponsiveSankey } from "@nivo/sankey"

export default function SankeyChart({ data }: { data: any }) {
  return (
    <div className="h-[260px]">
      <ResponsiveSankey
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        align="justify"
        colors={{ scheme: "category10" }}
        nodeThickness={14}
        nodeInnerPadding={4}
        linkOpacity={0.4}
        enableLinkGradient
      />
    </div>
  )
}
