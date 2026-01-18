"use client"

import { ResponsiveSankey } from "@nivo/sankey"

type SankeyData = {
  nodes: { id: string }[]
  links: { source: string; target: string; value: number }[]
}

export default function SankeyChart({ data }: { data: SankeyData }) {
  const hasData =
    data.nodes.length > 0 && data.links.length > 0

  if (!hasData) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-md border text-sm text-muted-foreground">
        No application flow yet
      </div>
    )
  }

  return (
    <div className="h-[420px] w-full">
      <ResponsiveSankey
        data={data}
        margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
        align="justify"
        colors={{ scheme: "category10" }}
        nodeThickness={18}
        nodeInnerPadding={6}
        linkOpacity={0.45}
        enableLinkGradient
        labelPosition="outside"
        labelPadding={8}
      />
    </div>
  )
}
