"use client"

import { ResponsiveSankey } from "@nivo/sankey"

type SankeyData = {
  nodes: { id: string }[]
  links: { source: string; target: string; value: number }[]
}

export default function SankeyChart({ data }: { data: SankeyData }) {
  const hasData =
    !!data &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.links) &&
    data.nodes.length > 0 &&
    data.links.length > 0

  if (!hasData) {
    return (
      <div className="h-[260px] w-full flex items-center justify-center text-sm text-muted-foreground border rounded-md">
        No application flow yet
      </div>
    )
  }

  return (
    <div className="h-[260px] w-full min-w-0">
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
