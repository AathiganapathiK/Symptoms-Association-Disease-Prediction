import React, { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";

function CoOccurrenceGraph({ rules }) {
  // ✅ Limit rules for performance
  const topRules = useMemo(() => {
    if (!rules) return [];
    return rules.slice(0, 5);
  }, [rules]);

  // ✅ Build graph data
  const graphData = useMemo(() => {
    if (!topRules.length) return { nodes: [], links: [] };
    const nodesMap = new Map();
    const links = [];

    topRules.forEach((rule) => {
      // Safely handle missing rules or absent if/then properties
      if (!rule || !rule.if || !rule.then) return;

      const fromList = rule.if.split(",").map((s) => s.trim()).filter(Boolean);
      const toList = rule.then.split(",").map((s) => s.trim()).filter(Boolean);

      fromList.forEach((from) => {
        toList.forEach((to) => {
          // Add nodes
          if (!nodesMap.has(from)) {
            nodesMap.set(from, { id: from });
          }
          if (!nodesMap.has(to)) {
            nodesMap.set(to, { id: to });
          }

          // Add link
          links.push({
            source: from,
            target: to,
            value: rule.confidence || 0,
          });
        });
      });
    });

    return {
      nodes: Array.from(nodesMap.values()),
      links,
    };
  }, [topRules]);

  // ❌ No data case
  if (!graphData.nodes.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow mt-4 text-gray-500">
        No strong co-occurrence relationships found.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <h3 className="font-semibold mb-2 text-gray-700">
        🔗 Symptom Relationship Graph
      </h3>

      <ForceGraph2D
        graphData={graphData}

        // 🧠 Node label tooltip
        nodeLabel={(node) => `Symptom: ${node.id}`}

        // 🔥 Link tooltip
        linkLabel={(link) =>
          `${link.source.id} → ${link.target.id}\nConfidence: ${(
            link.value * 100
          ).toFixed(1)}%`
        }

        // 🎨 Node styling
        nodeAutoColorBy="id"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.fillText(label, node.x + 5, node.y + 5);
        }}

        // 🔥 Link thickness based on confidence
        linkWidth={(link) => Math.max(1, link.value * 5)}

        // ✨ Smooth animation particles
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={(d) => d.value * 0.01}

        // ⚡ Performance tweaks
        cooldownTicks={50}
        d3VelocityDecay={0.3}

        height={300}
      />
    </div>
  );
}

export default CoOccurrenceGraph;